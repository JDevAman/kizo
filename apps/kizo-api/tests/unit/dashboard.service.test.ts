import { describe, it, expect, vi, beforeEach } from "vitest";
import { dashboardService } from "../../src/services/dashboard.service";
import { transactionRepository } from "../../src/repositories/transaction.repository";
import { userBalanceRepository } from "../../src/repositories/payment.repository";

// ---- Mocks
vi.mock("../../src/repositories/transaction.repository", () => ({
  transactionRepository: {
    findAll: vi.fn(),
    getSumSent: vi.fn(),
    getSumReceived: vi.fn(),
    getMonthlyVolume: vi.fn(),
  },
}));

vi.mock("../../src/repositories/payment.repository", () => ({
  userBalanceRepository: {
    getAccount: vi.fn(),
  },
}));

describe("DashboardService.getStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return dashboard data when account exists", async () => {
    // Arrange
    (userBalanceRepository.getAccount as any).mockResolvedValue({
      balance: "10000",
    });

    (transactionRepository.getSumSent as any).mockResolvedValue({
      _sum: { amount: "3000" },
    });

    (transactionRepository.getSumReceived as any).mockResolvedValue({
      _sum: { amount: "5000" },
    });

    (transactionRepository.getMonthlyVolume as any).mockResolvedValue({
      _sum: { amount: "2000" },
    });

    (transactionRepository.findAll as any).mockResolvedValue({
      total: 5,
      transactions: [
        {
          id: "tx1",
          amount: "1000",
          type: "TRANSFER",
          createdAt: new Date(),
        },
      ],
    });

    // Act
    const result = await dashboardService.getStats("user-123");

    // Assert
    expect(result).toEqual({
      balance: "10000",
      stats: {
        sent: "3000",
        received: "5000",
        thisMonth: "2000",
        totalCount: "5",
      },
      recentTransactions: expect.any(Array),
    });

    expect(userBalanceRepository.getAccount).toHaveBeenCalledWith("user-123");
    expect(transactionRepository.findAll).toHaveBeenCalledWith("user-123", {
      take: 5,
    });
  });
});
