import express, { Router } from "express";
import userRouter from "./user.routes.js";
import paymentRouter from "./payment.routes.js";
import authRouter from "./auth.routes.js";
import transactionRouter from "./transaction.routes.js";
import dashboardRouter from "./dashboard.routes.js";
import { getPrisma } from "@kizo/db";
import { getRedis } from "@kizo/queue";
const mainRouter: Router = express.Router();

mainRouter.get("/", function (req, res) {
  res.send("API is live");
});

mainRouter.get("/health", async (req, res) => {
  try {
    const prisma = getPrisma();
    const redis = getRedis();

    await prisma.$queryRaw`SELECT 1`;
    const redisStatus = redis.isOpen ? await redis.ping() : "DISCONNECTED";

    res.status(200).send({
      status: "UP",
      database: "CONNECTED",
      redis: redisStatus === "PONG" ? "CONNECTED" : "ERROR",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).send({
      status: "DOWN",
      reason:
        error instanceof Error ? error.message : "Internal Dependency Failure",
    });
  }
});

mainRouter.use("/user", userRouter);
mainRouter.use("/payment", paymentRouter);
mainRouter.use("/auth", authRouter);
mainRouter.use("/transaction", transactionRouter);
mainRouter.use("/dashboard", dashboardRouter);

export default mainRouter;
