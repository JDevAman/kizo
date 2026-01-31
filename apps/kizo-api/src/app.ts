import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import getConfig from "./config.js";
import mainRouter from "./routes/main.routes.js";
import docsRouter from "./docs.js";
import { traceMiddleware } from "./middlewares/traceMiddleware.js";
import { prometheus } from "@kizo/metrics";
import { metricsMiddleware } from "./middlewares/metricsMiddleware.js";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export const createApp = () => {
  const app = express();
  const config = getConfig();

  // Middlewares
  app.use(traceMiddleware);
  app.use(metricsMiddleware);

  // Parsers
  app.use(express.json());
  app.use(
    cors({
      origin: config.frontendURL,
      credentials: true,
    }),
  );
  app.use(cookieParser());

  // Health
  app.get("/metrics", async (req, res) => {
    res.set("Content-Type", prometheus.register.contentType);
    res.end(await prometheus.register.metrics());
  });

  // Routes
  app.use("/api/v1", docsRouter);
  app.use("/api/v1", mainRouter);

  // Error handler
  app.use((err, req, res, next) => {
    const status = err.status || 500;

    // Only log 500s as "error" to save Loki space.
    // Log 400s as "warn" or skip them if they are just "Unauthorized"/etc.
    if (status >= 500) {
      req.log.error(
        {
          msg: err.message,
          stack: err.stack,
        },
        "Unhandled Server Error",
      );
    } else {
      req.log.warn({ msg: err.message, status }, "Client Request Warning");
    }

    res.status(status).json({
      error: err.message || "Something went wrong!",
      traceId: req.traceId,
    });
  });

  return app;
};
