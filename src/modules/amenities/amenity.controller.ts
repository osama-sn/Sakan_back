import { Request, Response, NextFunction } from "express";
import { amenityService } from "./amenity.service";
import { ERROR_CODES } from "../../common/constants/error-codes";
import { sendSuccess } from "../../common/utils/response";

export class AmenityController {
  async getAllAmenities(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await amenityService.getAllAmenities();
      sendSuccess(res, ERROR_CODES.AMENITIES_RETRIEVED, result, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const amenityController = new AmenityController();
