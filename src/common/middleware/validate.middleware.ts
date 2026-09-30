import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError, ValidationErrorItem } from "../errors/app-error";
import { ERROR_CODES } from "../constants/error-codes";

export const validateBody = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: ValidationErrorItem[] = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message
        }));
        next(new AppError(ERROR_CODES.VALIDATION_ERROR, 422, errors));
      } else {
        next(error);
      }
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.query = (await schema.parseAsync(req.query)) as Request["query"];
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: ValidationErrorItem[] = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message
        }));
        next(new AppError(ERROR_CODES.VALIDATION_ERROR, 422, errors));
      } else {
        next(error);
      }
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.params = (await schema.parseAsync(req.params)) as Request["params"];
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: ValidationErrorItem[] = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message
        }));
        next(new AppError(ERROR_CODES.VALIDATION_ERROR, 422, errors));
      } else {
        next(error);
      }
    }
  };
};
