import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import getConfig from "./config.js";
import mainRouter from "./routes/main.routes.js";
import docsRouter from "./docs.js";
import { logger } from "./server.js";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export const createApp = () => {
  const app = express();
  const config = getConfig();
  // Middlewares
  app.use(express.json());
  app.use(
    cors({
      origin: config.frontendURL,
      credentials: true,
    }),
  );
  app.use(cookieParser());

  // Routes
  app.use("/api/v1", docsRouter);
  app.use("/api/v1", mainRouter);

  // Error handler
  app.use((err, req, res, next) => {
    logger.error({ "Error Caught": err.stack || err });
    res
      .status(err.status || 500)
      .json({ error: err.message || "Something went wrong!" });
  });

  return app;
};
