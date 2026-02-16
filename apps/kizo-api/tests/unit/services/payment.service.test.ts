import { describe, it, expect, vi } from "vitest";
import { PaymentService } from "../../../src/services/payment.service";
import {
  bankTransferRepository,
  transactionRepository,
  userBalanceRepository,
  userRepository,
  getPrisma,
} from "@kizo/db";
import { transactionQueue } from "@kizo/queue";

const mockLog = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  bindings: vi.fn().mockReturnValue({ traceId: "test-trace" }),
} as any;
const paymentService = new PaymentService();

describe("getBalance", () => {
  const mockUserId = "user-123";

  it("✅ SUCCESS: returns balance and locked amount as strings", async () => {
    vi.mocked(userBalanceRepository.getAccount).mockResolvedValue({
      balance: BigInt(1000),
      locked: BigInt(200),
    } as any);

    const result = await paymentService.getBalance(mockUserId, mockLog);

    expect(result).toEqual({
      balance: "1000",
      locked: "200",
    });

    expect(userBalanceRepository.getAccount).toHaveBeenCalledWith(mockUserId);
    expect(mockLog.info).toHaveBeenCalledWith(
      { userId: mockUserId },
      "Successfully Fetched Balance",
    );
  });

  it("❌ FAILURE: throws error if account is missing", async () => {
    vi.mocked(userBalanceRepository.getAccount).mockResolvedValue(null as any);

    await expect(
      paymentService.getBalance(mockUserId, mockLog),
    ).rejects.toThrow("Account not found");
  });
});

describe("depositMoney", () => {
  const mock = {
    userId: "user-1",
    paylod: { amount: 500, note: "Test" },
    idempotencyKey: "idem-1",
    log: mockLog,
  };

  it("✅ SUCCESS: creates deposit when idempotency key is new", async () => {
    vi.mocked(transactionRepository.findByIdempotencyKey).mockResolvedValue(
      null,
    );
    vi.mocked(transactionRepository.createDeposit).mockResolvedValue({
      id: "tx-1",
      status: "PROCESSING",
      createdAt: new Date(),
      amount: 110n,
      type: "DEPOSIT",
    } as any);

    const result = await paymentService.depositMoney(
      mock.userId,
      mock.paylod,
      mock.idempotencyKey,
      mock.log,
    );

    expect(transactionRepository.createDeposit).toHaveBeenCalled();
    expect(bankTransferRepository.create).toHaveBeenCalled();
    expect(result).toEqual({
      transactionId: "tx-1",
      status: "PROCESSING",
    });
  });

  it("❌ FAILURE: returns existing transaction on idempotency hit", async () => {
    vi.mocked(transactionRepository.findByIdempotencyKey).mockResolvedValue({
      id: "tx-existing",
      status: "SUCCESS",
    } as any);

    const result = await paymentService.depositMoney(
      mock.userId,
      mock.paylod,
      mock.idempotencyKey,
      mock.log,
    );

    expect(transactionRepository.createDeposit).not.toHaveBeenCalled();
    expect(result).toEqual({
      transactionId: "tx-existing",
      status: "SUCCESS",
    });
  });
});

describe("withdrawMoney", () => {
  const mock = {
    userId: "user-1",
    paylod: { amount: 500, note: "Test" },
    idempotencyKey: "idem-1",
    log: mockLog,
  };

  const prisma = getPrisma();

  it("❌ FAILURE: fails when balance is insufficient", async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValue([
      {
        balance: BigInt(100),
        locked: BigInt(0),
      },
    ]);

    await expect(
      paymentService.withdrawMoney(
        mock.userId,
        mock.paylod,
        mock.idempotencyKey,
        mock.log,
      ),
    ).rejects.toThrow("Insufficient balance");
  });

  it("locks funds and creates withdrawal", async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValue([
      {
        balance: BigInt(1000),
        locked: BigInt(0),
      },
    ]);

    vi.mocked(transactionRepository.findByIdempotencyKey).mockResolvedValue(
      null,
    );
    vi.mocked(transactionRepository.createWithdraw).mockResolvedValue({
      id: "tx-w1",
      status: "PROCESSING",
    } as any);

    const result = await paymentService.withdrawMoney(
      mock.userId,
      mock.paylod,
      mock.idempotencyKey,
      mock.log,
    );

    expect(prisma.userBalance.update).toHaveBeenCalled();
    expect(bankTransferRepository.create).toHaveBeenCalled();
    expect(result.transactionId).toBe("tx-w1");
  });
});

describe("transferMoney", () => {
  it("✅ SUCCESS: transfers money to another user and queues task", async () => {
    // 1. Mock Recipient Check
    vi.mocked(userRepository.findByEmail).mockResolvedValue({
      id: "user-2",
      status: "ACTIVE",
    } as any);

    // 2. Mock Idempotency Check
    vi.mocked(transactionRepository.findByIdempotencyKey).mockResolvedValue(
      null,
    );

    // 3. Mock the ACTUAL method called: createTransfer
    vi.mocked(transactionRepository.createTransfer).mockResolvedValue({
      id: "tx-p2p-123",
      status: "PROCESSING",
    } as any);

    const result = await paymentService.transferMoney(
      "user-1",
      { recipient: "test@example.com", amount: 200, note: "hello" },
      "idem-p2p",
      mockLog,
    );

    // 4. Assertions
    expect(result).toEqual({
      transactionId: "tx-p2p-123",
      status: "PROCESSING",
    });

    expect(transactionQueue.add).toHaveBeenCalledWith(
      "P2P-Transfer",
      expect.objectContaining({ transactionId: "tx-p2p-123" }),
      expect.anything(),
    );
  });

  it("rejects self-transfer", async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue({
      id: "user-1",
      status: "ACTIVE",
    } as any);

    await expect(
      paymentService.transferMoney(
        "user-1",
        { recipient: "me@test.com", amount: 100 },
        "idem",
        mockLog,
      ),
    ).rejects.toThrow("Cannot transfer to yourself");
  });
});
