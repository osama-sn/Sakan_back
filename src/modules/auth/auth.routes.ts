import { Router } from "express";
import { authController } from "./auth.controller";
import { validateBody } from "../../common/middleware/validate.middleware";
import { authenticate } from "../../common/middleware/auth.middleware";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema
} from "./auth.validation";

const router = Router();

router.post("/register", validateBody(registerSchema), (req, res, next) =>
  authController.register(req, res, next)
);

router.post("/login", validateBody(loginSchema), (req, res, next) =>
  authController.login(req, res, next)
);

router.post("/refresh-token", validateBody(refreshTokenSchema), (req, res, next) =>
  authController.refreshToken(req, res, next)
);

router.post("/logout", validateBody(logoutSchema), (req, res, next) =>
  authController.logout(req, res, next)
);

router.get("/me", authenticate, (req, res, next) =>
  authController.me(req, res, next)
);

router.get("/registration-options", (req, res, next) =>
  authController.getRegistrationOptions(req, res, next)
);

router.get("/options", (req, res, next) =>
  authController.getRegistrationOptions(req, res, next)
);

export const authRoutes = router;
