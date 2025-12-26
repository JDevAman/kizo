import { DashboardData } from "@kizo/shared";
import { userBalanceRepository } from "../repositories/payment.repository";
import { transactionRepository } from "../repositories/transaction.repository";
import { listTransactionDTO } from "../utils/transactionDTO";

export class DashboardService {
  async getStats(userId: string): Promise<DashboardData> {
    const [account, sentAgg, receivedAgg, monthlyAgg, recentTxData] =
      await Promise.all([
        userBalanceRepository.getAccount(userId),
        transactionRepository.getSumSent(userId),
        transactionRepository.getSumReceived(userId),
        transactionRepository.getMonthlyVolume(userId),
        transactionRepository.findAll(userId, { take: 5 }),
      ]);

    if (!account) throw new Error("Account not found");

    return {
      balance: String(account.balance),

      stats: {
        sent: String(sentAgg._sum.amount ?? 0),
        received: String(receivedAgg._sum.amount ?? 0),
        thisMonth: String(monthlyAgg._sum.amount ?? 0),
        totalCount: recentTxData.total,
      },

      recentTransactions: recentTxData.transactions.map((t) =>
        listTransactionDTO(t, userId)
      ),
    };
  }
}

export const dashboardService = new DashboardService();
