import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";
import { AppError } from "../errors/app-error";
import { ERROR_CODES } from "../constants/error-codes";

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError(ERROR_CODES.AUTH_UNAUTHORIZED, 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(ERROR_CODES.FORBIDDEN, 403));
    }

    next();
  };
};
