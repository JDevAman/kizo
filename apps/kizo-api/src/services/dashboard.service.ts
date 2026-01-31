import { DashboardData } from "@kizo/shared";
import { transactionRepository } from "@kizo/db";
import { listTransactionDTO } from "../utils/transactionDTO.js";
import { Logger } from "@kizo/logger";

export class DashboardService {
  async getStats(userId: string, log: Logger): Promise<DashboardData> {
    try {
      const [stats, recentTxData] = await Promise.all([
        transactionRepository.getDashboardStats(userId),
        transactionRepository.findAll(userId, { take: 5 }),
      ]);

      if (!stats) {
        log.warn(
          { userId },
          "Dashboard stats query returned null unexpectedly",
        );
        throw new Error("Could not retrieve dashboard data");
      }

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
    } catch (error: any) {
      log.error(
        { err: error.message, stack: error.stack },
        "Database fetch failed in DashboardService",
      );
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
