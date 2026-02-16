import { describe, it, vi, beforeEach, expect } from "vitest";
import { bankTransferRepository } from "../../dist";
import { BankTransferStatus } from "../../src";

const mockDb = {
  bankTransfer: {
    upsert: vi.fn(),
    findUnique: vi.fn(),
    updateMany: vi.fn(),
  },
} as any;

describe("Bank Transfer - Idempotency & LifeCycle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("🛡️ create() should use upsert to prevent duplicate bank transfer records", async () => {
    const input = {
      transactionId: "tx_123",
      amount: BigInt(1000),
      metadata: { gateway: "HDFC" },
    };

    await bankTransferRepository.create(input, mockDb);

    expect(mockDb.bankTransfer.upsert).toHaveBeenCalledWith({
      where: { transactionId: input.transactionId },
      create: expect.objectContaining({
        status: BankTransferStatus.PROCESSING,
        amount: input.amount,
      }),
      update: {},
    });
  });

  it("✅ markSuccess() should only update if currently PROCESSING", async () => {
    const transactionId = "tx_success_123",
      externalRef = "BANK_REF_999";

    await bankTransferRepository.markSuccess(
      transactionId,
      externalRef,
      mockDb,
    );
    expect(mockDb.bankTransfer.updateMany).toHaveBeenCalledWith({
      where: { transactionId, status: BankTransferStatus.PROCESSING },
      data: { status: BankTransferStatus.SUCCESS, externalRef },
    });
  });

  it("❌ markFailed() should link externalRef even on failure", async () => {
    const transactionId = "tx_error_123",
      externalRef = "BANK_ERR_001";

    await bankTransferRepository.markFailed(transactionId, externalRef, mockDb);
    expect(mockDb.bankTransfer.updateMany).toHaveBeenCalledWith({
      where: { transactionId, status: BankTransferStatus.PROCESSING },
      data: { status: BankTransferStatus.FAILED, externalRef },
    });
  });
});
