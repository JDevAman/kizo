import { createLogger } from "@kizo/logger";
import { createApp } from "./app.js";
import getConfig from "./config.js";

const logger = createLogger("Kizo-Processor");
const startServer = async () => {
  const config = getConfig();
  try {
    const app = createApp();

    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });

    process.on("SIGTERM", () => {
      logger.info("SIGTERM received. Cleaning up...");
      server.close(async () => {
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
