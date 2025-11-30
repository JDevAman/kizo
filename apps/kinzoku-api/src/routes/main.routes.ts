import express from "express";
import userRouter from "./user.routes";
import accountRouter from "./account.routes";
import authRouter from "./auth.routes";
import transactionRouter from "./transaction.routes";
import dashboardRouter from "./dashboard.routes";

const mainRouter = express.Router();

mainRouter.get("/", function (req, res) {
  res.send("API is live");
});
mainRouter.use("/user", userRouter);
mainRouter.use("/payments", accountRouter);
mainRouter.use("/auth", authRouter);
mainRouter.use("/transactions", transactionRouter);
mainRouter.use("/dashboard", dashboardRouter);

export default mainRouter;
