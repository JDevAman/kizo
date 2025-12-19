import config from "./config";
import { prisma } from "./lib/db";
import { createApp } from "./app";

const startServer = async () => {
  await prisma.$connect();

  const app = createApp();
  app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
  });
};

startServer();