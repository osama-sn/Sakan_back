import { ErrorCode } from "../constants/error-codes";

export interface ValidationErrorItem {
  field: string;
  message: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode | string;
  public readonly errors?: ValidationErrorItem[] | null;

  constructor(
    code: ErrorCode | string,
    statusCode: number = 400,
    errors: ValidationErrorItem[] | null = null
  ) {
    super(code);
    this.code = code;
    this.statusCode = statusCode;
    this.errors = errors;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
