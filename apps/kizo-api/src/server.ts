import { initPrisma, getPrisma } from "@kizo/db";
import { getRedis } from "@kizo/queue";
import { createLogger } from "@kizo/logger";
import getConfig from "./config.js";
import { createApp } from "./app.js";
import { initSupabase } from "./lib/storage.js";

const logger = createLogger("Kizo-API");
const startServer = async () => {
  const config = getConfig();

  try {
    // 1. Initialize Database
    initSupabase(config.supabaseUrl, config.supabaseServiceRoleKey);
    initPrisma(config.databaseUrl);
    await getPrisma().$connect();
    logger.info("✅ Database connected successfully");

    // 2. Initialize Redis (node-redis)
    const redis = getRedis();
    if (!redis.isOpen) {
      redis.on("error", (err) => logger.error(err, "❌ Redis Client Error"));
      await redis.connect();
    }
    logger.info("✅ Redis connected successfully");

    // 3. Create and Start App
    const app = createApp();
    const server = app.listen(config.beport, () => {
      logger.info(
        `🚀 Server running on port ${config.beport} [${process.env.NODE_ENV}]`,
      );
    });

    // 4. Graceful Shutdown (The "Senior" Move)
    process.on("SIGTERM", () => {
      logger.info("SIGTERM received. Cleaning up...");
      server.close(async () => {
        await getPrisma().$disconnect();
        await redis.quit();
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error(error, "💥 Failed to start server:");
    process.exit(1);
  }
};

startServer();
export { logger };
