import { Request, Response } from "express";
import { transactionService } from "../services/transaction.service";

// ✅ LIST
export const listTransactions = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const result = await transactionService.list(req.user.id, req.query);
    res.json({
      transactions: result,
      total: result.total,
      limit: Number(req.query.limit || 20),
      skip: Number(req.query.skip || 0)
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ EXPORT
export const exportTransactions = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const csv = await transactionService.downloadCsv(req.user.id);
    res.header("Content-Type", "text/csv");
    res.attachment("transactions.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: "Export failed" });
  }
};

// ✅ GET ONE
export const getTransaction = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const tx = await transactionService.getDetails(req.user.id, req.params.id);
    res.json(tx);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};