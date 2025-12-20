import { prisma } from "../lib/db";
import { BankTransferStatus } from "@prisma/client";

export class BankTransferRepository {
  async create(input: {
    transactionId: string;
    amount: bigint;
    metadata?: Record<string, any>;
  }) {
    return prisma.bankTransfer.create({
      data: {
        transactionId: input.transactionId,
        amount: input.amount,
        metadata: input.metadata,
        status: BankTransferStatus.PROCESSING,
      },
    });
  }

  async findByTransactionId(transactionId: string) {
    return prisma.bankTransfer.findUnique({
      where: { transactionId },
    });
  }

  // webhook-safe (retry safe)
  async markSuccess(
    transactionId: string,
    externalRef?: string,
    tx?: Prisma.TransactionClient
  ) {
    const client = tx ?? prisma;

    return client.bankTransfer.updateMany({
      where: {
        transactionId,
        status: BankTransferStatus.PROCESSING,
      },
      data: {
        status: BankTransferStatus.SUCCESS,
        externalRef,
      },
    });
  }

  async markFailed(
    transactionId: string,
    externalRef?: string,
    tx?: Prisma.TransactionClient
  ) {
    const client = tx ?? prisma;

    return client.bankTransfer.updateMany({
      where: {
        transactionId,
        status: BankTransferStatus.PROCESSING,
      },
      data: {
        status: BankTransferStatus.FAILED,
        externalRef,
      },
    });
  }
}

export const bankTransferRepository = new BankTransferRepository();
