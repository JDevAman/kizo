import express from "express";
import mockBankRouter from "./routes/mockBank.js";

export const createApp = () => {
  const app = express();
  app.use(express.json());
  app.get("/", function (req, res) {
    res.send("Bank Server is live");
  });
  app.use("/bank", mockBankRouter);
  return app;
};
