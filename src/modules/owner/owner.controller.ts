import { Request, Response, NextFunction } from "express";
import { ownerService } from "./owner.service";
import { ERROR_CODES } from "../../common/constants/error-codes";
import { sendSuccess } from "../../common/utils/response";

export class OwnerController {
  async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await ownerService.getDashboardStats(req.user!.id);
      sendSuccess(res, ERROR_CODES.OWNER_DASHBOARD_RETRIEVED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async getProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await ownerService.getOwnerProperties(req.user!.id);
      sendSuccess(res, ERROR_CODES.OWNER_PROPERTIES_RETRIEVED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async getBookingRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await ownerService.getOwnerBookingRequests(req.user!.id, req.query);
      sendSuccess(res, ERROR_CODES.OWNER_BOOKINGS_RETRIEVED, result, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const ownerController = new OwnerController();
