import path from "path";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { swaggerSpec } from "./config/swagger";
import { languageMiddleware } from "./common/middleware/language.middleware";
import { errorMiddleware } from "./common/middleware/error.middleware";
import { notFoundMiddleware } from "./common/middleware/not-found.middleware";
import { sendSuccess } from "./common/utils/response";
import { ERROR_CODES } from "./common/constants/error-codes";
import { apiRouter } from "./routes";

const app = express();

// Security middleware
app.use(helmet());

// CORS setup
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true
  })
);

// Logging
if (env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Static files for local uploads
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Language middleware (Extracts Accept-Language, defaults to 'ar')
app.use(languageMiddleware);

// Health check endpoint (Public)
app.get("/health", (_req, res) => {
  return sendSuccess(res, ERROR_CODES.HEALTH_CHECK_SUCCESS, {
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Swagger documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount main /api/v1 API router
app.use("/api/v1", apiRouter);

// 404 Not Found Middleware
app.use(notFoundMiddleware);

// Centralized Error Handling Middleware
app.use(errorMiddleware);

export default app;
