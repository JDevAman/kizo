import { prisma } from "../lib/db";
import { TxType, TxStatus } from "@prisma/client";

export class UserBalanceRepository {
  // --- CORE BANKING ---
  async getAccount(userId: string) {
    return await prisma.userBalance.findUnique({ where: { userId } });
  }

  // Atomic Add Money
  async depositMoney(userId: string, amount: number) {
    return await prisma.$transaction(async (tx) => {
      // 1. Credit Balance
      await tx.userBalance.update({
        where: { userId },
        data: { balance: { increment: amount } },
      });

      // 2. Create Ledger Entry
      return await tx.transaction.create({
        data: {
          amount,
          type: TxType.DEPOSIT,
          status: TxStatus.SUCCESS,
          description: `Added via ${provider}`,
          toUser: { connect: { id: userId } },
        },
      });
    });
  }
  async withdrawMoney(userId: string, amount: number, provider: string) {
    return await prisma.$transaction(async (tx) => {
      // 1. Credit Balance
      await tx.userBalance.update({
        where: { userId },
        data: { balance: { decrement: amount } },
      });

      // 2. Create Ledger Entry
      return await tx.transaction.create({
        data: {
          amount,
          type: TxType.DEPOSIT,
          status: TxStatus.SUCCESS,
          description: `Added via ${provider}`,
          toUser: { connect: { id: userId } },
        },
      });
    });
  }

  // Atomic Transfer (P2P)
  async transfer(
    fromUserId: string,
    toUserId: string,
    amount: bigint,
    note?: string,
    idempotencyKey?: string
  ) {
    if (amount <= 0n) {
      throw new Error("Invalid amount");
    }

    return prisma.$transaction(async (tx) => {
      // 1️⃣ Idempotency
      if (idempotencyKey) {
        const existing = await tx.transaction.findUnique({
          where: { idempotencyKey },
        });
        if (existing) return existing;
      }

      // 2️⃣ Lock both balances (consistent order to avoid deadlock)
      const [sender] = await tx.$queryRawUnsafe<{ balance: bigint }[]>(
        `
      SELECT balance FROM user_balances
      WHERE "userId" IN ($1, $2)
      ORDER BY "userId"
      FOR UPDATE
      `,
        fromUserId,
        toUserId
      );

      if (!sender || sender.balance < amount) {
        throw new Error("Insufficient balance");
      }

      // 3️⃣ Debit sender
      await tx.userBalance.update({
        where: { userId: fromUserId },
        data: { balance: { decrement: amount } },
      });

      // 4️⃣ Credit receiver
      await tx.userBalance.update({
        where: { userId: toUserId },
        data: { balance: { increment: amount } },
      });

      // 5️⃣ Ledger
      return tx.transaction.create({
        data: {
          amount,
          type: TxType.P2P_TRANSFER,
          status: TxStatus.SUCCESS,
          description: note,
          idempotencyKey,
          fromUserId,
          toUserId,
          processedAt: new Date(),
        },
      });
    });
  }

  // // --- REQUESTS (SOCIAL LAYER) ---
  // async createRequest(requesterId: string, payerId: string, amount: number, note?: string) {
  //   return await prisma.paymentRequest.create({
  //     data: {
  //       amount,
  //       note,
  //       status: RequestStatus.PENDING,
  //       requester: { connect: { id: requesterId } },
  //       payer: { connect: { id: payerId } },
  //     },
  //   });
  // }

  // async getRequestById(requestId: string) {
  //   return await prisma.paymentRequest.findUnique({
  //     where: { id: requestId },
  //     include: {
  //       requester: { select: { id: true, firstName: true, userName: true } },
  //       payer: { select: { id: true, firstName: true, userName: true } }
  //     }
  //   });
  // }

  // async updateRequestStatus(requestId: string, status: RequestStatus) {
  //   return await prisma.paymentRequest.update({
  //     where: { id: requestId },
  //     data: { status },
  //   });
  // }

  // async getUserRequests(userId: string) {
  //   return await prisma.paymentRequest.findMany({
  //     where: {
  //       OR: [{ requesterId: userId }, { payerId: userId }],
  //     },
  //     orderBy: { createdAt: "desc" },
  //     include: {
  //       requester: { select: { firstName: true, lastName: true, userName: true } },
  //       payer: { select: { firstName: true, lastName: true, userName: true } },
  //     },
  //   });
  // }
}

export const userBalanceRepository = new UserBalanceRepository();
