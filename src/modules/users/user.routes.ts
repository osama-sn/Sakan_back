import { Router } from "express";
import { userController } from "./user.controller";
import { authenticate, optionalAuthenticate } from "../../common/middleware/auth.middleware";
import { validateBody, validateQuery } from "../../common/middleware/validate.middleware";
import { updateProfileSchema, changePasswordSchema, queryRoommatesSchema } from "./user.validation";

const router = Router();

// Roommates Directory: Public or authenticated students
router.get("/roommates", optionalAuthenticate, validateQuery(queryRoommatesSchema), (req, res, next) =>
  userController.getRoommates(req, res, next)
);

router.get("/me", authenticate, (req, res, next) =>
  userController.getProfile(req, res, next)
);

router.patch("/me", authenticate, validateBody(updateProfileSchema), (req, res, next) =>
  userController.updateProfile(req, res, next)
);

router.patch(
  "/me/password",
  authenticate,
  validateBody(changePasswordSchema),
  (req, res, next) => userController.changePassword(req, res, next)
);

export const userRoutes = router;
