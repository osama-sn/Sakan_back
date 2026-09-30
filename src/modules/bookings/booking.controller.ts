import { Request, Response, NextFunction } from "express";
import { bookingService } from "./booking.service";
import { ERROR_CODES } from "../../common/constants/error-codes";
import { sendSuccess } from "../../common/utils/response";

export class BookingController {
  async createBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await bookingService.createBooking(req.user!.id, req.body);
      sendSuccess(res, ERROR_CODES.BOOKING_CREATED, result, 201);
    } catch (error) {
      next(error);
    }
  }

  async getMyBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await bookingService.getMyBookings(req.user!.id, req.query);
      sendSuccess(res, ERROR_CODES.BOOKINGS_RETRIEVED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async approveBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await bookingService.approveBooking(
        req.user!.id,
        req.params["bookingId"]!
      );
      sendSuccess(res, ERROR_CODES.BOOKING_APPROVED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async rejectBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await bookingService.rejectBooking(
        req.user!.id,
        req.params["bookingId"]!,
        req.body.reason
      );
      sendSuccess(res, ERROR_CODES.BOOKING_REJECTED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async cancelBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await bookingService.cancelBooking(
        req.user!.id,
        req.params["bookingId"]!
      );
      sendSuccess(res, ERROR_CODES.BOOKING_CANCELLED, result, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const bookingController = new BookingController();
