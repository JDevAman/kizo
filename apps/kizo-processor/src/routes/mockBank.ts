import { Router } from "express";
import { logger } from "../server.js";

const mockBankRouter = Router();

mockBankRouter.post("/deposit", async (req, res) => {
  const { transactionId } = req.body;

  // 95% Success
  const isSuccess = Math.random() > 0.05;

  logger.info(
    `[BANK_MOCK] Deposit Request: ${transactionId} -> ${
      isSuccess ? "SUCCESS" : "FAILED"
    }`,
  );

  return res.status(200).json({
    status: isSuccess ? "SUCCESS" : "FAILED",
    externalRef: `MOCK-DEP-${Math.random()
      .toString(36)
      .substring(7)
      .toUpperCase()}`,
    message: isSuccess ? "Funds cleared" : "Network timeout at acquiring bank",
  });
});

mockBankRouter.post("/withdraw", async (req, res) => {
  const { transactionId } = req.body;

  // Simulate 90% success rate (withdrawals fail more often in real life)
  const isSuccess = Math.random() > 0.1;

  logger.info(
    `[BANK_MOCK] Withdraw Request: ${transactionId} -> ${
      isSuccess ? "SUCCESS" : "FAILED"
    }`,
  );

  return res.status(200).json({
    status: isSuccess ? "SUCCESS" : "FAILED",
    externalRef: `MOCK-WIT-${Math.random()
      .toString(36)
      .substring(7)
      .toUpperCase()}`,
    message: isSuccess ? "Settlement successful" : "Account validation failed",
  });
});

export default mockBankRouter;
