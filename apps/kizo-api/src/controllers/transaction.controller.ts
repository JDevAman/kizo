import { Request, Response } from "express";
import { transactionService } from "../services/transaction.service.js";
import { logger } from "../server.js";

export const listTransactions = async (req: Request, res: Response) => {
  try {
    const result = await transactionService.list(req.user.id, req.query);
    res.json({
      transactions: result,
      total: result.total,
      limit: Number(req.query.limit || 20),
      skip: Number(req.query.skip || 0),
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const exportTransactions = async (req: Request, res: Response) => {
  try {
    const csv = await transactionService.downloadCsv(req.user.id, req.query);
    res.header("Content-Type", "text/csv");
    res.attachment("transactions.csv");
    res.send(csv);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: "Export failed" });
  }
};

export const getTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Transaction ID is required" });
    }
    const tx = await transactionService.getDetails(req.user.id, id);
    res.json(tx);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};
