import { Router } from "express";
import { notificationController } from "./notification.controller";
import { authenticate } from "../../common/middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, (req, res, next) =>
  notificationController.getNotifications(req, res, next)
);

router.get("/unread-count", authenticate, (req, res, next) =>
  notificationController.getUnreadCount(req, res, next)
);

router.patch("/read-all", authenticate, (req, res, next) =>
  notificationController.markAllAsRead(req, res, next)
);

router.patch("/:notificationId/read", authenticate, (req, res, next) =>
  notificationController.markAsRead(req, res, next)
);

export const notificationRoutes = router;
