import { Router } from "express";
import { bookingController } from "./booking.controller";
import { authenticate } from "../../common/middleware/auth.middleware";
import { authorizeRoles } from "../../common/middleware/role.middleware";
import { validateBody, validateQuery } from "../../common/middleware/validate.middleware";
import {
  createBookingSchema,
  rejectBookingSchema,
  queryBookingsSchema
} from "./booking.validation";

const router = Router();

// Create booking request: STUDENT only
router.post(
  "/",
  authenticate,
  authorizeRoles("STUDENT"),
  validateBody(createBookingSchema),
  (req, res, next) => bookingController.createBooking(req, res, next)
);

// Student's own booking requests: STUDENT only
router.get(
  "/my",
  authenticate,
  authorizeRoles("STUDENT"),
  validateQuery(queryBookingsSchema),
  (req, res, next) => bookingController.getMyBookings(req, res, next)
);

// Approve booking: OWNER only
router.patch(
  "/:bookingId/approve",
  authenticate,
  authorizeRoles("OWNER"),
  (req, res, next) => bookingController.approveBooking(req, res, next)
);

// Reject booking: OWNER only
router.patch(
  "/:bookingId/reject",
  authenticate,
  authorizeRoles("OWNER"),
  validateBody(rejectBookingSchema),
  (req, res, next) => bookingController.rejectBooking(req, res, next)
);

// Cancel booking: STUDENT only
router.patch(
  "/:bookingId/cancel",
  authenticate,
  authorizeRoles("STUDENT"),
  (req, res, next) => bookingController.cancelBooking(req, res, next)
);

export const bookingRoutes = router;
