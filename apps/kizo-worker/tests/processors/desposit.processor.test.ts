import { describe, it, expect, vi, beforeEach } from "vitest";
import { depositProcessor } from "../../src/processors/deposit.processor";
import { mockDb } from "../setup";
import { triggerMockBankWebhook } from "../../src/lib/webhook";

vi.mock("../../src/lib/webhook", () => ({
  triggerMockBankWebhook: vi.fn(),
}));
const mockedWebhook = vi.mocked(triggerMockBankWebhook);

const mockLog = { info: vi.fn(), error: vi.fn(), child: vi.fn() } as any;

describe("Deposit Processor Logic", () => {
  beforeEach(() => vi.clearAllMocks());

  it("✅ SUCCESS: Should update balance and status when bank returns success", async () => {
    const job = { data: { transactionId: "tx_123" } };

    // Setup Mocks
    (mockDb.transactionRepository.findById as any).mockResolvedValue({
      id: "tx_123",
      status: mockDb.TxStatus.PROCESSING,
      amount: BigInt(5000),
      toUserId: "user_A",
    });
    mockedWebhook.mockResolvedValue({
      success: true,
      externalRef: "BANK_123",
    });

    await depositProcessor(job, mockLog);

    expect(mockDb.bankTransferRepository.markSuccess).toHaveBeenCalledWith(
      "tx_123",
      "BANK_123",
      "mock_tx",
    );
    expect(mockDb.userBalanceRepository.settleDeposit).toHaveBeenCalledWith(
      "user_A",
      BigInt(5000),
      "mock_tx",
    );
    expect(mockDb.transactionRepository.updateStatus).toHaveBeenCalledWith(
      "tx_123",
      mockDb.TxStatus.SUCCESS,
      "mock_tx",
    );
  });

  it("❌ FAILURE: Should mark transaction as FAILED if bank rejects", async () => {
    const job = { data: { transactionId: "tx_456" } };

    (mockDb.transactionRepository.findById as any).mockResolvedValue({
      id: "tx_456",
      status: mockDb.TxStatus.PROCESSING,
    });
    mockedWebhook.mockResolvedValue({
      success: false,
      message: "Fraud Check Failed",
    });

    await depositProcessor(job, mockLog);

    expect(mockDb.bankTransferRepository.markFailed).toHaveBeenCalled();
    expect(mockDb.transactionRepository.updateStatus).toHaveBeenCalledWith(
      "tx_456",
      mockDb.TxStatus.FAILED,
      "mock_tx",
      "Fraud Check Failed",
    );
    // CRITICAL: Ensure no balance was added
    expect(mockDb.userBalanceRepository.settleDeposit).not.toHaveBeenCalled();
  });

  it("🛡️ IDEMPOTENCY: Should skip if transaction is already processed", async () => {
    const job = { data: { transactionId: "tx_already_done" } };

    (mockDb.transactionRepository.findById as any).mockResolvedValue({
      id: "tx_done",
      status: mockDb.TxStatus.SUCCESS,
    });

    await depositProcessor(job, mockLog);

    expect(mockedWebhook).not.toHaveBeenCalled();
  });
});
