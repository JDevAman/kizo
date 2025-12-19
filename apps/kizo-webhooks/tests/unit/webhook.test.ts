import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/lib/db", async () => {
    const { prisma } = await import("../../tests/__mocks__/db");
    return { prisma };
});

import { createApp } from "../../src/app";
import { prisma } from "../../src/lib/db";
const app = createApp();

describe("UNIT /webhooks/deposit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("credits balance and marks transaction SUCCESS", async () => {
    const txMock = {
      id: "tx-1",
      amount: BigInt(1000),
      status: "PROCESSING",
      toUserId: "user-1",
    };

    prisma.$transaction.mockImplementation(async (cb) => {
      await cb(prisma as any);
    });

    prisma.transaction.findUnique.mockResolvedValue(txMock as any);
    prisma.bankTransfer.create.mockResolvedValue({} as any);
    prisma.userBalance.update.mockResolvedValue({} as any);
    prisma.transaction.update.mockResolvedValue({} as any);

    const res = await request(app).post("/webhooks/deposit").send({
      transactionId: "tx-1",
      externalRef: "bank-ref",
      status: "SUCCESS",
    });

    expect(res.status).toBe(200);

    expect(prisma.userBalance.update).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      data: { balance: { increment: BigInt(1000) } },
    });

    expect(prisma.transaction.update).toHaveBeenCalledWith({
      where: { id: "tx-1" },
      data: { status: "SUCCESS" },
    });
  });

  it("is idempotent when transaction already processed", async () => {
    prisma.$transaction.mockImplementation(async (cb) => {
      await cb(prisma as any);
    });

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
    expect(prisma.bankTransfer.create).not.toHaveBeenCalled();
  });
});

describe("UNIT /webhooks/withdraw", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("unlocks funds on SUCCESS", async () => {
    prisma.$transaction.mockImplementation(async (cb) => {
      return cb(prisma as any);
    });

    prisma.transaction.findUnique.mockResolvedValue({
      id: "tx-2",
      amount: BigInt(500),
      status: "PROCESSING",
      fromUserId: "user-2",
    } as any);

    prisma.bankTransfer.create.mockResolvedValue({} as any);
    prisma.userBalance.update.mockResolvedValue({} as any);
    prisma.transaction.update.mockResolvedValue({} as any);

    const res = await request(app).post("/webhooks/withdraw").send({
      transactionId: "tx-2",
      status: "SUCCESS",
    });

    expect(res.status).toBe(200);

    expect(prisma.userBalance.update).toHaveBeenCalledWith({
      where: { userId: "user-2" },
      data: { locked: { decrement: BigInt(500) } },
    });
  });

  it("refunds on FAILED withdrawal", async () => {
    prisma.$transaction.mockImplementation(async (cb) => {
      await cb(prisma as any);
    });

    prisma.transaction.findUnique.mockResolvedValue({
      id: "tx-3",
      amount: BigInt(300),
      status: "PROCESSING",
      fromUserId: "user-3",
    } as any);

    prisma.bankTransfer.create.mockResolvedValue({} as any);
    prisma.userBalance.update.mockResolvedValue({} as any);
    prisma.transaction.update.mockResolvedValue({} as any);

    const res = await request(app).post("/webhooks/withdraw").send({
      transactionId: "tx-3",
      status: "FAILED",
    });

    expect(res.status).toBe(200);

    expect(prisma.userBalance.update).toHaveBeenCalledWith({
      where: { userId: "user-3" },
      data: {
        balance: { increment: BigInt(300) },
        locked: { decrement: BigInt(300) },
      },
    });
  });
});
