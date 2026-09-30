import { prisma } from "../../config/prisma";
import { AppError } from "../../common/errors/app-error";
import { ERROR_CODES } from "../../common/constants/error-codes";
import { hashPassword, comparePassword } from "../../common/utils/password";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "../../common/utils/jwt";
import {
  RegisterInput,
  LoginInput
} from "./auth.validation";
import { REGISTRATION_OPTIONS } from "./registration-options.data";

// Helper to remove sensitive fields
export const sanitizeUser = (user: {
  id: string;
  fullName?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: string;
  profileImage: string | null;
  bio: string | null;
  gender: string | null;
  governorate?: string | null;
  university?: string | null;
  faculty?: string | null;
  major?: string | null;
  academicYear?: string | null;
  housingStatus?: string | null;
  interests?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}) => {
  return {
    id: user.id,
    fullName: user.fullName || `${user.firstName} ${user.lastName}`.trim(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    profileImage: user.profileImage,
    bio: user.bio,
    gender: user.gender,
    governorate: user.governorate ?? null,
    university: user.university ?? null,
    faculty: user.faculty ?? null,
    major: user.major ?? null,
    academicYear: user.academicYear ?? null,
    housingStatus: user.housingStatus ?? null,
    interests: user.interests ?? null,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

export class AuthService {
  async register(input: RegisterInput) {
    const existingEmail = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() }
    });

    if (existingEmail) {
      throw new AppError(ERROR_CODES.USER_EMAIL_ALREADY_EXISTS, 409);
    }

    if (input.phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone: input.phone }
      });
      if (existingPhone) {
        throw new AppError(ERROR_CODES.USER_PHONE_ALREADY_EXISTS, 409);
      }
    }

    const passwordHash = await hashPassword(input.password);

    // Derive names if fullName is provided
    let firstName = input.firstName;
    let lastName = input.lastName;
    let fullName = input.fullName;

    if (fullName && (!firstName || !lastName)) {
      const parts = fullName.trim().split(/\s+/);
      firstName = parts[0] || "";
      lastName = parts.slice(1).join(" ") || parts[0] || "";
    } else if (!fullName && firstName && lastName) {
      fullName = `${firstName} ${lastName}`.trim();
    }

    const user = await prisma.user.create({
      data: {
        fullName: fullName || null,
        firstName: firstName || "",
        lastName: lastName || "",
        email: input.email.toLowerCase(),
        phone: input.phone || null,
        passwordHash,
        role: input.role,
        gender: input.gender || null,
        governorate: input.governorate || null,
        university: input.university || null,
        faculty: input.faculty || null,
        major: input.major || null,
        academicYear: input.academicYear || null,
        isActive: true
      }
    });

    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt
      }
    });

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken
    };
  }

  async login(input: LoginInput) {
    const rawIdentifier = (input.identifier || input.email || input.phone || "").trim();

    if (!rawIdentifier) {
      throw new AppError(ERROR_CODES.AUTH_INVALID_CREDENTIALS, 401);
    }

    const isEmail = rawIdentifier.includes("@");

    const user = await prisma.user.findFirst({
      where: isEmail
        ? { email: rawIdentifier.toLowerCase() }
        : {
            OR: [
              { phone: rawIdentifier },
              { email: rawIdentifier.toLowerCase() }
            ]
          }
    });

    if (!user) {
      throw new AppError(ERROR_CODES.AUTH_INVALID_CREDENTIALS, 401);
    }

    if (!user.isActive) {
      throw new AppError(ERROR_CODES.AUTH_ACCOUNT_INACTIVE, 403);
    }

    const isMatch = await comparePassword(input.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError(ERROR_CODES.AUTH_INVALID_CREDENTIALS, 401);
    }

    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt
      }
    });

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken
    };
  }

  async refreshToken(refreshTokenString: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshTokenString);
    } catch {
      throw new AppError(ERROR_CODES.AUTH_INVALID_REFRESH_TOKEN, 401);
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshTokenString }
    });

    if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
      throw new AppError(ERROR_CODES.AUTH_INVALID_REFRESH_TOKEN, 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    });

    if (!user || !user.isActive) {
      throw new AppError(ERROR_CODES.AUTH_INVALID_REFRESH_TOKEN, 401);
    }

    // Rotate refresh token: revoke old one
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true }
    });

    const newAccessToken = generateAccessToken({ userId: user.id, role: user.role });
    const newRefreshToken = generateRefreshToken({ userId: user.id, role: user.role });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt
      }
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  async logout(refreshTokenString: string) {
    try {
      await prisma.refreshToken.updateMany({
        where: { token: refreshTokenString },
        data: { isRevoked: true }
      });
    } catch {
      // Ignore if not found
    }
    return true;
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, 404);
    }

    return sanitizeUser(user);
  }

  getRegistrationOptions() {
    return REGISTRATION_OPTIONS;
  }
}

export const authService = new AuthService();
