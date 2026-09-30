import { Request, Response, NextFunction } from "express";
import { locationService } from "./location.service";
import { ERROR_CODES } from "../../common/constants/error-codes";
import { sendSuccess } from "../../common/utils/response";

export class LocationController {
  /**
   * GET /api/v1/locations
   * Returns list of Egyptian cities and their student districts/neighborhoods
   * Optional query params: ?city=الجيزة or ?search=الدقي
   */
  async getLocations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const city = req.query.city as string | undefined;
      const search = req.query.search as string | undefined;

      const result = await locationService.getAllLocations({ city, search });
      sendSuccess(res, ERROR_CODES.LOCATIONS_RETRIEVED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/locations/cities
   * Returns lightweight list of all cities/governorates
   */
  async getCities(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await locationService.getCities();
      sendSuccess(res, ERROR_CODES.LOCATIONS_RETRIEVED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/locations/cities/:city/areas
   * Returns the list of districts/neighborhoods for a specific city
   */
  async getAreasByCity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cityParam = req.params.city || "";
      const result = await locationService.getAreasByCity(cityParam);
      sendSuccess(res, ERROR_CODES.LOCATIONS_RETRIEVED, result, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const locationController = new LocationController();
