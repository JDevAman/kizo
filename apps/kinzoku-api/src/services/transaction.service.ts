import { transactionRepository } from "../repositories/transaction.repository";
import { Parser } from "json2csv";
import { formatTransaction } from "../utils/formatTransaction";

export class TransactionService {
  
  // List with Filters
  async list(userId: string, query: any) {
    const { filter, search, limit = "20", skip = "0" } = query;

    const result = await transactionRepository.findAll(userId, {
      type: filter, // 'sent', 'received', 'pending'
      search: search,
      take: Number(limit),
      skip: Number(skip)
    });

    return {
      data: result.transactions.map(t => formatTransaction(t, userId)),
      total: result.total
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

    return formatTransaction(tx, userId);
  }

  // Export CSV (Heavy Operation)
  async downloadCsv(userId: string) {
    // Fetch ALL (Limit 10k safety)
    const { transactions } = await transactionRepository.findAll(userId, { take: 10000 });
    
    const data = transactions.map(t => {
      const formatted = formatTransaction(t, userId);
      return {
        Date: new Date(formatted.date).toLocaleString(),
        Type: formatted.direction.toUpperCase(),
        Amount: formatted.amount,
        Status: formatted.status,
        Counterparty: formatted.otherParty ? formatted.otherParty.firstName : "System",
        Reference: formatted.referenceId
      };
    });

    const parser = new Parser();
    return parser.parse(data);
  }
}

export const transactionService = new TransactionService();