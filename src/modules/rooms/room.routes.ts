import { Router } from "express";
import { roomController } from "./room.controller";
import { authenticate } from "../../common/middleware/auth.middleware";
import { authorizeRoles } from "../../common/middleware/role.middleware";
import { validateBody } from "../../common/middleware/validate.middleware";
import { upload } from "../uploads/storage.service";
import { updateRoomSchema } from "./room.validation";

const router = Router();

// Room details: Public
router.get("/:roomId", (req, res, next) =>
  roomController.getRoomDetails(req, res, next)
);

// Update room: OWNER only
router.patch(
  "/:roomId",
  authenticate,
  authorizeRoles("OWNER"),
  validateBody(updateRoomSchema),
  (req, res, next) => roomController.updateRoom(req, res, next)
);

// Deactivate room: OWNER only
router.delete("/:roomId", authenticate, authorizeRoles("OWNER"), (req, res, next) =>
  roomController.deactivateRoom(req, res, next)
);

// Upload room images: OWNER only
router.post(
  "/:roomId/images",
  authenticate,
  authorizeRoles("OWNER"),
  upload.array("images", 5),
  (req, res, next) => roomController.uploadImages(req, res, next)
);

// Delete room image: OWNER only
router.delete(
  "/:roomId/images/:imageId",
  authenticate,
  authorizeRoles("OWNER"),
  (req, res, next) => roomController.deleteImage(req, res, next)
);

export const roomRoutes = router;
