import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { ERROR_CODES } from "../../common/constants/error-codes";
import { sendSuccess } from "../../common/utils/response";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body);
      sendSuccess(res, ERROR_CODES.AUTH_ACCOUNT_CREATED, result, 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      sendSuccess(res, ERROR_CODES.AUTH_LOGIN_SUCCESS, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.refreshToken(req.body.refreshToken);
      sendSuccess(res, ERROR_CODES.AUTH_LOGIN_SUCCESS, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.logout(req.body.refreshToken);
      sendSuccess(res, ERROR_CODES.AUTH_LOGOUT_SUCCESS, null, 200);
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.getCurrentUser(req.user!.id);
      sendSuccess(res, ERROR_CODES.AUTH_CURRENT_USER_RETRIEVED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async getRegistrationOptions(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = authService.getRegistrationOptions();
      sendSuccess(res, ERROR_CODES.AUTH_REGISTRATION_OPTIONS_RETRIEVED, result, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
