import { transactionRepository } from "@kizo/db";
import { Parser } from "json2csv";
import {
  detailTransactionDTO,
  listTransactionDTO,
} from "../utils/transactionDTO.js";
import { Logger } from "@kizo/logger";

export class TransactionService {
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

  async getDetails(userId: string, txId: string, log: Logger) {
    const tx = await transactionRepository.findById(txId);
    if (!tx) {
      log.warn({ txId, userId }, "Transaction detail lookup failed: Not found");
      throw new Error("Transaction not found");
    }

    // Security check
    if (tx.fromUserId !== userId && tx.toUserId !== userId) {
      log.error(
        { txId, userId, ownerId: tx.fromUserId },
        "UNAUTHORIZED_ACCESS_ATTEMPT: User tried to view another's transaction",
      );
      throw new Error("Unauthorized");
    }
    return detailTransactionDTO(tx, userId);
  }

  async downloadCsv(userId: string, query: any, log: Logger) {
    const startTime = Date.now();
    const { filter, search, limit = "100", skip = "0" } = query;

    log.info({ userId, limit }, "Starting CSV generation");

    const { transactions } = await transactionRepository.findAll(userId, {
      type: filter,
      search: search,
      take: Math.min(Number(limit), 10000),
      skip: Number(skip),
    });

    try {
      const data = transactions.map((t) => listTransactionDTO(t, userId));
      const parser = new Parser();
      const csv = parser.parse(data);

      log.info(
        {
          userId,
          rowCount: transactions.length,
          duration: `${Date.now() - startTime}ms`,
        },
        "CSV generation completed",
      );

      return csv;
    } catch (err: any) {
      log.error({ err: err.message, userId }, "CSV generation failed");
      throw err;
    }
  }
}

export const transactionService = new TransactionService();
