import { transactionRepository } from "../repositories/transaction.repository";
import { Parser } from "json2csv";
import {
  detailTransactionDTO,
  listTransactionDTO,
} from "../utils/transactionDTO";

export class TransactionService {
  // List with Filters
  async list(userId: string, query: any) {
    const { filter, search, limit = "20", skip = "0" } = query;

    const result = await transactionRepository.findAll(userId, {
      type: filter, // 'sent', 'received', 'pending'
      search: search,
      take: Number(limit),
      skip: Number(skip),
    });

    return {
      data: result.transactions.map((t) => listTransactionDTO(t, userId)),
      total: result.total,
    };
  }

  // Single Details
  async getDetails(userId: string, txId: string) {
    const tx = await transactionRepository.findById(txId);
    if (!tx) throw new Error("Transaction not found");

    // Security check
    if (tx.fromUserId !== userId && tx.toUserId !== userId) {
      throw new Error("Unauthorized");
    }
    return detailTransactionDTO(tx, userId);
  }

  // Export CSV (Heavy Operation)
  async downloadCsv(userId: string, query: any) {
    // Fetch ALL (Limit 10k safety)
    const { filter, search, limit = "20", skip = "0" } = query;
    const { transactions } = await transactionRepository.findAll(userId, {
      type: filter, // 'sent', 'received', 'pending'
      search: search,
      take: Number(limit),
      skip: Number(skip),
    });

    const data = transactions.map((t) => listTransactionDTO(t, userId));
    const parser = new Parser();
    return parser.parse(data);
  }
}

export const transactionService = new TransactionService();
