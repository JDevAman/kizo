import { Request, Response } from "express";
import { paymentService } from "../services/payment.service.js";
import { schemas } from "@kizo/shared";
import { number } from "zod";

// --- BALANCE ---
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

// --- ADD MONEY ---
export const depositMoney = async (req: Request, res: Response) => {
  try {
    const validation = schemas.DepositMoneyInput.safeParse(req.body);
    if (!validation.success || !req.headers["idempotency-key"])
      return res.status(422).json({ message: "Invalid Input" });

    const idempotencyKey = req.headers["idempotency-key"] as string;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const tx = await paymentService.depositMoney(
      req.user.id,
      validation.data,
      idempotencyKey,
    );
    return res.json({ message: "Money Added", transaction: tx });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const withdrawMoney = async (req: Request, res: Response) => {
  try {
    const validation = schemas.WithdrawMoneyInput.safeParse(req.body);
    if (!validation.success || !req.headers["idempotency-key"])
      return res.status(422).json({ message: "Invalid Input" });

    const idempotencyKey = req.headers["idempotency-key"] as string;
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const tx = await paymentService.withdrawMoney(
      req.user.id,
      validation.data,
      idempotencyKey,
    );
    return res.json({ message: "Money Added", transaction: tx });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// --- TRANSFER ---
export const transferMoney = async (req: Request, res: Response) => {
  try {
    const validation = schemas.P2PTransferInput.safeParse(req.body);
    if (!validation.success || !req.headers["idempotency-key"]) {
      return res.status(422).json({ message: "Invalid Input" });
    }

    const idempotencyKey = req.headers["idempotency-key"] as string;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const tx = await paymentService.transferMoney(
      req.user.id,
      validation.data,
      idempotencyKey,
    );

    const transaction = {
      amount: Number(tx.amount),
      description: tx.description,
      referenceId: tx.referenceId,
      status: tx.status,
      type: tx.type,
    };
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
// --- REQUESTS ---
// export const createRequest = async (req: Request, res: Response) => {
//   try {
//     // ✅ FIX: Use 'createRequestInput'
//     const validation = createRequestInput.safeParse(req.body);
//     if (!validation.success) return res.status(422).json({ message: "Invalid Input" });

//     // @ts-ignore
//     const reqTx = await accountService.createRequest(req.user.id, validation.data);
//     return res.json({ message: "Request Sent", request: reqTx });
//   } catch (error: any) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// export const getRequests = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const requests = await accountService.getRequests(req.user.id);
//     return res.json({ requests });
//   } catch (error: any) {
//     return res.status(500).json({ message: "Error fetching requests" });
//   }
// };

// export const acceptRequest = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const tx = await accountService.acceptRequest(req.user.id, req.params.id);
//     return res.json({ message: "Request Accepted & Paid", transaction: tx });
//   } catch (error: any) {
//     return res.status(400).json({ message: error.message });
//   }
// };

// export const rejectRequest = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const result = await accountService.rejectRequest(req.user.id, req.params.id);
//     return res.json({ message: "Request Rejected", request: result });
//   } catch (error: any) {
//     return res.status(400).json({ message: error.message });
//   }
// };
