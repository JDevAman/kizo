import { getPrisma } from "@kizo/db";
import { Prisma, TxStatus, TxType } from "@prisma/client";

export class TransactionRepository {
  private get prisma() {
    return getPrisma();
  }
  async findAll(
    userId: string,
    {
      type,
      search,
      take = 20,
      skip = 0,
    }: {
      type?: "sent" | "received" | "pending";
      search?: string;
      take?: number;
      skip?: number;
    },
  ) {
    const where: Prisma.TransactionWhereInput = {
      OR: [{ fromUserId: userId }, { toUserId: userId }],
    };

    // 🔹 Direction filter
    if (type === "sent") {
      where.fromUserId = userId;
    }

    if (type === "received") {
      where.toUserId = userId;
    }

    if (type === "pending") {
      where.status = TxStatus.PROCESSING;
    }

    // 🔹 Search (reference / description)
    if (search) {
      where.OR = [
        { referenceId: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        skip,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return { transactions, total };
  }

  async findById(txId: string) {
    return this.prisma.transaction.findFirst({
      where: { id: txId },
      include: {
        fromUser: {
          select: {
            id: true,
            email: true,
          },
        },
        toUser: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async findByIdempotencyKey(
    createdByUserId: string,
    idempotencyKey: string,
    type: TxType,
    db: Prisma.TransactionClient,
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
    db: Prisma.TransactionClient,
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
    db: Prisma.TransactionClient,
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
    db: Prisma.TransactionClient,
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

  async getSumSent(userId: string) {
    return this.prisma.transaction.aggregate({
      where: {
        fromUserId: userId,
        status: TxStatus.SUCCESS,
      },
      _sum: { amount: true },
    });
  }

  async getSumReceived(userId: string) {
    return this.prisma.transaction.aggregate({
      where: {
        toUserId: userId,
        status: TxStatus.SUCCESS,
      },
      _sum: { amount: true },
    });
  }

  async getMonthlyVolume(userId: string) {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );

    return this.prisma.transaction.aggregate({
      where: {
        status: TxStatus.SUCCESS,
        createdAt: { gte: startOfMonth },
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
      _sum: { amount: true },
    });
  }
}

export const transactionRepository = new TransactionRepository();
