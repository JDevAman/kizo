import z from "zod";
import { schemas } from "@kizo/shared";
import { TxType } from "@prisma/client";
import { prisma } from "../lib/db";

import { transactionRepository } from "../repositories/transaction.repository";
import { bankTransferRepository } from "../repositories/bankTransfer.repository";
import { userBalanceRepository } from "../repositories/payment.repository";
import { userRepository } from "../repositories/user.repository";
import { triggerMockBankWebhook } from "../lib/webhook";

type DepositMoneyInput = z.infer<typeof schemas.DepositMoneyInput>;
type P2PTransferInput = z.infer<typeof schemas.P2PTransferInput>;

export class PaymentService {
  async getBalance(userId: string) {
    const account = await userBalanceRepository.getAccount(userId);
    if (!account) throw new Error("Account not found");

    return {
      balance: account.balance.toString(),
      locked: account.locked.toString(),
    };
  }

  async depositMoney(
    userId: string,
    payload: DepositMoneyInput,
    idempotencyKey: string
  ) {
    const result = await prisma.$transaction(async (db) => {
      // 1️⃣ Idempotency check
      const existing = await transactionRepository.findByIdempotencyKey(
        userId,
        idempotencyKey,
        TxType.DEPOSIT,
        db
      );

      if (existing) {
        return {
          transactionId: existing.id,
          status: existing.status,
        };
      }

      // 2️⃣ Create transaction
      const transaction = await transactionRepository.createDeposit(
        {
          userId,
          amount: BigInt(payload.amount),
          idempotencyKey,
          description: payload.note,
        },
        db
      );

      // 3️⃣ Create bank transfer
      await bankTransferRepository.create(
        {
          transactionId: transaction.id,
          amount: BigInt(payload.amount),
          metadata: { provider: payload.provider },
        },
        db
      );

      return {
        transactionId: transaction.id,
        status: transaction.status,
      };
    });

    // 4️⃣ Fire-and-forget AFTER commit (IMPORTANT)
    setImmediate(() => {
      triggerMockBankWebhook(result.transactionId, "deposit");
    });

    return result;
  }

  async withdrawMoney(
    userId: string,
    payload: DepositMoneyInput,
    idempotencyKey: string
  ) {
    const result = await prisma.$transaction(async (db) => {
      // 1️⃣ Idempotency check
      const existing = await transactionRepository.findByIdempotencyKey(
        userId,
        idempotencyKey,
        TxType.WITHDRAWAL,
        db
      );

      if (existing) {
        return {
          transactionId: existing.id,
          status: existing.status,
        };
      }

      // 2️⃣ Create transaction
      const transaction = await transactionRepository.createWithdraw(
        {
          userId,
          amount: BigInt(payload.amount),
          idempotencyKey,
          description: payload.note,
        },
        db
      );

      // 3️⃣ Create bank transfer
      await bankTransferRepository.create(
        {
          transactionId: transaction.id,
          amount: BigInt(payload.amount),
          metadata: { provider: payload.provider },
        },
        db
      );

      return {
        transactionId: transaction.id,
        status: transaction.status,
      };
    });

    // 4️⃣ Fire-and-forget AFTER commit (IMPORTANT)
    setImmediate(() => {
      triggerMockBankWebhook(result.transactionId, "withdraw");
    });

    return result;
  }

  async transferMoney(
    fromUserId: string,
    payload: P2PTransferInput,
    idempotencyKey: string
  ) {
    const { recipient, amount, note } = payload;

    const toUser = await userRepository.findByEmail(recipient);
    if (!toUser) throw new Error("Recipient not found");
    if (toUser.status !== "ACTIVE")
      throw new Error("Recipient account is suspended");
    if (toUser.id === fromUserId)
      throw new Error("Cannot transfer to yourself");

    return userBalanceRepository.transfer(
      fromUserId,
      toUser.id,
      BigInt(amount),
      note,
      idempotencyKey
    );
  }
}

export const paymentService = new PaymentService();
