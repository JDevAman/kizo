import express from "express";
import webHooksRouter from "./webhooks.js";

export const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/webhooks", webHooksRouter);
  return app;
};
