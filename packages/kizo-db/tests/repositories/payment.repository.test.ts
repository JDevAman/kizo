import { describe, it, expect, vi, beforeEach } from "vitest";
import { userBalanceRepository } from "../../src/repositories/payment.repository";

// Mock the Prisma Client
const mockTx = {
  $queryRaw: vi.fn(),
  userBalance: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
} as unknown as any;

describe("UserBalanceRepository - executeTransfer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("✅ should successfully transfer money between users", async () => {
    const fromUserId = "user_A";
    const toUserId = "user_B";
    const amount = BigInt(500);

    // Mock finding the sender with enough balance
    mockTx.userBalance.findUnique.mockResolvedValue({
      userId: fromUserId,
      balance: BigInt(1000),
    });

    await userBalanceRepository.executeTransfer(
      fromUserId,
      toUserId,
      amount,
      mockTx,
    );

    // Verify Row Locking happened
    expect(mockTx.$queryRaw).toHaveBeenCalled();

    // Verify Balance Updates
    expect(mockTx.userBalance.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: fromUserId },
        data: { balance: { decrement: amount } },
      }),
    );

    expect(mockTx.userBalance.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: toUserId },
        data: { balance: { increment: amount } },
      }),
    );
  });

  it("❌ should throw INSUFFICIENT_FUNDS if sender has low balance", async () => {
    const amount = BigInt(5000);

    mockTx.userBalance.findUnique.mockResolvedValue({
      userId: "user_A",
      balance: BigInt(100), // Only 100, but trying to send 5000
    });

    await expect(
      userBalanceRepository.executeTransfer("user_A", "user_B", amount, mockTx),
    ).rejects.toThrow("INSUFFICIENT_FUNDS");

    // Verify update was NEVER called
    expect(mockTx.userBalance.update).not.toHaveBeenCalled();
  });

  it("🛡️ should sort userIds to prevent deadlocks", async () => {
    const userA = "zzz_user";
    const userB = "aaa_user";

    mockTx.userBalance.findUnique.mockResolvedValue({ balance: BigInt(1000) });

    await userBalanceRepository.executeTransfer(
      userA,
      userB,
      BigInt(100),
      mockTx,
    );

    const callArgs = mockTx.$queryRaw.mock.calls[0];
    const flatArgs = callArgs.flat();

    const firstArgIndex = flatArgs.indexOf("aaa_user");
    const secondArgIndex = flatArgs.indexOf("zzz_user");
    expect(firstArgIndex).toBeLessThan(secondArgIndex);
  });
});

describe("UserBalanceRepository - Lifecycle Methods", () => {
  beforeEach(() => vi.clearAllMocks());

  it("✅ settleWithdrawal should decrement both balance AND locked", async () => {
    const amount = BigInt(1000);
    const userId = "user_123";

    await userBalanceRepository.settleWithdrawal(userId, amount, mockTx);

    expect(mockTx.userBalance.update).toHaveBeenCalledWith({
      where: { userId },
      data: {
        balance: { decrement: amount },
        locked: { decrement: amount },
      },
    });
  });

  it("🛡️ refundWithdrawal should ONLY decrement locked (Restoring balance access)", async () => {
    const amount = BigInt(500);
    const userId = "user_456";

    await userBalanceRepository.refundWithdrawal(userId, amount, mockTx);

    // This is a key test: proving you aren't touching 'balance',
    // just releasing the 'lock' on the funds.
    expect(mockTx.userBalance.update).toHaveBeenCalledWith({
      where: { userId },
      data: {
        locked: { decrement: amount },
      },
    });
  });
});
