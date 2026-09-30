import { Router } from "express";
import { ownerController } from "./owner.controller";
import { authenticate } from "../../common/middleware/auth.middleware";
import { authorizeRoles } from "../../common/middleware/role.middleware";

import { propertyController } from "../properties/property.controller";

const router = Router();

// All owner routes require authentication and OWNER role
router.use(authenticate, authorizeRoles("OWNER"));

router.get("/dashboard", (req, res, next) =>
  ownerController.getDashboard(req, res, next)
);

router.get("/properties", (req, res, next) =>
  ownerController.getProperties(req, res, next)
);

router.delete("/properties/:propertyId", (req, res, next) =>
  propertyController.deleteProperty(req, res, next)
);

router.get("/booking-requests", (req, res, next) =>
  ownerController.getBookingRequests(req, res, next)
);

export const ownerRoutes = router;
