import express, { Router } from "express";
import userRouter from "./user.routes";
import paymentRouter from "./payment.routes";
import authRouter from "./auth.routes";
import transactionRouter from "./transaction.routes";
import dashboardRouter from "./dashboard.routes";

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
