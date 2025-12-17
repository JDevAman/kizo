import { prisma } from "../lib/db";
import { TxType, TxStatus, RequestStatus } from "@prisma/client";

export class AccountRepository {
  
  // --- CORE BANKING ---
  async getAccount(userId: string) {
    return await prisma.account.findUnique({ where: { userId } });
  }

  // Atomic Add Money
  async deposit(userId: string, amount: number, provider: string) {
    return await prisma.$transaction(async (tx) => {
      // 1. Credit Balance
      await tx.account.update({
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
          // ✅ FIX: Correct Syntax
          toUser: { connect: { id: userId } }, 
        },
      });
    });
  }

  // Atomic Transfer (P2P)
  async transfer(fromUserId: string, toUserId: string, amount: number, note?: string, requestId?: string) {
    return await prisma.$transaction(async (tx) => {
      // 1. Lock Sender
      const sender = await tx.account.findUnique({ where: { userId: fromUserId } });
      if (!sender || sender.balance < amount) throw new Error("Insufficient balance");

      // 2. Debit Sender
      await tx.account.update({
        where: { userId: fromUserId },
        data: { balance: { decrement: amount } },
      });

      // 3. Credit Receiver
      await tx.account.update({
        where: { userId: toUserId },
        data: { balance: { increment: amount } },
      });

      // 4. Create Ledger Entry
      const transaction = await tx.transaction.create({
        data: {
          amount,
          type: TxType.P2P_TRANSFER,
          status: TxStatus.SUCCESS,
          description: note,
          fromUser: { connect: { id: fromUserId } },
          toUser: { connect: { id: toUserId } },
          // For requestId, we connect only if it exists
          request: requestId ? { connect: { id: requestId } } : undefined,
        },
      });

      // 5. If linked to a Request, mark request as ACCEPTED
      if (requestId) {
        await tx.paymentRequest.update({
          where: { id: requestId },
          data: { status: RequestStatus.ACCEPTED },
        });
      }

      return transaction;
    });
  }

  // --- REQUESTS (SOCIAL LAYER) ---

  async createRequest(requesterId: string, payerId: string, amount: number, note?: string) {
    return await prisma.paymentRequest.create({
      data: {
        amount,
        note,
        status: RequestStatus.PENDING,
        requester: { connect: { id: requesterId } },
        payer: { connect: { id: payerId } },
      },
    });
  }

  async getRequestById(requestId: string) {
    return await prisma.paymentRequest.findUnique({
      where: { id: requestId },
      include: { 
        requester: { select: { id: true, firstName: true, userName: true } },
        payer: { select: { id: true, firstName: true, userName: true } }
      }
    });
  }

  async updateRequestStatus(requestId: string, status: RequestStatus) {
    return await prisma.paymentRequest.update({
      where: { id: requestId },
      data: { status },
    });
  }

  async getUserRequests(userId: string) {
    return await prisma.paymentRequest.findMany({
      where: {
        OR: [{ requesterId: userId }, { payerId: userId }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        requester: { select: { firstName: true, lastName: true, userName: true } },
        payer: { select: { firstName: true, lastName: true, userName: true } },
      },
    });
  }
}

export const accountRepository = new AccountRepository();