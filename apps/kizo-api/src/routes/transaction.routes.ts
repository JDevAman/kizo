import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  listTransactions,
  getTransaction,
  exportTransactions,
} from "../controllers/transaction.controller.js";

const transactionRouter = express.Router();

// All routes require authentication
transactionRouter.use(authenticate);

transactionRouter.get("/", listTransactions);
transactionRouter.get("/export", exportTransactions);
transactionRouter.get("/:id", getTransaction);

export default transactionRouter;
