import { DepositMoneyInput, P2PTransferInput } from "@kizo/shared";
import { TxType } from "@kizo/db";

import { transactionRepository } from "../repositories/transaction.repository.js";
import { bankTransferRepository } from "../repositories/bankTransfer.repository.js";
import { userBalanceRepository } from "../repositories/payment.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import { triggerMockBankWebhook } from "../lib/webhook.js";
import { getPrisma, TransactionClient } from "@kizo/db";

export class PaymentService {
  private get prisma() {
    return getPrisma();
  }
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
    idempotencyKey: string,
  ) {
    const result = await this.prisma.$transaction(async (db) => {
      // 1️⃣ Idempotency check
      const existing = await transactionRepository.findByIdempotencyKey(
        userId,
        idempotencyKey,
        TxType.DEPOSIT,
        db,
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
          description: payload.note ?? undefined,
        },
        db,
      );

      // 3️⃣ Create bank transfer
      await bankTransferRepository.create(
        {
          transactionId: transaction.id,
          amount: BigInt(payload.amount),
          metadata: { provider: payload.provider },
        },
        db,
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
    idempotencyKey: string,
  ) {
    const amount = BigInt(payload.amount);
    const result = await this.prisma.$transaction(async (db) => {
      // 1️⃣ Fetch balance with lock
      const account = await db.userBalance.findUnique({
        where: { userId },
      });

      if (!account) throw new Error("Account not found");

      const available = account.balance - account.locked;
      if (available < amount) {
        throw new Error("Insufficient balance");
      }

      // 2️⃣ Idempotency check
      const existing = await transactionRepository.findByIdempotencyKey(
        userId,
        idempotencyKey,
        TxType.WITHDRAWAL,
        db,
      );

      if (existing) {
        return {
          transactionId: existing.id,
          status: existing.status,
        };
      }

      // 3️⃣ LOCK funds
      await db.userBalance.update({
        where: { userId },
        data: {
          locked: { increment: amount },
        },
      });

      // 4️⃣ Create withdrawal transaction
      const transaction = await transactionRepository.createWithdraw(
        {
          userId,
          amount,
          idempotencyKey,
          description: payload.note ?? undefined,
        },
        db,
      );

      // 5️⃣ Create bank transfer
      await bankTransferRepository.create(
        {
          transactionId: transaction.id,
          amount,
          metadata: { provider: payload.provider },
        },
        db,
      );

      return {
        transactionId: transaction.id,
        status: transaction.status,
      };
    });

    // 6️⃣ Fire-and-forget webhook
    setImmediate(() => {
      triggerMockBankWebhook(result.transactionId, "withdraw");
    });

    return result;
  }

  async transferMoney(
    fromUserId: string,
    payload: P2PTransferInput,
    idempotencyKey: string,
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
      String(amount),
      note ?? undefined,
      idempotencyKey,
    );
  }
}

export const paymentService = new PaymentService();
