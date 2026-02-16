import { describe, it, expect, vi, beforeEach } from "vitest";
import { reconciliationProcessor } from "../../src/processors/reconciliation.processor";
import { mockDb } from "../setup";
import { transactionQueue } from "@kizo/queue";

const mockLog = {
  info: vi.fn(),
  error: vi.fn(),
  child: vi.fn().mockReturnThis(),
} as any;

describe("Reconciliation Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("🧹 should find stuck transactions and re-queue them", async () => {
    const prisma = mockDb.getPrisma();

    (prisma.transaction.findMany as any).mockResolvedValue([
      {
        id: "tx_zombie_1",
        type: mockDb.TxType.DEPOSIT,
        status: mockDb.TxStatus.PROCESSING,
        toUserId: "user_1",
        reconciliationAttempts: 0,
      },
    ]);

    await reconciliationProcessor(mockLog);

    expect(prisma.transaction.update).toHaveBeenCalledWith({
      where: { id: "tx_zombie_1" },
      data: expect.objectContaining({
        reconciliationAttempts: { increment: 1 },
      }),
    });

    expect(transactionQueue.add).toHaveBeenCalledWith(
      "Deposit-Money",
      { transactionId: "tx_zombie_1" },
      expect.objectContaining({
        jobId: expect.stringContaining("recon-tx_zombie_1"),
      }),
    );
  });

  it("🛡️ should force-fail transactions with invalid data (Data Guard)", async () => {
    const prisma = mockDb.getPrisma();

    (prisma.transaction.findMany as any).mockResolvedValue([
      {
        id: "tx_broken",
        type: mockDb.TxType.DEPOSIT,
        status: mockDb.TxStatus.PROCESSING,
        toUserId: null, // Invalid state
        reconciliationAttempts: 0,
      },
    ]);

    await reconciliationProcessor(mockLog);

    expect(mockDb.transactionRepository.updateStatus).toHaveBeenCalledWith(
      "tx_broken",
      mockDb.TxStatus.FAILED,
      expect.anything(),
      expect.stringContaining("DATA_ERROR"),
    );

    expect(transactionQueue.add).not.toHaveBeenCalled();
  });
});
