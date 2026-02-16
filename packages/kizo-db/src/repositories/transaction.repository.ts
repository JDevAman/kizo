import {
  getPrisma,
  Prisma,
  TxStatus,
  TxType,
  type TransactionClient,
} from "../index";

interface DashboardStatsRaw {
  balance: bigint | null;
  sumSent: bigint;
  sumReceived: bigint;
  monthlyVolume: bigint;
}

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
  const andConditions: Prisma.TransactionWhereInput[] = [
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
    const andConditions: Prisma.TransactionWhereInput[] = [
      {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
    ];

    // Direction filter
    if (type === "sent") {
      andConditions.push({ fromUserId: userId });
    }

    if (type === "received") {
      andConditions.push({ toUserId: userId });
    }

    if (type === "pending") {
      andConditions.push({ status: TxStatus.PROCESSING });
    }

    // Search filter
    if (search) {
      andConditions.push({
        OR: [
          { referenceId: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    const where: Prisma.TransactionWhereInput = {
      AND: andConditions,
    };

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

  async findById(txId: string, db?: TransactionClient) {
    const client = db || this.prisma;
    return client.transaction.findUnique({
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
    type: (typeof TxType)[keyof typeof TxType],
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

  async updateStatus(
    txId: string,
    status: TxStatus,
    db: TransactionClient,
    description?: string,
  ) {
    return db.transaction.update({
      where: { id: txId },
      data: {
        status,
        processedAt: status === TxStatus.SUCCESS ? new Date() : null,
        description,
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
    db: TransactionClient,
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
    db: TransactionClient,
  ) {
    return db.transaction.create({
      data: {
        type: TxType.WITHDRAWAL,
        amount: input.amount,
        status: TxStatus.PROCESSING,
        fromUserId: input.userId,
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
      amount: bigint;
      idempotencyKey: string;
      description?: string;
    },
    db: TransactionClient,
  ) {
    return db.transaction.create({
      data: {
        type: TxType.TRANSFER,
        amount: input.amount,
        status: TxStatus.PROCESSING,
        fromUserId: input.fromUserId,
        toUserId: input.toUserId,
        createdByUserId: input.fromUserId,
        idempotencyKey: input.idempotencyKey,
        description: input.description,
      },
    });
  }

  async getDashboardStats(userId: string) {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );
    const stats = await this.prisma.$queryRaw<DashboardStatsRaw[]>(
      Prisma.sql`
      SELECT
        (SELECT balance FROM user_balances WHERE "userId" = ${userId} LIMIT 1) as balance,
        (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE "fromUserId" = ${userId} AND status = ${TxStatus.SUCCESS}) as "sumSent",
        (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE "toUserId" = ${userId} AND status = ${TxStatus.SUCCESS}) as "sumReceived",
        (SELECT COALESCE(SUM(amount), 0) FROM transactions 
         WHERE "createdAt" >= ${startOfMonth} 
         AND ("fromUserId" = ${userId} OR "toUserId" = ${userId}) 
         AND status = ${TxStatus.SUCCESS}) as "monthlyVolume"
      `,
    );

    return (
      stats[0] || {
        balance: 0n,
        locked: 0n,
        sumSent: 0n,
        sumReceived: 0n,
        monthlyVolume: 0n,
      }
    );
  }
}

export const transactionRepository = new TransactionRepository();
