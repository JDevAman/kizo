import { describe, it, expect, vi, beforeEach } from "vitest";
import { PaymentService } from "../../src/services/payment.service";

const mockDb: any = {
  userBalance: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
};

vi.mock("@kizo/db", () => ({
  getPrisma: () => ({
    userBalance: mockDb.userBalance,
    $transaction: async (cb: any) => cb(mockDb),
  }),
}));

vi.mock("../../src/repositories/transaction.repository", () => ({
  transactionRepository: {
    findByIdempotencyKey: vi.fn(),
    createDeposit: vi.fn(),
    createWithdraw: vi.fn(),
  },
}));

vi.mock("../../src/repositories/bankTransfer.repository", () => ({
  bankTransferRepository: {
    create: vi.fn(),
  },
}));

vi.mock("../../src/repositories/payment.repository", () => ({
  userBalanceRepository: {
    getAccount: vi.fn(),
    transfer: vi.fn(),
  },
}));

vi.mock("../../src/repositories/user.repository", () => ({
  userRepository: {
    findByEmail: vi.fn(),
  },
}));

vi.mock("../../src/lib/webhook", () => ({
  triggerMockBankWebhook: vi.fn(),
}));

import { transactionRepository } from "../../src/repositories/transaction.repository";
import { bankTransferRepository } from "../../src/repositories/bankTransfer.repository";
import { userBalanceRepository } from "../../src/repositories/payment.repository";
import { userRepository } from "../../src/repositories/user.repository";
import { triggerMockBankWebhook } from "../../src/lib/webhook";

const service = new PaymentService();

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getBalance", () => {
  it("returns balance and locked amount", async () => {
    userBalanceRepository.getAccount.mockResolvedValue({
      balance: BigInt(1000),
      locked: BigInt(200),
    });

    const result = await service.getBalance("user-1");

    expect(result).toEqual({
      balance: "1000",
      locked: "200",
    });
  });

  it("throws if account not found", async () => {
    userBalanceRepository.getAccount.mockResolvedValue(null);

    await expect(service.getBalance("user-1")).rejects.toThrow(
      "Account not found",
    );
  });
});

describe("depositMoney", () => {
  it("creates deposit when idempotency key is new", async () => {
    transactionRepository.findByIdempotencyKey.mockResolvedValue(null);
    transactionRepository.createDeposit.mockResolvedValue({
      id: "tx-1",
      status: "PROCESSING",
    });

    const result = await service.depositMoney(
      "user-1",
      { amount: 500, provider: "HDFC", note: "test" },
      "idem-1",
    );

    expect(transactionRepository.createDeposit).toHaveBeenCalled();
    expect(bankTransferRepository.create).toHaveBeenCalled();
    expect(result).toEqual({
      transactionId: "tx-1",
      status: "PROCESSING",
    });
  });

  it("returns existing transaction on idempotency hit", async () => {
    transactionRepository.findByIdempotencyKey.mockResolvedValue({
      id: "tx-existing",
      status: "SUCCESS",
    });

    const result = await service.depositMoney(
      "user-1",
      { amount: 500, provider: "HDFC" },
      "idem-1",
    );

    expect(transactionRepository.createDeposit).not.toHaveBeenCalled();
    expect(result).toEqual({
      transactionId: "tx-existing",
      status: "SUCCESS",
    });
  });
});
describe("withdrawMoney", () => {
  it("fails when balance is insufficient", async () => {
    mockDb.userBalance.findUnique.mockResolvedValue({
      balance: BigInt(100),
      locked: BigInt(0),
    });

    await expect(
      service.withdrawMoney(
        "user-1",
        { amount: 500, provider: "ICICI" },
        "idem-w1",
      ),
    ).rejects.toThrow("Insufficient balance");
  });

  it("locks funds and creates withdrawal", async () => {
    mockDb.userBalance.findUnique.mockResolvedValue({
      balance: BigInt(1000),
      locked: BigInt(0),
    });

    transactionRepository.findByIdempotencyKey.mockResolvedValue(null);
    transactionRepository.createWithdraw.mockResolvedValue({
      id: "tx-w1",
      status: "PROCESSING",
    });

    const result = await service.withdrawMoney(
      "user-1",
      { amount: 300, provider: "ICICI" },
      "idem-w1",
    );

    expect(mockDb.userBalance.update).toHaveBeenCalled();
    expect(bankTransferRepository.create).toHaveBeenCalled();
    expect(result.transactionId).toBe("tx-w1");
  });
});
describe("transferMoney", () => {
  it("transfers money to another user", async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: "user-2",
      status: "ACTIVE",
    });

    userBalanceRepository.transfer.mockResolvedValue({
      transactionId: "tx-p2p",
      status: "SUCCESS",
    });

    const result = await service.transferMoney(
      "user-1",
      {
        recipient: "test@example.com",
        amount: 200,
        note: "hello",
      },
      "idem-p2p",
    );

    expect(userBalanceRepository.transfer).toHaveBeenCalledWith(
      "user-1",
      "user-2",
      200,
      "hello",
      "idem-p2p",
    );

    expect(result.status).toBe("SUCCESS");
  });

  it("rejects self-transfer", async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: "user-1",
      status: "ACTIVE",
    });

    await expect(
      service.transferMoney(
        "user-1",
        { recipient: "me@test.com", amount: 100 },
        "idem",
      ),
    ).rejects.toThrow("Cannot transfer to yourself");
  });
});
