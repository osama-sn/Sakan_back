import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

const PORT = env.PORT;

const server = app.listen(PORT, async () => {
  console.log(`=============================================`);
  console.log(`🚀 SAKAN Backend Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
  console.log(`📖 Swagger docs available at http://localhost:${PORT}/api/docs`);
  console.log(`🩺 Health check available at http://localhost:${PORT}/health`);
  console.log(`=============================================`);

  try {
    await prisma.$connect();
    console.log("✅ Database connection established successfully");
  } catch (error) {
    console.error("⚠️ Database connection failed:", error);
  }
});

// Graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  server.close(async () => {
    console.log("🔒 HTTP server closed.");
    await prisma.$disconnect();
    console.log("🔌 Database disconnected.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
