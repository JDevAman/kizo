import { initPrisma, getRedis } from "@kizo/db";
import getConfig from "./config.js";
import { createApp } from "./app.js";

const startServer = async () => {
  const config = getConfig();

  initPrisma(config.databaseUrl);
  const client = getRedis();
  await client.connect();

  const app = createApp();

  app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
  });
};

startServer();
