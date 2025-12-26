import express from "express";
import authenticate from "../middlewares/authMiddleware";
import {
  listTransactions,
  getTransaction,
  exportTransactions,
} from "../controllers/transaction.controller";

const transactionRouter = express.Router();

// All routes require authentication
transactionRouter.use(authenticate);

transactionRouter.get("/", listTransactions);
transactionRouter.get("/export", exportTransactions);
transactionRouter.get("/:id", getTransaction);

export default transactionRouter;
