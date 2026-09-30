import { Request, Response, NextFunction } from "express";
import { roomService } from "./room.service";
import { ERROR_CODES } from "../../common/constants/error-codes";
import { sendSuccess } from "../../common/utils/response";
import { AppError } from "../../common/errors/app-error";

export class RoomController {
  async createRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await roomService.createRoom(
        req.user!.id,
        req.params["propertyId"]!,
        req.body
      );
      sendSuccess(res, ERROR_CODES.ROOM_CREATED, result, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await roomService.updateRoom(
        req.user!.id,
        req.params["roomId"]!,
        req.body
      );
      sendSuccess(res, ERROR_CODES.ROOM_UPDATED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async deactivateRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await roomService.deactivateRoom(req.user!.id, req.params["roomId"]!);
      sendSuccess(res, ERROR_CODES.ROOM_DEACTIVATED, null, 200);
    } catch (error) {
      next(error);
    }
  }

  async getPropertyRooms(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await roomService.getPropertyRooms(
        req.params["propertyId"]!,
        req.query
      );
      sendSuccess(res, ERROR_CODES.ROOMS_RETRIEVED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async getRoomDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await roomService.getRoomDetails(req.params["roomId"]!);
      sendSuccess(res, ERROR_CODES.ROOM_RETRIEVED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async uploadImages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 400, [
          { field: "images", message: "At least one image is required" }
        ]);
      }

      const result = await roomService.uploadImages(
        req.user!.id,
        req.params["roomId"]!,
        files
      );
      sendSuccess(res, ERROR_CODES.ROOM_IMAGE_UPLOADED, result, 201);
    } catch (error) {
      next(error);
    }
  }

  async deleteImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await roomService.deleteImage(
        req.user!.id,
        req.params["roomId"]!,
        req.params["imageId"]!
      );
      sendSuccess(res, ERROR_CODES.ROOM_IMAGE_DELETED, null, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const roomController = new RoomController();
