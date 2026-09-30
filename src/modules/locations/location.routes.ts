import { Router } from "express";
import { locationController } from "./location.controller";

const router = Router();

// GET /api/v1/locations - All cities with areas (with search / city filter)
router.get("/", (req, res, next) => locationController.getLocations(req, res, next));

// GET /api/v1/locations/cities - List of cities only
router.get("/cities", (req, res, next) => locationController.getCities(req, res, next));

// GET /api/v1/locations/cities/:city/areas - Areas of a specific city
router.get("/cities/:city/areas", (req, res, next) => locationController.getAreasByCity(req, res, next));

export const locationRoutes = router;
