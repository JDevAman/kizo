import { Request, Response } from "express";
import { accountService } from "../services/account.service";
// ✅ FIX: Import from shared package
import { 
  p2pTransferInput, 
  addMoneyInput, 
  createRequestInput 
} from "@kinzoku/shared";

// --- BALANCE ---
export const getBalance = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const result = await accountService.getBalance(req.user.id);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// --- ADD MONEY ---
export const addMoney = async (req: Request, res: Response) => {
  try {
    // ✅ FIX: Use 'addMoneyInput'
    const validation = addMoneyInput.safeParse(req.body);
    if (!validation.success) return res.status(422).json({ message: "Invalid Input" });

    // @ts-ignore
    const tx = await accountService.addMoney(req.user.id, validation.data);
    return res.json({ message: "Money Added", transaction: tx });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// --- TRANSFER ---
export const transferMoney = async (req: Request, res: Response) => {
  try {
    // ✅ FIX: Use 'p2pTransferInput'
    const validation = p2pTransferInput.safeParse(req.body);
    if (!validation.success) return res.status(422).json({ message: "Invalid Input" });

    // @ts-ignore
    const tx = await accountService.transferMoney(req.user.id, validation.data);
    return res.json({ message: "Transfer Successful", transaction: tx });
  } catch (error: any) {
    const status = error.message === "Insufficient balance" ? 400 : 500;
    return res.status(status).json({ message: error.message });
  }
};

// --- REQUESTS ---
export const createRequest = async (req: Request, res: Response) => {
  try {
    // ✅ FIX: Use 'createRequestInput'
    const validation = createRequestInput.safeParse(req.body);
    if (!validation.success) return res.status(422).json({ message: "Invalid Input" });

    // @ts-ignore
    const reqTx = await accountService.createRequest(req.user.id, validation.data);
    return res.json({ message: "Request Sent", request: reqTx });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getRequests = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const requests = await accountService.getRequests(req.user.id);
    return res.json({ requests });
  } catch (error: any) {
    return res.status(500).json({ message: "Error fetching requests" });
  }
};

export const acceptRequest = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const tx = await accountService.acceptRequest(req.user.id, req.params.id);
    return res.json({ message: "Request Accepted & Paid", transaction: tx });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const rejectRequest = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const result = await accountService.rejectRequest(req.user.id, req.params.id);
    return res.json({ message: "Request Rejected", request: result });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};