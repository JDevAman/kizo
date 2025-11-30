import { prisma } from "../db";
import { TxStatus, TxType, Prisma } from "@prisma/client";

export class TransactionRepository {
  
  // --- CORE LISTING ---
  async findAll(userId: string, filters: {
    type?: 'sent' | 'received' | 'pending';
    search?: string;
    skip?: number;
    take?: number;
  }) {
    const where: Prisma.TransactionWhereInput = {
      OR: [{ fromUserId: userId }, { toUserId: userId }], // Base: Involved in tx
    };

    // 1. Apply Filters
    if (filters.type === 'sent') where.fromUserId = userId;
    if (filters.type === 'received') where.toUserId = userId;
    if (filters.type === 'pending') where.status = TxStatus.PROCESSING; // Mapped from old 'pending'

    // 2. Apply Search (Check User Names)
    if (filters.search) {
      where.AND = {
        OR: [
          { description: { contains: filters.search, mode: 'insensitive' } },
          { fromUser: { firstName: { contains: filters.search, mode: 'insensitive' } } },
          { toUser: { firstName: { contains: filters.search, mode: 'insensitive' } } },
        ]
      };
    }

    // 3. Execute Query
    const [total, transactions] = await prisma.$transaction([
      prisma.transaction.count({ where }),
      prisma.transaction.findMany({
        where,
        skip: filters.skip || 0,
        take: filters.take || 20,
        orderBy: { createdAt: 'desc' },
        include: {
          fromUser: { select: { firstName: true, lastName: true, userName: true, avatar: true } },
          toUser: { select: { firstName: true, lastName: true, userName: true, avatar: true } }
        }
      })
    ]);

    return { total, transactions };
  }

  async findById(id: string) {
    return await prisma.transaction.findUnique({
      where: { id },
      include: {
        fromUser: { select: { firstName: true, lastName: true, userName: true } },
        toUser: { select: { firstName: true, lastName: true, userName: true } }
      }
    });
  }

  // --- DASHBOARD AGGREGATIONS (Optimized) ---
  
  // Sum money sent by user (Success only)
  async getSumSent(userId: string) {
    const result = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        fromUserId: userId,
        status: TxStatus.SUCCESS,
        type: { not: TxType.WITHDRAWAL } // Exclude withdrawals if any
      }
    });
    return result._sum.amount || 0;
  }

  // Sum money received by user (Success only)
  async getSumReceived(userId: string) {
    const result = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        toUserId: userId,
        status: TxStatus.SUCCESS
      }
    });
    return result._sum.amount || 0;
  }

  // Sum usage this month
  async getMonthlyVolume(userId: string) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0,0,0,0);

    const result = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
        status: TxStatus.SUCCESS,
        createdAt: { gte: startOfMonth }
      }
    });
    return result._sum.amount || 0;
  }
}

export const transactionRepository = new TransactionRepository();