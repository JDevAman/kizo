import { createApp } from "./app.js";
import "./lib/db.js";
import getConfig from "./config.js";

const startServer = async () => {
  const config = getConfig();
  const app = createApp();

  app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
  });
};

startServer();
