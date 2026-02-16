import { DepositMoneyInput, P2PTransferInput } from "@kizo/shared";
import { TxType } from "@kizo/db";

import {
  transactionRepository,
  bankTransferRepository,
  userBalanceRepository,
} from "@kizo/db";
import { userRepository } from "@kizo/db";
import { getPrisma } from "@kizo/db";
import { transactionQueue } from "@kizo/queue";
import { Logger } from "@kizo/logger";

export class PaymentService {
  private get prisma() {
    return getPrisma();
  }
  async getBalance(userId: string, log: Logger) {
    const account = await userBalanceRepository.getAccount(userId);
    if (!account) throw new Error("Account not found");

    log.info({ userId }, "Successfully Fetched Balance");
    return {
      balance: account.balance.toString(),
      locked: account.locked.toString(),
    };
  }

  async depositMoney(
    userId: string,
    payload: DepositMoneyInput,
    idempotencyKey: string,
    log: Logger,
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
        log.warn(
          { userId, idempotencyKey },
          "Duplicate deposit attempt detected",
        );
        return { transactionId: existing.id, status: existing.status };
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

    try {
      const traceId = log.bindings().traceId;

      await transactionQueue.add("Deposit-Money", {
        transactionId: result.transactionId,
        _metadata: { traceId },
      });
      log.info(
        { txId: result.transactionId, queue: "Deposit-Money" },
        "Handoff to background worker",
      );
    } catch (error) {
      log.error(error, "QUEUE_FAILURE: Deposit task not created");
      throw error;
    }

    return result;
  }

  async withdrawMoney(
    userId: string,
    payload: DepositMoneyInput,
    idempotencyKey: string,
    log: Logger,
  ) {
    const amount = BigInt(payload.amount);
    log.info(
      { userId, amount: amount.toString() },
      "Withdrawal intent recorded",
    );

    const result = await this.prisma.$transaction(async (db) => {
      // 1️⃣ Fetch balance with lock
      const account = await db.$queryRaw<any[]>`
        SELECT "balance", "locked" FROM user_balances 
        WHERE "userId" = ${userId} 
        FOR UPDATE
      `;

      if (!account[0]) throw new Error("Account not found");

      const available = BigInt(account[0].balance) - BigInt(account[0].locked);
      if (available < amount) {
        log.warn(
          {
            userId,
            available: available.toString(),
            requested: amount.toString(),
          },
          "Withdrawal rejected: Insufficient funds",
        );
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

    try {
      const traceId = log.bindings().traceId;
      await transactionQueue.add("Withdraw-Money", {
        transactionId: result.transactionId,
        _metadata: { traceId },
      });
      log.info({ txId: result.transactionId }, "Withdrawal task queued");
    } catch (error) {
      log.error(error, "QUEUE_FAILURE: Withdrawal task not created");
      throw error;
    }

    return result;
  }

  async transferMoney(
    fromUserId: string,
    payload: P2PTransferInput,
    idempotencyKey: string,
    log: Logger,
  ) {
    const { recipient, amount, note } = payload;
    const bigAmount = BigInt(amount);
    log.info({ fromUserId, recipient, amount }, "Transfer intent recorded");

    // 1️⃣ Initial Validation (Outside transaction for speed)
    const toUser = await userRepository.findByEmail(recipient);
    if (!toUser) {
      log.warn({ recipient }, "Transfer failed: Recipient not found");
      throw new Error("Recipient not found");
    }
    if (toUser.status !== "ACTIVE") {
      log.warn(
        { recipient },
        "Transfer failed: Recipient account is suspended",
      );
      throw new Error("Recipient account is suspended");
    }
    if (toUser.id === fromUserId) {
      log.warn({ recipient }, "Transfer failed: Cannot transfer to yourself");
      throw new Error("Cannot transfer to yourself");
    }
    // 2️⃣ Create Transaction Record (Intent)
    const result = await this.prisma.$transaction(async (db) => {
      const existing = await transactionRepository.findByIdempotencyKey(
        fromUserId,
        idempotencyKey,
        TxType.TRANSFER,
        db,
      );

      if (existing) {
        return {
          transactionId: existing.id,
          status: existing.status,
        };
      }

      // 2️⃣ Create transaction
      const transaction = await transactionRepository.createTransfer(
        {
          fromUserId,
          toUserId: toUser.id,
          amount: bigAmount,
          idempotencyKey,
          description: note ?? undefined,
        },
        db,
      );

      return {
        transactionId: transaction.id,
        status: transaction.status,
      };
    });

    // 3️⃣ Queue for Async Processing
    try {
      const traceId = log.bindings().traceId;
      await transactionQueue.add(
        "P2P-Transfer",
        {
          transactionId: result.transactionId,
          _metadata: { traceId },
        },
        { jobId: result.transactionId },
      );
      log.info({ txId: result.transactionId }, "P2P Transfer queued");
    } catch (error) {
      log.error(error, "QUEUE_FAILURE: P2P task not created");
      throw error;
    }

    return result;
  }
}

export const paymentService = new PaymentService();
