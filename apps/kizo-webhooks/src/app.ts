import express from "express";
import webHooksRouter from "./webhooks.js";

export const createApp = () => {
  const app = express();
  app.use(express.json());
  app.get("/", function (req, res) {
    res.send("WehAPI is live");
  });
  app.use("/webhooks", webHooksRouter);
  return app;
};
