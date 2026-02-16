import { vi, it, describe, expect, beforeEach } from "vitest";
import { getDashboardData } from "../../../src/controllers/dashboard.controller";
import { dashboardService } from "../../../src/services/dashboard.service";

vi.mock("../../../src/services/dashboard.service", () => ({
  dashboardService: {
    getStats: vi.fn(),
  },
}));

describe("Dashboard Controller Unit Tests", () => {
  let req: any, res: any, next: any;

  beforeEach(() => {
    vi.clearAllMocks();

    req = {
      user: { id: "user-123" },
      body: {},
      log: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      cookie: vi.fn().mockReturnThis(),
      clearCookie: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  it("✅ getDashboardStats: reads stats", async () => {
    const mockResponse = {
      balance: "5000.00",
      locked: "150.00",
      stats: {
        totalSpent: "1200.00",
        totalReceived: "2000.00",
      },
      recentTransactions: [{ id: "tx-1", amount: "100.00", type: "DEPOSIT" }],
    };

    vi.mocked(dashboardService.getStats).mockResolvedValue(mockResponse as any);

    await getDashboardData(req, res, next);

    expect(dashboardService.getStats).toHaveBeenCalledWith(
      req.user.id,
      expect.anything(),
    );

    expect(res.json).toHaveBeenCalledWith(mockResponse);
    expect(next).not.toHaveBeenCalled();
  });
});
