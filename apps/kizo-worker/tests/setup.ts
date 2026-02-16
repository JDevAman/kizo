import { vi } from "vitest";

// Static Prisma
const staticPrisma = {
  $transaction: vi.fn((cb) => cb("mock_tx")),
  transaction: {
    findMany: vi.fn(),
    update: vi.fn(),
  },
};

// Define shared mocks
export const mockDb = {
  transactionRepository: {
    findById: vi.fn(),
    updateStatus: vi.fn(),
    findProcessingTransactions: vi.fn(),
  },
  bankTransferRepository: {
    markSuccess: vi.fn(),
    markFailed: vi.fn(),
  },
  userBalanceRepository: {
    settleDeposit: vi.fn(),
    executeTransfer: vi.fn(),
    settleWithdrawal: vi.fn(),
    refundWithdrawal: vi.fn(),
  },
  getPrisma: vi.fn(() => staticPrisma),
  TxStatus: {
    PROCESSING: "PROCESSING",
    SUCCESS: "SUCCESS",
    FAILED: "FAILED",
  },
  TxType: { DEPOSIT: "DEPOSIT", TRANSFER: "TRANSFER", WITHDRAW: "WITHDRAW" },
};

vi.mock("@kizo/db", () => mockDb);
vi.mock("@kizo/queue", () => ({
  transactionQueue: {
    add: vi.fn(),
  },
}));
