import { NextFunction, Request, Response } from "express";
import { paymentService } from "../services/payment.service.js";
import { invalidateDashboardCache } from "../utils/cacheHelper.js";

export const getBalance = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.log.info({ userId: req.user?.id }, "Fetching balance");
  try {
    if (!req.user) {
      const err: any = new Error("UnAuthorized User");
      err.status = 401;
      throw err;
    }
    const result = await paymentService.getBalance(req.user.id, req.log);
    return res.json(result);
  } catch (error: any) {
    next(error);
  }
};

export const depositMoney = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const idempotencyKey = req.headers["idempotency-key"] as string;
  req.log.info({ userId: req.user.id, idempotencyKey }, "Deposit initiated");

  try {
    if (!idempotencyKey) {
      const err: any = new Error("Idempotency key missing");
      err.status = 422;
      throw err;
    }

    if (!req.user) {
      const err: any = new Error("UnAuthorized User");
      err.status = 401;
      throw err;
    }

    const tx = await paymentService.depositMoney(
      req.user.id,
      req.body,
      idempotencyKey,
      req.log,
    );

    invalidateDashboardCache(req.user.id);
    return res.json({ message: "Money Added", transaction: tx });
  } catch (error: any) {
    next(error);
  }
};

export const withdrawMoney = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const idempotencyKey = req.headers["idempotency-key"] as string;
  req.log.info({ userId: req.user.id, idempotencyKey }, "Withdrawal initiated");

  try {
    if (!idempotencyKey) {
      const err: any = new Error("Idempotency key missing");
      err.status = 422;
      throw err;
    }

    if (!req.user) {
      const err: any = new Error("UnAuthorized User");
      err.status = 401;
      throw err;
    }

    const tx = await paymentService.withdrawMoney(
      req.user.id,
      req.body,
      idempotencyKey,
      req.log,
    );

    invalidateDashboardCache(req.user.id);
    return res.json({ message: "Money Debited", transaction: tx });
  } catch (error: any) {
    next(error);
  }
};

export const transferMoney = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const idempotencyKey = req.headers["idempotency-key"] as string;
  req.log.info({ userId: req.user.id, idempotencyKey }, "Transfer initiated");

  try {
    if (!idempotencyKey) {
      const err: any = new Error("Idempotency key missing");
      err.status = 422;
      throw err;
    }

    if (!req.user) {
      const err: any = new Error("Unauthorized User");
      err.status = 401;
      throw err;
    }

    const tx = await paymentService.transferMoney(
      req.user.id,
      req.body,
      idempotencyKey,
      req.log,
    );

    invalidateDashboardCache(req.user.id);
    return res.json({
      message: "Transfer Initiated",
      transaction: tx,
    });
  } catch (error: any) {
    if (error.message === "Insufficient balance") error.status = 400;
    if (error.message === "Recipient not found") error.status = 404;
    next(error);
  }
};
