import { Router } from "express";
import { propertyController } from "./property.controller";
import { authenticate, optionalAuthenticate } from "../../common/middleware/auth.middleware";
import { authorizeRoles } from "../../common/middleware/role.middleware";
import { validateBody, validateQuery } from "../../common/middleware/validate.middleware";
import { upload } from "../uploads/storage.service";
import { roomController } from "../rooms/room.controller";
import { createRoomSchema, queryPropertyRoomsSchema } from "../rooms/room.validation";
import {
  createPropertySchema,
  updatePropertySchema,
  queryPropertiesSchema,
  reorderImagesSchema
} from "./property.validation";

const router = Router();

// Public property listing with optional authentication for favorite status
router.get("/", optionalAuthenticate, validateQuery(queryPropertiesSchema), (req, res, next) =>
  propertyController.getProperties(req, res, next)
);

// Create property: OWNER only
router.post(
  "/",
  authenticate,
  authorizeRoles("OWNER"),
  validateBody(createPropertySchema),
  (req, res, next) => propertyController.createProperty(req, res, next)
);

// Property details: Public with optional authentication
router.get("/:propertyId", optionalAuthenticate, (req, res, next) =>
  propertyController.getPropertyDetails(req, res, next)
);

// Record unique view: Public with optional authentication
router.post("/:propertyId/view", optionalAuthenticate, (req, res, next) =>
  propertyController.recordView(req, res, next)
);

// Update property: OWNER only
router.patch(
  "/:propertyId",
  authenticate,
  authorizeRoles("OWNER"),
  validateBody(updatePropertySchema),
  (req, res, next) => propertyController.updateProperty(req, res, next)
);

// Deactivate property: OWNER only
router.delete("/:propertyId", authenticate, authorizeRoles("OWNER"), (req, res, next) =>
  propertyController.deactivateProperty(req, res, next)
);

// Upload property images: OWNER only
router.post(
  "/:propertyId/images",
  authenticate,
  authorizeRoles("OWNER"),
  upload.array("images", 10),
  (req, res, next) => propertyController.uploadImages(req, res, next)
);

// Delete property image: OWNER only
router.delete(
  "/:propertyId/images/:imageId",
  authenticate,
  authorizeRoles("OWNER"),
  (req, res, next) => propertyController.deleteImage(req, res, next)
);

// Reorder property images: OWNER only
router.patch(
  "/:propertyId/images/order",
  authenticate,
  authorizeRoles("OWNER"),
  validateBody(reorderImagesSchema),
  (req, res, next) => propertyController.reorderImages(req, res, next)
);

// Get rooms of a property: Public
router.get("/:propertyId/rooms", validateQuery(queryPropertyRoomsSchema), (req, res, next) =>
  roomController.getPropertyRooms(req, res, next)
);

// Create room in a property: OWNER only
router.post(
  "/:propertyId/rooms",
  authenticate,
  authorizeRoles("OWNER"),
  validateBody(createRoomSchema),
  (req, res, next) => roomController.createRoom(req, res, next)
);

export const propertyRoutes = router;
