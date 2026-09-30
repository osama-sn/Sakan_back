import { Request, Response, NextFunction } from "express";
import { notificationService } from "./notification.service";
import { ERROR_CODES } from "../../common/constants/error-codes";
import { sendSuccess } from "../../common/utils/response";

export class NotificationController {
  async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await notificationService.getNotifications(req.user!.id, req.query);
      sendSuccess(res, ERROR_CODES.NOTIFICATIONS_RETRIEVED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await notificationService.getUnreadCount(req.user!.id);
      sendSuccess(res, ERROR_CODES.NOTIFICATIONS_UNREAD_COUNT_RETRIEVED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await notificationService.markAsRead(
        req.user!.id,
        req.params["notificationId"]!
      );
      sendSuccess(res, ERROR_CODES.NOTIFICATION_MARKED_READ, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await notificationService.markAllAsRead(req.user!.id);
      sendSuccess(res, ERROR_CODES.NOTIFICATIONS_ALL_MARKED_READ, null, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const notificationController = new NotificationController();
