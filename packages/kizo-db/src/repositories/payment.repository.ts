import { getPrisma, Prisma, TxStatus, TxType } from "../index";
import { transactionRepository } from "./transaction.repository.js";

export class UserBalanceRepository {
  private get prisma() {
    return getPrisma();
  }
  async getAccount(userId: string) {
    const account: [{ balance: String; locked: String }] =
      await this.prisma.$queryRaw(
        Prisma.sql`SELECT DISTINCT balance , locked FROM user_balances WHERE "userId" = ${userId}`,
      );
    return account[0] || null;
  }

  // Atomic Add Money
  async depositMoney(userId: string, amount: bigint) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Credit Balance
      const user = await tx.$queryRaw<{ userId: string }>(
        Prisma.sql`SELECT "userId" FROM user_balances WHERE "userId" = ${userId} ORDER BY userId FOR UPDATE;`,
      );

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

  async withdrawMoney(userId: string, amount: bigint, provider: string) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Credit Balance

      const user = await tx.$queryRaw<{ userId: string }>(
        Prisma.sql`SELECT "userId" FROM user_balances WHERE "userId" = ${userId} ORDER BY userId FOR UPDATE`,
        userId,
      );
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
    amount: string,
    note?: string,
    idempotencyKey?: string,
  ) {
    const bigIntAmount = BigInt(amount);
    if (bigIntAmount <= 0) {
      throw new Error("Invalid amount");
    }

    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Idempotency
      if (idempotencyKey) {
        const existing = await transactionRepository.findByIdempotencyKey(
          fromUserId,
          idempotencyKey,
          TxType.TRANSFER,
          tx,
        );

        if (existing) return existing;
      }

      // 2️⃣ Lock both balances (consistent order to avoid deadlock)
      const rows = await tx.$queryRaw<{ userId: String; balance: bigint }[]>(
        Prisma.sql`
      SELECT userId, balance FROM user_balances
      WHERE userId IN (${fromUserId}, ${toUserId})
      ORDER BY userId
      FOR UPDATE
      `,
      );

      const senderRow = rows.find((r) => r.userId === fromUserId);
      if (!senderRow || senderRow.balance < bigIntAmount) {
        throw new Error("Insufficient balance");
      }

      // 3️⃣ Debit sender
      await tx.userBalance.update({
        where: { userId: fromUserId },
        data: { balance: { decrement: bigIntAmount } },
      });

      // 4️⃣ Credit receiver
      await tx.userBalance.update({
        where: { userId: toUserId },
        data: { balance: { increment: bigIntAmount } },
      });

      if (!idempotencyKey) {
        throw new Error("idempotencyKey is required for transfer");
      }
      // 5️⃣ Ledger
      return transactionRepository.createTransfer(
        {
          amount: bigIntAmount,
          description: note,
          idempotencyKey,
          fromUserId,
          toUserId,
        },
        tx,
      );
    });
  }
}

export const userBalanceRepository = new UserBalanceRepository();
