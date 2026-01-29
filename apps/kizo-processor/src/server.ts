import { createLogger } from "@kizo/logger";
import { createApp } from "./app.js";
import getConfig from "./config.js";

const startServer = async () => {
  const logger = createLogger("Kizo-Processor");
  const config = getConfig();
  const app = createApp();

  app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
  });
};

startServer();
