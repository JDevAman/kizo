import { describe, it, expect, vi, beforeEach } from "vitest";

/* -------------------- MOCKS -------------------- */

vi.mock("../../src/repositories/transaction.repository", () => ({
  transactionRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
  },
}));

vi.mock("../../src/utils/transactionDTO", () => ({
  listTransactionDTO: vi.fn(),
  detailTransactionDTO: vi.fn(),
}));

vi.mock("json2csv", () => ({
  Parser: vi.fn().mockImplementation(() => ({
    parse: vi.fn(),
  })),
}));

/* -------------------- IMPORTS -------------------- */

import { transactionService } from "../../src/services/transaction.service";
import { transactionRepository } from "../../src/repositories/transaction.repository";
import {
  listTransactionDTO,
  detailTransactionDTO,
} from "../../src/utils/transactionDTO";
import { Parser } from "json2csv";

/* -------------------- TESTS -------------------- */

describe("TransactionService", () => {
  const userId = "user-1";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should list transactions", async () => {
    (transactionRepository.findAll as vi.Mock).mockResolvedValue({
      transactions: [{ id: "tx1" }],
      total: 1,
    });

    (listTransactionDTO as vi.Mock).mockReturnValue({ id: "tx1" });

    const result = await transactionService.list(userId, {
      filter: "sent",
      limit: "10",
      skip: "0",
    });

    expect(result.data).toEqual([{ id: "tx1" }]);
    expect(result.total).toBe(1);
  });

  it("should throw if transaction not found", async () => {
    (transactionRepository.findById as vi.Mock).mockResolvedValue(null);

    await expect(
      transactionService.getDetails(userId, "tx-404")
    ).rejects.toThrow("Transaction not found");
  });

  it("should throw if user is unauthorized", async () => {
    (transactionRepository.findById as vi.Mock).mockResolvedValue({
      id: "tx1",
      fromUserId: "other",
      toUserId: "another",
    });

    await expect(transactionService.getDetails(userId, "tx1")).rejects.toThrow(
      "Unauthorized"
    );
  });

  it("should return transaction details if authorized", async () => {
    const tx = {
      id: "tx1",
      fromUserId: userId,
      toUserId: "user-2",
    };

    (transactionRepository.findById as vi.Mock).mockResolvedValue(tx);
    (detailTransactionDTO as vi.Mock).mockReturnValue({ id: "tx1" });

    const result = await transactionService.getDetails(userId, "tx1");

    expect(result).toEqual({ id: "tx1" });
  });

  it("should export CSV", async () => {
    (transactionRepository.findAll as vi.Mock).mockResolvedValue({
      transactions: [{ id: "tx1" }],
      total: 1,
    });

    (listTransactionDTO as vi.Mock).mockReturnValue({ id: "tx1" });

    (Parser as unknown as vi.Mock).mockImplementation(function () {
      return {
        parse: vi.fn().mockReturnValue("csv-data"),
      };
    });

    const result = await transactionService.downloadCsv(userId, {});

    expect(result).toBe("csv-data");
  });
});
