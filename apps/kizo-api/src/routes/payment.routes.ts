import express from "express";
import authenticate from "../middlewares/authMiddleware.js";
import {
  getBalance,
  depositMoney,
  transferMoney,
  withdrawMoney,
} from "../controllers/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.use(authenticate); // Protect all routes

// Core
paymentRouter.get("/balance", getBalance);
paymentRouter.post("/deposit", depositMoney);
paymentRouter.post("/withdraw", withdrawMoney);
paymentRouter.post("/transfer", transferMoney);

// Requests
// paymentRouter.get("/requests", getRequests);
// paymentRouter.post("/request/create", createRequest);
// paymentRouter.post("/request/accept/:id", acceptRequest);
// paymentRouter.post("/request/reject/:id", rejectRequest);

export default paymentRouter;
