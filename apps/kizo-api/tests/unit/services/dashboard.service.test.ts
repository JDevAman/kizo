import { describe, it, expect, vi, beforeEach } from "vitest";
import { dashboardService } from "../../../src/services/dashboard.service";
import { transactionRepository } from "@kizo/db";

const mockLog = { info: vi.fn(), warn: vi.fn(), error: vi.fn() } as any;

describe("DashboardService.getStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return dashboard data when account exists", async () => {
    const mockStats = {
      balance: 10000n, // Using BigInt to mimic Prisma
      sumSent: 3000n,
      sumReceived: 5000n,
      monthlyVolume: 2000n,
    };

    const mockTxData = {
      total: 5,
      transactions: [
        {
          id: "tx1",
          amount: 1000n,
          type: "TRANSFER",
          fromUserId: "user-123",
          toUserId: "user-abc",
          createdAt: new Date(),
        },
      ],
    };

    vi.mocked(transactionRepository.getDashboardStats).mockResolvedValue(
      mockStats as any,
    );
    vi.mocked(transactionRepository.findAll).mockResolvedValue(
      mockTxData as any,
    );

    // Act
    const result = await dashboardService.getStats("user-123", mockLog);

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

    expect(transactionRepository.getDashboardStats).toHaveBeenCalledWith(
      "user-123",
    );
  });

  it("❌ FAILURE: should throw error if stats are null", async () => {
    vi.mocked(transactionRepository.getDashboardStats).mockResolvedValue(
      null as any,
    );
    vi.mocked(transactionRepository.findAll).mockResolvedValue({
      total: 0,
      transactions: [],
    } as any);

    await expect(
      dashboardService.getStats("user-123", mockLog),
    ).rejects.toThrow("Could not retrieve dashboard data");

    expect(mockLog.warn).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "user-123" }),
      expect.stringContaining("returned null unexpectedly"),
    );
  });
});
