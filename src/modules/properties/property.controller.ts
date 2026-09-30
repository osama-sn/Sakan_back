import { Request, Response, NextFunction } from "express";
import { propertyService } from "./property.service";
import { ERROR_CODES } from "../../common/constants/error-codes";
import { sendSuccess } from "../../common/utils/response";
import { AppError } from "../../common/errors/app-error";

export class PropertyController {
  async createProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await propertyService.createProperty(req.user!.id, req.body);
      sendSuccess(res, ERROR_CODES.PROPERTY_CREATED, result, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await propertyService.updateProperty(
        req.user!.id,
        req.params["propertyId"]!,
        req.body
      );
      sendSuccess(res, ERROR_CODES.PROPERTY_UPDATED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const permanent = req.query.permanent === "true" || req.query.force === "true";
      const result = await propertyService.deleteProperty(
        req.user!.id,
        req.params["propertyId"]!,
        permanent
      );
      const code = result.permanent
        ? ERROR_CODES.PROPERTY_DELETED
        : ERROR_CODES.PROPERTY_DEACTIVATED;
      sendSuccess(res, code, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async deactivateProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
    return this.deleteProperty(req, res, next);
  }

  async getProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUserId = req.user?.id;
      const result = await propertyService.getProperties(req.query, currentUserId);
      sendSuccess(res, ERROR_CODES.PROPERTIES_RETRIEVED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async getPropertyDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUserId = req.user?.id;
      const viewerIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || req.socket.remoteAddress;
      const result = await propertyService.getPropertyDetails(
        req.params["propertyId"]!,
        currentUserId,
        viewerIp
      );
      sendSuccess(res, ERROR_CODES.PROPERTY_RETRIEVED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async recordView(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUserId = req.user?.id;
      const viewerIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || req.socket.remoteAddress;
      const result = await propertyService.recordPropertyView(
        req.params["propertyId"]!,
        currentUserId,
        viewerIp
      );
      sendSuccess(res, ERROR_CODES.PROPERTY_VIEW_RECORDED, result, 200);
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

      const result = await propertyService.uploadImages(
        req.user!.id,
        req.params["propertyId"]!,
        files
      );
      sendSuccess(res, ERROR_CODES.PROPERTY_IMAGE_UPLOADED, result, 201);
    } catch (error) {
      next(error);
    }
  }

  async deleteImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await propertyService.deleteImage(
        req.user!.id,
        req.params["propertyId"]!,
        req.params["imageId"]!
      );
      sendSuccess(res, ERROR_CODES.PROPERTY_IMAGE_DELETED, null, 200);
    } catch (error) {
      next(error);
    }
  }

  async reorderImages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await propertyService.reorderImages(
        req.user!.id,
        req.params["propertyId"]!,
        req.body
      );
      sendSuccess(res, ERROR_CODES.PROPERTY_IMAGES_REORDERED, null, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const propertyController = new PropertyController();
