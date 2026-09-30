import { prisma } from "../../config/prisma";
import { AppError } from "../../common/errors/app-error";
import { ERROR_CODES } from "../../common/constants/error-codes";
import { comparePassword, hashPassword } from "../../common/utils/password";
import { getPaginationParams, buildPaginationMeta } from "../../common/utils/pagination";
import { sanitizeUser } from "../auth/auth.service";
import { UpdateProfileInput, ChangePasswordInput, QueryRoommatesInput } from "./user.validation";

export class UserService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, 404);
    }

    return sanitizeUser(user);
  }

  async getRoommates(query: QueryRoommatesInput, currentUserId?: string) {
    const pagination = getPaginationParams(query);

    const where: any = {
      role: "STUDENT",
      isActive: true,
      ...(currentUserId && { id: { not: currentUserId } })
    };

    // Smart Matching with logged in student's profile
    if (query.matchMyProfile === "true" && currentUserId) {
      const me = await prisma.user.findUnique({ where: { id: currentUserId } });
      if (me) {
        const matchingConditions: any[] = [];
        if (me.university) {
          matchingConditions.push({ university: { equals: me.university, mode: "insensitive" } });
        }
        if (me.faculty) {
          matchingConditions.push({ faculty: { equals: me.faculty, mode: "insensitive" } });
        }
        if (me.governorate) {
          matchingConditions.push({ governorate: { equals: me.governorate, mode: "insensitive" } });
        }
        if (matchingConditions.length > 0) {
          where.OR = matchingConditions;
        }
        // Match same gender by default for student housing compatibility
        if (me.gender) {
          where.gender = me.gender;
        }
      }
    }

    if (query.governorate) {
      where.governorate = { contains: query.governorate.trim(), mode: "insensitive" };
    }

    if (query.university) {
      where.university = { contains: query.university.trim(), mode: "insensitive" };
    }

    if (query.faculty) {
      where.faculty = { contains: query.faculty.trim(), mode: "insensitive" };
    }

    if (query.housingStatus) {
      where.housingStatus = { contains: query.housingStatus.trim(), mode: "insensitive" };
    }

    if (query.gender) {
      where.gender = query.gender;
    }

    if (query.search) {
      const search = query.search.trim();
      const searchOr = [
        { fullName: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { university: { contains: search, mode: "insensitive" } },
        { faculty: { contains: search, mode: "insensitive" } },
        { major: { contains: search, mode: "insensitive" } },
        { governorate: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } },
        { interests: { contains: search, mode: "insensitive" } }
      ];

      if (where.OR) {
        where.AND = [{ OR: where.OR }, { OR: searchOr }];
        delete where.OR;
      } else {
        where.OR = searchOr;
      }
    }

    const [totalItems, students] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: "desc" }
      })
    ]);

    const items = students.map((s) => ({
      id: s.id,
      fullName: s.fullName || `${s.firstName} ${s.lastName}`.trim(),
      profileImage: s.profileImage,
      gender: s.gender,
      university: s.university,
      faculty: s.faculty,
      major: s.major,
      academicYear: s.academicYear,
      governorate: s.governorate,
      housingStatus: s.housingStatus || "يبحث عن شريك سكن",
      bio: s.bio,
      interests: s.interests
        ? s.interests
            .split(/[,،]+/)
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      phone: s.phone
    }));

    return {
      items,
      pagination: buildPaginationMeta(totalItems, pagination.page, pagination.limit)
    };
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    if (input.phone) {
      const existingPhone = await prisma.user.findFirst({
        where: {
          phone: input.phone,
          NOT: { id: userId }
        }
      });
      if (existingPhone) {
        throw new AppError(ERROR_CODES.USER_PHONE_ALREADY_EXISTS, 409);
      }
    }

    let firstName = input.firstName;
    let lastName = input.lastName;
    let fullName = input.fullName;

    if (fullName && (!firstName || !lastName)) {
      const parts = fullName.trim().split(/\s+/);
      firstName = parts[0] || "";
      lastName = parts.slice(1).join(" ") || parts[0] || "";
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(input.phone !== undefined && { phone: input.phone }),
        ...(input.bio !== undefined && { bio: input.bio }),
        ...(input.profileImage !== undefined && { profileImage: input.profileImage }),
        ...(input.gender !== undefined && { gender: input.gender }),
        ...(input.governorate !== undefined && { governorate: input.governorate }),
        ...(input.university !== undefined && { university: input.university }),
        ...(input.faculty !== undefined && { faculty: input.faculty }),
        ...(input.major !== undefined && { major: input.major }),
        ...(input.academicYear !== undefined && { academicYear: input.academicYear }),
        ...(input.housingStatus !== undefined && { housingStatus: input.housingStatus }),
        ...(input.interests !== undefined && { interests: input.interests })
      }
    });

    return sanitizeUser(updatedUser);
  }

  async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, 404);
    }

    const isMatch = await comparePassword(input.currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new AppError(ERROR_CODES.USER_CURRENT_PASSWORD_INVALID, 400);
    }

    const newPasswordHash = await hashPassword(input.newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash }
    });

    // Revoke all refresh tokens on password change for security
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true }
    });

    return true;
  }
}

export const userService = new UserService();
