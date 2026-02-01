import express from "express";
import mockBankRouter from "./routes/mockBank.js";
import { logger } from "./server.js";

export const createApp = () => {
  const app = express();
  app.use(express.json());
  app.get("/", function (req, res) {
    res.send("Bank Server is live");
  });

  // 💡 2. Attach Logger (req.log)
  app.use((req, res, next) => {
    req.log = logger.child({ traceId: req.traceId });
    next();
  });

  app.use("/bank", mockBankRouter);

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
