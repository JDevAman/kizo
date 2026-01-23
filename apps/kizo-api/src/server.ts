import { initPrisma, getRedis } from "@kizo/db";
import { createLogger } from "@kizo/logger";
import getConfig from "./config.js";
import { createApp } from "./app.js";

const startServer = async () => {
  const config = getConfig();

  const logger = createLogger("kizo-api");

  initPrisma(config.databaseUrl);

  const client = getRedis();
  client.on("error", (err) => console.error("❌ Redis Client Error", err));
  await client.connect();
  console.log("✅ Redis connected successfully");

  const app = createApp();
  app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
  });
};

startServer();
