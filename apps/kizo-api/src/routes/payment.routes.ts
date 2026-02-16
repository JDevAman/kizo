import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  getBalance,
  depositMoney,
  transferMoney,
  withdrawMoney,
} from "../controllers/payment.controller.js";
import { validate } from "../middlewares/validate.js";
import { schemas } from "@kizo/shared";

const paymentRouter = express.Router();

paymentRouter.use(authenticate);

paymentRouter.get("/balance", getBalance);
paymentRouter.post(
  "/deposit",
  validate({ body: schemas.DepositMoneyInput }),
  depositMoney,
);
paymentRouter.post(
  "/withdraw",
  validate({ body: schemas.DepositMoneyInput }),
  withdrawMoney,
);
paymentRouter.post(
  "/transfer",
  validate({ body: schemas.P2PTransferInput }),
  transferMoney,
);

export default paymentRouter;
