import { vi, it, describe, expect, beforeEach } from "vitest";
import {
  withdrawMoney,
  depositMoney,
  transferMoney,
} from "../../../src/controllers/payment.controller";
import { paymentService } from "../../../src/services/payment.service";

vi.mock("../../../src/services/payment.service", () => ({
  paymentService: {
    depositMoney: vi.fn(),
    transferMoney: vi.fn(),
    withdrawMoney: vi.fn(),
  },
}));

describe("Payment Controller Unit Tests", () => {
  let req: any, res: any, next: any;

  beforeEach(() => {
    vi.clearAllMocks();

    req = {
      user: { id: "user-123" },
      body: { amount: 500 },
      log: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
      headers: { "idempotency-key": "tx-123" },
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  it("✅ Deposit Money: should create user and set cookies", async () => {
    const idempotencyKey = req.headers["idempotency-key"];
    const mockTx = {
      transactionId: "tx-1",
      status: "PROCESSING",
    };

    vi.mocked(paymentService.depositMoney).mockResolvedValue(mockTx as any);

    await depositMoney(req, res, next);
    expect(paymentService.depositMoney).toHaveBeenCalledWith(
      req.user.id,
      req.body,
      idempotencyKey,
      expect.anything(),
    );

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Money Added",
        transaction: mockTx,
      }),
    );
  });

  it("✅ Transfer Money: should transfer money", async () => {
    const idempotencyKey = req.headers["idempotency-key"];
    const mockTx = {
      transactionId: "tx-1",
      status: "PROCESSING",
    };

    vi.mocked(paymentService.transferMoney).mockResolvedValue(mockTx as any);

    await transferMoney(req, res, next);

    expect(paymentService.transferMoney).toHaveBeenCalledWith(
      req.user.id,
      req.body,
      idempotencyKey,
      expect.anything(),
    );
    expect(res.json).toHaveBeenCalledWith({
      message: "Transfer Initiated",
      transaction: mockTx,
    });
  });

  it("✅ Withdraw: should debit money", async () => {
    const idempotencyKey = req.headers["idempotency-key"];
    const mockTx = {
      transactionId: "tx-1",
      status: "PROCESSING",
    };

    vi.mocked(paymentService.withdrawMoney).mockResolvedValue(mockTx as any);

    await withdrawMoney(req, res, next);

    expect(paymentService.withdrawMoney).toHaveBeenCalledWith(
      req.user.id,
      req.body,
      idempotencyKey,
      expect.anything(),
    );

    expect(res.json).toHaveBeenCalledWith({
      message: "Money Debited",
      transaction: mockTx,
    });

    expect(next).not.toHaveBeenCalled();
  });
});
