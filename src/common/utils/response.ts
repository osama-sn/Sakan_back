import { Response } from "express";
import { translate } from "../i18n/translate";

export interface ApiResponse<T = unknown> {
  success: boolean;
  code: string;
  message: string;
  data?: T;
  errors?: unknown;
}

export const sendSuccess = <T>(
  res: Response,
  code: string,
  data?: T,
  statusCode: number = 200
): Response => {
  const language = res.req.language || "ar";
  const message = translate(code, language);

  const body: ApiResponse<T> = {
    success: true,
    code,
    message,
    ...(data !== undefined && { data })
  };

  return res.status(statusCode).json(body);
};

export const sendError = (
  res: Response,
  code: string,
  statusCode: number = 400,
  errors: unknown = null
): Response => {
  const language = res.req.language || "ar";
  const message = translate(code, language);

  const body: ApiResponse = {
    success: false,
    code,
    message,
    errors
  };

  return res.status(statusCode).json(body);
};
