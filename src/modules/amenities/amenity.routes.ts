import { Router } from "express";
import { amenityController } from "./amenity.controller";

const router = Router();

router.get("/", (req, res, next) =>
  amenityController.getAllAmenities(req, res, next)
);

export const amenityRoutes = router;
