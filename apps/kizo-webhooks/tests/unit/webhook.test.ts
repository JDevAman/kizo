import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@kizo/db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@kizo/db")>();

  const prismaMock = {
    bankTransfer: {
      updateMany: vi.fn(),
      create: vi.fn(),
    },
    transaction: {
      update: vi.fn(),
      findUnique: vi.fn(),
    },
    userBalance: {
      update: vi.fn(),
    },
    $transaction: vi.fn(async (cb) => cb(prismaMock)),
  };

  return {
    ...actual,
    initPrisma: vi.fn(),
    getPrisma: () => prismaMock,
  };
});

import { createApp } from "../../src/app";
import { prisma } from "../../src/lib/db";

const app = createApp();

/* ---------------- DEPOSIT ---------------- */

describe("UNIT /webhooks/deposit", () => {
  beforeEach(() => vi.clearAllMocks());

  it("credits balance and marks transaction SUCCESS", async () => {
    prisma.transaction.findUnique.mockResolvedValue({
      id: "tx-1",
      amount: BigInt(1000),
      status: "PROCESSING",
      toUserId: "user-1",
    } as any);

    const res = await request(app).post("/webhooks/deposit").send({
      transactionId: "tx-1",
      externalRef: "bank-ref",
      status: "SUCCESS",
    });

    expect(res.status).toBe(200);

    expect(prisma.userBalance.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user-1" },
        data: expect.objectContaining({
          balance: { increment: BigInt(1000) },
        }),
      })
    );

    expect(prisma.transaction.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "tx-1" },
        data: expect.objectContaining({
          status: "SUCCESS",
        }),
      })
    );
  });

  it("is idempotent when transaction already processed", async () => {
    prisma.transaction.findUnique.mockResolvedValue({
      id: "tx-1",
      status: "SUCCESS",
    } as any);

    const res = await request(app).post("/webhooks/deposit").send({
      transactionId: "tx-1",
      status: "SUCCESS",
    });

    expect(res.status).toBe(200);
    expect(prisma.userBalance.update).not.toHaveBeenCalled();
    expect(prisma.bankTransfer.updateMany).not.toHaveBeenCalled();
  });
});

/* ---------------- WITHDRAW ---------------- */

describe("UNIT /webhooks/withdraw", () => {
  beforeEach(() => vi.clearAllMocks());

  it("unlocks funds on SUCCESS", async () => {
    prisma.transaction.findUnique.mockResolvedValue({
      id: "tx-2",
      amount: BigInt(500),
      status: "PROCESSING",
      fromUserId: "user-2",
    } as any);

    const res = await request(app).post("/webhooks/withdraw").send({
      transactionId: "tx-2",
      status: "SUCCESS",
    });

    expect(res.status).toBe(200);

    expect(prisma.userBalance.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user-2" },
        data: expect.objectContaining({
          locked: { decrement: BigInt(500) },
          balance: { decrement: BigInt(500) },
        }),
      })
    );
  });

  it("refunds on FAILED withdrawal", async () => {
    prisma.transaction.findUnique.mockResolvedValue({
      id: "tx-3",
      amount: BigInt(300),
      status: "PROCESSING",
      fromUserId: "user-3",
    } as any);

    const res = await request(app).post("/webhooks/withdraw").send({
      transactionId: "tx-3",
      status: "FAILED",
    });

    expect(res.status).toBe(200);

    expect(prisma.userBalance.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user-3" },
        data: expect.objectContaining({
          balance: { increment: BigInt(300) },
          locked: { decrement: BigInt(300) },
        }),
      })
    );
  });
});
