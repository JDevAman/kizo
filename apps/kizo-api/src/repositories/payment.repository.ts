import { TxType, TxStatus } from "@prisma/client";
import { transactionRepository } from "./transaction.repository.js";
import { getPrisma } from "@kizo/db";

export class UserBalanceRepository {
  private get prisma() {
    return getPrisma();
  }
  async getAccount(userId: string) {
    return await this.prisma.userBalance.findUnique({ where: { userId } });
  }

  // Atomic Add Money
  async depositMoney(userId: string, amount: number) {
    return await this.prisma.$transaction(async (tx) => {
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
          createdByUserId: userId,
          description: "Credited via System",
          toUser: { connect: { id: userId } },
        },
      });
    });
  }

  async withdrawMoney(userId: string, amount: number, provider: string) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Credit Balance
      await tx.userBalance.update({
        where: { userId },
        data: { balance: { decrement: amount } },
      });

      // 2. Create Ledger Entry
      return await tx.transaction.create({
        data: {
          amount,
          type: TxType.WITHDRAWAL,
          status: TxStatus.SUCCESS,
          createdByUserId: userId,
          description: "Debited via System",
          toUser: { connect: { id: userId } },
        },
      });
    });
  }

  // Atomic Transfer (P2P)
  async transfer(
    fromUserId: string,
    toUserId: string,
    amount: number,
    note?: string,
    idempotencyKey?: string
  ) {
    if (amount <= 0) {
      throw new Error("Invalid amount");
    }

    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Idempotency
      if (idempotencyKey) {
        const existing = await transactionRepository.findByIdempotencyKey(
          fromUserId,
          idempotencyKey,
          TxType.TRANSFER,
          tx
        );

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

      const senderBalance = Number(sender?.balance ?? 0);

      if (senderBalance < amount) {
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

      if (!idempotencyKey) {
        throw new Error("idempotencyKey is required for transfer");
      }
      // 5️⃣ Ledger
      return transactionRepository.createTransfer(
        {
          amount,
          description: note,
          idempotencyKey,
          fromUserId,
          toUserId,
        },
        tx
      );
    });
  }

  // // --- REQUESTS (SOCIAL LAYER) ---
  // async createRequest(requesterId: string, payerId: string, amount: number, note?: string) {
  //   return awaitthis.prisma.paymentRequest.create({
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
  //   return awaitthis.prisma.paymentRequest.findUnique({
  //     where: { id: requestId },
  //     include: {
  //       requester: { select: { id: true, firstName: true, userName: true } },
  //       payer: { select: { id: true, firstName: true, userName: true } }
  //     }
  //   });
  // }

  // async updateRequestStatus(requestId: string, status: RequestStatus) {
  //   return awaitthis.prisma.paymentRequest.update({
  //     where: { id: requestId },
  //     data: { status },
  //   });
  // }

  // async getUserRequests(userId: string) {
  //   return awaitthis.prisma.paymentRequest.findMany({
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
