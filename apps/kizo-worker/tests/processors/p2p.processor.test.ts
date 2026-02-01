import { describe, it, expect, vi, beforeEach } from "vitest";
import { p2pProcessor } from "../../src/processors/p2p.processor";
import { mockDb } from "../setup";

const mockLog = {
  info: vi.fn(),
  error: vi.fn(),
  child: vi.fn(),
  warn: vi.fn(),
} as any;

describe("P2P Processor Logic", () => {
  beforeEach(() => vi.clearAllMocks());

  it("✅ SUCCESS: Should execute transfer and mark as SUCCESS", async () => {
    const job = { data: { transactionId: "p2p_123" } };

    // Setup Mocks
    (mockDb.transactionRepository.findById as any).mockResolvedValue({
      id: "p2p_123",
      status: mockDb.TxStatus.PROCESSING,
      amount: BigInt(500),
      fromUserId: "user_A",
      toUserId: "user_B",
    });

    await p2pProcessor(job, mockLog);

    expect(mockDb.userBalanceRepository.executeTransfer).toHaveBeenCalledWith(
      "user_A",
      "user_B",
      BigInt(500),
      "mock_tx",
    );
    expect(mockDb.transactionRepository.updateStatus).toHaveBeenCalledWith(
      "p2p_123",
      mockDb.TxStatus.SUCCESS,
      "mock_tx",
    );
  });

  it("❌ FAILURE: Should mark FAILED if sender has insufficient funds", async () => {
    const job = { data: { transactionId: "p2p_456" } };

    (mockDb.transactionRepository.findById as any).mockResolvedValue({
      id: "p2p_456",
      status: mockDb.TxStatus.PROCESSING,
      amount: BigInt(10000),
      fromUserId: "user_A",
      toUserId: "user_B",
    });

    mockDb.userBalanceRepository.executeTransfer.mockRejectedValue(
      new Error("INSUFFICIENT_FUNDS"),
    );
    await p2pProcessor(job, mockLog);

    expect(mockDb.transactionRepository.updateStatus).toHaveBeenCalledWith(
      "p2p_456",
      mockDb.TxStatus.FAILED,
      "mock_tx",
      "Insufficient funds",
    );

    expect(mockLog.warn).toHaveBeenCalledWith(
      expect.objectContaining({ transactionId: "p2p_456" }),
      "Transfer failed: Insufficient funds",
    );
  });

  it("🛡️ IDEMPOTENCY: Should skip if transaction is already processed", async () => {
    const job = { data: { transactionId: "tx_already_done" } };

    (mockDb.transactionRepository.findById as any).mockResolvedValue({
      id: "tx_done",
      status: mockDb.TxStatus.SUCCESS,
    });

    await p2pProcessor(job, mockLog);

    expect(mockDb.userBalanceRepository.executeTransfer).not.toHaveBeenCalled();
    
    expect(mockLog.warn).toHaveBeenCalledWith(
      { transactionId: "tx_already_done" },
      "P2P Job skipped: Not in PROCESSING state",
    );
  });
});
