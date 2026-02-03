import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/utils/transactionDTO", () => ({
  listTransactionDTO: vi.fn(),
  detailTransactionDTO: vi.fn(),
}));

vi.mock("json2csv", () => ({
  Parser: vi.fn().mockImplementation(() => ({
    parse: vi.fn(),
  })),
}));

import { transactionService } from "../../../src/services/transaction.service";
import { transactionRepository } from "@kizo/db";
import {
  listTransactionDTO,
  detailTransactionDTO,
} from "../../../src/utils/transactionDTO";
import { Parser } from "json2csv";

const mockLog = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  bindings: vi.fn().mockReturnValue({ traceId: "test-trace" }),
  child: vi.fn().mockReturnThis(),
} as any;

vi.mock("../../../src/utils/transactionDTO", () => ({
  listTransactionDTO: vi.fn(),
  detailTransactionDTO: vi.fn(),
}));

describe("TransactionService", () => {
  const userId = "user-1";

  it("✅ SUCCESS: list transactions", async () => {
    vi.mocked(transactionRepository.findAll).mockResolvedValue({
      transactions: [{ id: "tx1" } as any],
      total: 1,
    });

    vi.mocked(listTransactionDTO).mockReturnValue({ id: "tx1" } as any);

    const result = await transactionService.list(userId, {
      filter: "sent",
      limit: "10",
      skip: "0",
    });

    expect(result.data).toEqual([{ id: "tx1" }]);
    expect(result.total).toBe(1);
  });

  it("❌ FAILURE: throw if transaction not found", async () => {
    vi.mocked(transactionRepository.findById).mockResolvedValue(null);

    await expect(
      transactionService.getDetails(userId, "tx-404", mockLog),
    ).rejects.toThrow("Transaction not found");
  });

  it("❌ FAILURE: throw if user is unauthorized", async () => {
    vi.mocked(transactionRepository.findById).mockResolvedValue({
      id: "tx1",
      fromUserId: "other",
      toUserId: "another",
    } as any);

    await expect(
      transactionService.getDetails(userId, "tx1", mockLog),
    ).rejects.toThrow("Unauthorized");
  });

  it("✅ SUCCESS:should return transaction details if authorized", async () => {
    const tx = {
      id: "tx1",
      fromUserId: userId,
      toUserId: "user-2",
    };

    vi.mocked(transactionRepository.findById).mockResolvedValue(tx as any);
    vi.mocked(detailTransactionDTO).mockReturnValue({ id: "tx1" } as any);

    const result = await transactionService.getDetails(userId, "tx1", mockLog);

    expect(result).toEqual({ id: "tx1" });
  });

  it("should export CSV", async () => {
    vi.mocked(transactionRepository.findAll).mockResolvedValue({
      transactions: [{ id: "tx1" } as any],
      total: 1,
    });

    vi.mocked(listTransactionDTO).mockReturnValue({ id: "tx1" } as any);

    vi.mocked(Parser).mockImplementation(function () {
      return {
        parse: vi.fn().mockReturnValue("csv-data"),
      };
    });

    const result = await transactionService.downloadCsv(userId, {}, mockLog);

    expect(result).toBe("csv-data");
  });
});
