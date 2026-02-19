import { getPrisma, Prisma, TransactionClient } from "../index.js";

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

  async settleDeposit(userId: string, amount: bigint, tx: TransactionClient) {
    await tx.userBalance.update({
      where: {
        userId,
      },
      data: {
        balance: { increment: amount },
      },
    });
  }

  async settleWithdrawal(
    userId: string,
    amount: bigint,
    tx: TransactionClient,
  ) {
    await tx.userBalance.update({
      where: { userId },
      data: {
        balance: { decrement: amount },
        locked: { decrement: amount },
      },
    });
  }

  async refundWithdrawal(
    userId: string,
    amount: bigint,
    tx: TransactionClient,
  ) {
    await tx.userBalance.update({
      where: { userId },
      data: {
        locked: { decrement: amount },
      },
    });
  }

  async executeTransfer(
    fromUserId: string,
    toUserId: string,
    amount: bigint,
    tx: TransactionClient,
  ) {
    // 1️⃣ Lock both rows in a consistent order to avoid deadlocks
    const [firstId, secondId] = [fromUserId, toUserId].sort();

    await tx.$queryRaw`
    SELECT "userId", "balance" FROM user_balances 
    WHERE "userId" IN (${firstId}, ${secondId}) 
    FOR UPDATE
  `;

    // 2️⃣ Verify sender balance
    const sender = await tx.userBalance.findUnique({
      where: { userId: fromUserId },
    });
    if (!sender || sender.balance < amount) {
      throw new Error("INSUFFICIENT_FUNDS");
    }

    // 3️⃣ Perform the move
    await tx.userBalance.update({
      where: { userId: fromUserId },
      data: { balance: { decrement: amount } },
    });

    await tx.userBalance.update({
      where: { userId: toUserId },
      data: { balance: { increment: amount } },
    });
  }
}

export const userBalanceRepository = new UserBalanceRepository();
