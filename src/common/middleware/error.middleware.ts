import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../errors/app-error";
import { ERROR_CODES } from "../constants/error-codes";
import { sendError } from "../utils/response";

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  if (process.env["NODE_ENV"] !== "production") {
    console.error("💥 Error handled by middleware:", err);
  }

  if (err instanceof AppError) {
    sendError(res, err.code, err.statusCode, err.errors ?? null);
    return;
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target = Array.isArray(err.meta?.["target"]) ? err.meta["target"].join(", ") : "";
      if (target.includes("email")) {
        sendError(res, ERROR_CODES.USER_EMAIL_ALREADY_EXISTS, 409);
        return;
      }
      if (target.includes("phone")) {
        sendError(res, ERROR_CODES.USER_PHONE_ALREADY_EXISTS, 409);
        return;
      }
      sendError(res, ERROR_CODES.VALIDATION_ERROR, 409, [{ field: "database", message: "Duplicate key violation" }]);
      return;
    }
  }

  // Fallback for unhandled internal server errors
  sendError(res, ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
};
