import { accountRepository } from "../repositories/payment.repository";
import { transactionRepository } from "../repositories/transaction.repository";
import { formatTransaction } from "../utils/formatTransaction";
import { paiseToRupees } from "@kizo/shared";

export class DashboardService {
  async getStats(userId: string) {
    const [account, sentTotal, receivedTotal, monthlyVol, recentTxData] =
      await Promise.all([
        accountRepository.getAccount(userId),
        transactionRepository.getSumSent(userId),
        transactionRepository.getSumReceived(userId),
        transactionRepository.getMonthlyVolume(userId),
        transactionRepository.findAll(userId, { take: 5 }), // Only top 5
      ]);

    if (!account) throw new Error("Account not found");

    return {
      // 1. Balance Card
      balance: paiseToRupees(account.balance),

      // 2. Stats Cards
      stats: {
        sent: paiseToRupees(sentTotal),
        received: paiseToRupees(receivedTotal),
        thisMonth: paiseToRupees(monthlyVol),
        totalCount: recentTxData.total,
      },

      // 3. Recent Activity List (Lightweight)
      recentTransactions: recentTxData.transactions.map((t) =>
        formatTransaction(t, userId)
      ),
    };
  }
}

export const dashboardService = new DashboardService();
