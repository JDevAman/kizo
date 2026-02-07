import { vi, it, describe, expect, beforeEach } from "vitest";
import {
  listTransactions,
  getTransaction,
  exportTransactions,
} from "../../../src/controllers/transaction.controller";
import { transactionService } from "../../../src/services/transaction.service";

vi.mock("../../../src/services/transaction.service", () => ({
  transactionService: {
    list: vi.fn(),
    getDetails: vi.fn(),
    downloadCsv: vi.fn(),
  },
}));

describe("Transaction Controller Unit Tests", () => {
  let req: any, res: any, next: any;

  beforeEach(() => {
    vi.clearAllMocks();

    req = {
      body: {},
      log: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
      params: { id: "tx-1" },
      query: { skip: "10", limit: "50" },
      user: { id: "user-123" },
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      header: vi.fn().mockReturnThis(),
      attachment: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  it("✅ List Transactions: should list all transactions", async () => {
    const mockTxs = [
      {
        transactionId: "tx-1",
        status: "PROCESSING",
      },
      {
        transactionId: "tx-2",
        status: "SUCCESS",
      },
    ];
    const serviceResponse = Object.assign(mockTxs, { total: 100 });
    vi.mocked(transactionService.list).mockResolvedValue(
      serviceResponse as any,
    );

    await listTransactions(req, res, next);
    expect(transactionService.list).toHaveBeenCalledWith(
      req.user.id,
      expect.objectContaining({ skip: 10, limit: 50 }),
    );

    expect(res.json).toHaveBeenCalledWith({
      transactions: serviceResponse,
      total: 100,
      limit: 50,
      skip: 10,
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("✅ Get Transaction: should fetch single txn", async () => {
    const mockTx = {
      transactionId: "tx-1",
      status: "PROCESSING",
    };

    vi.mocked(transactionService.getDetails).mockResolvedValue(mockTx as any);

    await getTransaction(req, res, next);

    expect(transactionService.getDetails).toHaveBeenCalledWith(
      req.user.id,
      req.params.id,
      expect.anything(),
    );
    expect(res.json).toHaveBeenCalledWith(mockTx);
  });

  it("✅ Export Transactions: should export transaction", async () => {
    const mockCsv = "id,status\ntx-1,PROCESSING";

    vi.mocked(transactionService.downloadCsv).mockResolvedValue(mockCsv);

    await exportTransactions(req, res, next);

    expect(transactionService.downloadCsv).toHaveBeenCalledWith(
      req.user.id,
      req.query,
      expect.anything(),
    );

    expect(res.header).toHaveBeenCalledWith("Content-Type", "text/csv");
    expect(res.attachment).toHaveBeenCalledWith("transactions.csv");
    expect(res.send).toHaveBeenCalledWith(mockCsv);
    expect(next).not.toHaveBeenCalled();
  });
});
