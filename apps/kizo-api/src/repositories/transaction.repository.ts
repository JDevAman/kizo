import { prisma } from "../lib/db";
import { Prisma, TxStatus, TxType } from "@prisma/client";

export class TransactionRepository {

  async findByIdempotencyKey(
    createdByUserId: string,
    idempotencyKey: string,
    type: TxType,
    db: Prisma.TransactionClient
  ) {
    return db.transaction.findFirst({
      where: {
        createdByUserId,
        idempotencyKey,
        type,
      },
    });
  }

  async createDeposit(
    input: {
      userId: string;
      amount: bigint;
      idempotencyKey: string;
      description?: string;
    },
    db: Prisma.TransactionClient
  ) {
    return db.transaction.create({
      data: {
        type: TxType.DEPOSIT,
        amount: input.amount,
        status: TxStatus.PROCESSING,
        toUserId: input.userId,
        createdByUserId: input.userId,
        idempotencyKey: input.idempotencyKey,
        description: input.description,
      },
    });
  }

  async createWithdraw(
    input: {
      userId: string;
      amount: bigint;
      idempotencyKey: string;
      description?: string;
    },
    db: Prisma.TransactionClient
  ) {
    return db.transaction.create({
      data: {
        type: TxType.WITHDRAWAL,
        amount: input.amount,
        status: TxStatus.PROCESSING,
        fromUserId: input.userId, // ✅ THIS WILL NOW STICK
        createdByUserId: input.userId,
        idempotencyKey: input.idempotencyKey,
        description: input.description,
      },
    });
  }

  async createTransfer(
    input: {
      fromUserId: string;
      toUserId: string;
      amount: number;
      idempotencyKey: string;
      description?: string;
    },
    db: Prisma.TransactionClient
  ) {
    return db.transaction.create({
      data: {
        type: TxType.TRANSFER,
        amount: BigInt(input.amount),
        status: TxStatus.SUCCESS,
        fromUserId: input.fromUserId,
        toUserId: input.toUserId,
        createdByUserId: input.fromUserId,
        idempotencyKey: input.idempotencyKey,
        processedAt: new Date(),
        description: input.description,
      },
    });
  }
}

export const transactionRepository = new TransactionRepository();
