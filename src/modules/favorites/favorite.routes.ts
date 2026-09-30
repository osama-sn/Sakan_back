import { Router } from "express";
import { favoriteController } from "./favorite.controller";
import { authenticate } from "../../common/middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, (req, res, next) =>
  favoriteController.getFavorites(req, res, next)
);

router.post("/:propertyId", authenticate, (req, res, next) =>
  favoriteController.addFavorite(req, res, next)
);

router.delete("/:propertyId", authenticate, (req, res, next) =>
  favoriteController.removeFavorite(req, res, next)
);

export const favoriteRoutes = router;
