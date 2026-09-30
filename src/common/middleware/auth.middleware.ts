import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";
import { ERROR_CODES } from "../constants/error-codes";
import { verifyAccessToken } from "../utils/jwt";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError(ERROR_CODES.AUTH_UNAUTHORIZED, 401));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new AppError(ERROR_CODES.AUTH_UNAUTHORIZED, 401));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.userId,
      role: payload.role
    };
    next();
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      return next(new AppError(ERROR_CODES.AUTH_TOKEN_EXPIRED, 401));
    }
    return next(new AppError(ERROR_CODES.AUTH_UNAUTHORIZED, 401));
  }
};

export const optionalAuthenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next();
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.userId,
      role: payload.role
    };
  } catch {
    // If token invalid, proceed unauthenticated
  }

  next();
};
