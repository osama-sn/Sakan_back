import { Request, Response } from "express";
import { ERROR_CODES } from "../constants/error-codes";
import { sendError } from "../utils/response";

export const notFoundMiddleware = (_req: Request, res: Response): void => {
  sendError(res, ERROR_CODES.NOT_FOUND, 404);
};
