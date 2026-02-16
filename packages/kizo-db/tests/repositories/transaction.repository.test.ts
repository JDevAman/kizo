import { describe, it, vi, beforeEach, expect } from "vitest";
import { transactionRepository, TxStatus } from "../../src";

const mockDb = {
  transaction: { update: vi.fn() },
} as any;

describe("Transaction Repository - Update Status", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("✅ should transition to SUCCESS and update timestamp", async () => {
    const txId = "abc_123";
    await transactionRepository.updateStatus(txId, TxStatus.SUCCESS, mockDb);

    expect(mockDb.transaction.update).toHaveBeenCalledWith({
      where: { id: txId },
      data: expect.objectContaining({
        status: TxStatus.SUCCESS,
        processedAt: expect.any(Date),
      }),
    });
  });

  it("❌ should record failure reason when status is FAILED", async () => {
    const txId = "abc_123";
    const reason = "INSUFFICIENT_FUNDS";
    await transactionRepository.updateStatus(
      txId,
      TxStatus.FAILED,
      mockDb,
      reason,
    );

    expect(mockDb.transaction.update).toHaveBeenCalledWith({
      where: { id: txId },
      data: expect.objectContaining({
        status: TxStatus.FAILED,
        processedAt: null,
        description: reason,
      }),
    });
  });
});
