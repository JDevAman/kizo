import { NextFunction, Request, Response, Router } from "express";

const mockBankRouter = Router();

mockBankRouter.post(
  "/deposit",
  async (req: Request, res: Response, next: NextFunction) => {
    const traceId = req.headers["x-trace-id"] as string;

    // Create a child logger for this specific bank request
    const bankLog = req.log.child({ traceId, provider: "MOCK_BANK" });

    const { transactionId } = req.body;
    const chaos = Math.random();

    // 1. Simulate a Bank "Hang" (Latency)
    if (chaos < 0.05) {
      bankLog.info({ transactionId }, "Simulating bank latency (5s hang)");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    // 2. Simulate a Bank "Crash" (500 Error)
    if (chaos < 0.02) {
      bankLog.error(
        { transactionId },
        "[BANK_MOCK] Simulating internal bank crash",
      );
      return res.status(500).json({ error: "Service Unavailable" });
    }

    // 3. Normal Success/Failure Logic
    const isSuccess = Math.random() > 0.05;

    bankLog.info(
      { transactionId, status: isSuccess ? "SUCCESS" : "FAILED" },
      "Request Processed",
    );

    return res.status(200).json({
      status: isSuccess ? "SUCCESS" : "FAILED",
      externalRef: `MOCK-DEP-${Math.random()
        .toString(36)
        .substring(7)
        .toUpperCase()}`,
      message: isSuccess
        ? "Funds cleared"
        : "Network timeout at acquiring bank",
    });
  },
);

mockBankRouter.post(
  "/withdraw",
  async (req: Request, res: Response, next: NextFunction) => {
    const traceId = req.headers["x-trace-id"] as string;
    // Create a child logger for this specific bank request
    const bankLog = req.log.child({ traceId, provider: "MOCK_BANK" });

    const { transactionId } = req.body;
    const chaos = Math.random();

    // 1. Simulate a Bank "Hang" (Latency)
    if (chaos < 0.05) {
      bankLog.info({ transactionId }, "Simulating bank latency (5s hang)");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    // 2. Simulate a Bank "Crash" (500 Error)
    if (chaos < 0.02) {
      bankLog.error(
        { transactionId },
        "[BANK_MOCK] Simulating internal bank crash",
      );
      return res.status(500).json({ error: "Service Unavailable" });
    }

    // 3. Normal Success/Failure Logic
    const isSuccess = Math.random() > 0.1;

    bankLog.info(
      {
        transactionId,
        provider: "MOCK_BANK",
        status: isSuccess ? "SUCCESS" : "FAILED",
      },
      "[BANK_MOCK] Request Processed",
    );

    return res.status(200).json({
      status: isSuccess ? "SUCCESS" : "FAILED",
      externalRef: `MOCK-WIT-${Math.random()
        .toString(36)
        .substring(7)
        .toUpperCase()}`,
      message: isSuccess
        ? "Settlement successful"
        : "Account validation failed",
    });
  },
);
export default mockBankRouter;
