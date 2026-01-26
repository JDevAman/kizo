import { Request, Response } from "express";
import { paymentService } from "../services/payment.service.js";
import { invalidateDashboardCache } from "../utils/cacheHelper.js";

export const getBalance = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await paymentService.getBalance(req.user.id);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const depositMoney = async (req: Request, res: Response) => {
  try {
    if (!req.headers["idempotency-key"])
      return res.status(422).json({ message: "Invalid Input" });

    const idempotencyKey = req.headers["idempotency-key"] as string;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const tx = await paymentService.depositMoney(
      req.user.id,
      req.body,
      idempotencyKey,
    );

    invalidateDashboardCache(req.user.id);
    return res.json({ message: "Money Added", transaction: tx });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const withdrawMoney = async (req: Request, res: Response) => {
  try {
    if (!req.headers["idempotency-key"])
      return res.status(422).json({ message: "Invalid Input" });

    const idempotencyKey = req.headers["idempotency-key"] as string;
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const tx = await paymentService.withdrawMoney(
      req.user.id,
      req.body,
      idempotencyKey,
    );

    invalidateDashboardCache(req.user.id);
    return res.json({ message: "Money Added", transaction: tx });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const transferMoney = async (req: Request, res: Response) => {
  try {
    if (!req.headers["idempotency-key"]) {
      return res.status(422).json({ message: "Invalid Input" });
    }

    const idempotencyKey = req.headers["idempotency-key"] as string;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const tx = await paymentService.transferMoney(
      req.user.id,
      req.body,
      idempotencyKey,
    );

    const transaction = {
      amount: Number(tx.amount),
      description: tx.description,
      referenceId: tx.referenceId,
      status: tx.status,
      type: tx.type,
    };

    invalidateDashboardCache(req.user.id);
    return res.json({
      message: "Transfer Successful",
      transaction: transaction,
    });
  } catch (error: any) {
    if (error.message === "Insufficient balance") {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === "Recipient not found") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
