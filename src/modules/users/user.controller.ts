import { Request, Response, NextFunction } from "express";
import { userService } from "./user.service";
import { ERROR_CODES } from "../../common/constants/error-codes";
import { sendSuccess } from "../../common/utils/response";

export class UserController {
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await userService.getProfile(req.user!.id);
      sendSuccess(res, ERROR_CODES.USER_PROFILE_RETRIEVED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await userService.updateProfile(req.user!.id, req.body);
      sendSuccess(res, ERROR_CODES.USER_PROFILE_UPDATED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async getRoommates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await userService.getRoommates(req.query as any, req.user?.id);
      sendSuccess(res, ERROR_CODES.ROOMMATES_RETRIEVED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.changePassword(req.user!.id, req.body);
      sendSuccess(res, ERROR_CODES.USER_PASSWORD_UPDATED, null, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
