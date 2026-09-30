import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { userRoutes } from "../modules/users/user.routes";
import { propertyRoutes } from "../modules/properties/property.routes";
import { roomRoutes } from "../modules/rooms/room.routes";
import { bookingRoutes } from "../modules/bookings/booking.routes";
import { favoriteRoutes } from "../modules/favorites/favorite.routes";
import { notificationRoutes } from "../modules/notifications/notification.routes";
import { amenityRoutes } from "../modules/amenities/amenity.routes";
import { ownerRoutes } from "../modules/owner/owner.routes";
import { locationRoutes } from "../modules/locations/location.routes";
import { conversationRoutes } from "../modules/conversations/conversation.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/properties", propertyRoutes);
router.use("/rooms", roomRoutes);
router.use("/booking-requests", bookingRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/notifications", notificationRoutes);
router.use("/amenities", amenityRoutes);
router.use("/owner", ownerRoutes);
router.use("/locations", locationRoutes);
router.use("/conversations", conversationRoutes);

export const apiRouter = router;
