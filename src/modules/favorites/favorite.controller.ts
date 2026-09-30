import { Request, Response, NextFunction } from "express";
import { favoriteService } from "./favorite.service";
import { ERROR_CODES } from "../../common/constants/error-codes";
import { sendSuccess } from "../../common/utils/response";

export class FavoriteController {
  async addFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await favoriteService.addFavorite(
        req.user!.id,
        req.params["propertyId"]!
      );
      sendSuccess(res, ERROR_CODES.FAVORITE_ADDED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async removeFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await favoriteService.removeFavorite(
        req.user!.id,
        req.params["propertyId"]!
      );
      sendSuccess(res, ERROR_CODES.FAVORITE_REMOVED, null, 200);
    } catch (error) {
      next(error);
    }
  }

  async getFavorites(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await favoriteService.getFavorites(req.user!.id, req.query);
      sendSuccess(res, ERROR_CODES.FAVORITES_RETRIEVED, result, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const favoriteController = new FavoriteController();
