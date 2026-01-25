import { DashboardData } from "@kizo/shared";
import { transactionRepository } from "../repositories/transaction.repository.js";
import { listTransactionDTO } from "../utils/transactionDTO.js";

export class DashboardService {
  async getStats(userId: string): Promise<DashboardData> {
    const [stats, recentTxData] = await Promise.all([
      transactionRepository.getDashboardStats(userId),
      transactionRepository.findAll(userId, { take: 5 }),
    ]);

    if (!stats) throw new Error("Could not retrieve dashboard data");

    return {
      balance: String(stats.balance),
      stats: {
        sent: String(stats.sumSent ?? 0),
        received: String(stats.sumReceived ?? 0),
        thisMonth: String(stats.monthlyVolume ?? 0),
        totalCount: String(recentTxData.total),
      },

      recentTransactions: recentTxData.transactions.map((t) =>
        listTransactionDTO(t, userId),
      ),
    };
  }
}

export const dashboardService = new DashboardService();
