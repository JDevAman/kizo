import {
  getPrisma,
  Prisma,
  BankTransferStatus,
  TransactionClient,
} from "../index.js";

export class BankTransferRepository {
  private get prisma() {
    return getPrisma();
  }

  async create(
    input: {
      transactionId: string;
      amount: bigint;
      metadata?: Record<string, any>;
    },
    db: TransactionClient,
  ) {
    return db.bankTransfer.upsert({
      where: { transactionId: input.transactionId },
      create: {
        transactionId: input.transactionId,
        amount: input.amount,
        metadata: input.metadata,
        status: BankTransferStatus.PROCESSING,
      },
      update: {}, // noop → retry safe
    });
  }

  async findByTransactionId(transactionId: string, tx?: TransactionClient) {
    const client = tx ?? this.prisma;
    return client.bankTransfer.findUnique({
      where: { transactionId },
    });
  }

  // webhook-safe (retry safe)
  async markSuccess(
    transactionId: string,
    externalRef?: string,
    tx?: TransactionClient,
  ) {
    const client = tx ?? this.prisma;

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
    tx?: TransactionClient,
  ) {
    const client = tx ?? this.prisma;

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
