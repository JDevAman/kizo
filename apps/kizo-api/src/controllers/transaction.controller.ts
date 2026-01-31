import { NextFunction, Request, Response } from "express";
import { transactionService } from "../services/transaction.service.js";

export const listTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const startTime = Date.now();
  try {
    const skip = Number(req.query.skip || 0);
    const limit = Number(req.query.limit || 20);
    const result = await transactionService.list(req.user.id, {
      ...req.query,
      skip,
      limit,
    });

    req.log.info(
      {
        userId: req.user.id,
        duration: `${Date.now() - startTime}ms`,
        limit,
        skip,
      },
      "Transactions list retrieved",
    );

    res.json({
      transactions: result,
      total: result.total,
      limit,
      skip,
    });
  } catch (err) {
    next(err);
  }
};

export const exportTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.log.info({ userId: req.user.id }, "CSV Export initiated");
  try {
    const csv = await transactionService.downloadCsv(
      req.user.id,
      req.query,
      req.log,
    );
    res.header("Content-Type", "text/csv");
    res.attachment("transactions.csv");
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

export const getTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    if (!id || typeof id !== "string") {
      const err: any = new Error("Transaction ID is required");
      err.status = 400;
      throw err;
    }
    const tx = await transactionService.getDetails(req.user.id, id, req.log);
    res.json(tx);
  } catch (err: any) {
    if (err.message === "Transaction not found") err.status = 404;
    next(err);
  }
};
