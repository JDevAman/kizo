import express, { Router } from "express";
import userRouter from "./user.routes.js";
import paymentRouter from "./payment.routes.js";
import authRouter from "./auth.routes.js";
import transactionRouter from "./transaction.routes.js";
import dashboardRouter from "./dashboard.routes.js";

const mainRouter:Router = express.Router();

mainRouter.get("/", function (req, res) {
  res.send("API is live");
});
mainRouter.use("/user", userRouter);
mainRouter.use("/payment", paymentRouter);
mainRouter.use("/auth", authRouter);
mainRouter.use("/transaction", transactionRouter);
mainRouter.use("/dashboard", dashboardRouter);

export default mainRouter;
