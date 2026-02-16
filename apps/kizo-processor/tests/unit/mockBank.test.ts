/// <reference path="../../src/types/express.d.ts" />
import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import mockBankRouter from "../../src/routes/mockBank";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.log = {
    child: vi.fn().mockReturnThis(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  } as any;
  req.traceId = "test-trace";
  next();
});
app.use("/bank", mockBankRouter);

describe("UNIT /bank (Mock Bank Processor)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Math, "random").mockRestore();
    vi.useRealTimers();
  });

  it("✅ DEPOSIT: returns SUCCESS when chaos is low", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);

    const res = await request(app)
      .post("/bank/deposit")
      .send({ transactionId: "tx-dep-1" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("SUCCESS");
    expect(res.body.externalRef).toContain("MOCK-DEP-");
  });

  it("❌ DEPOSIT: returns 500 when crash chaos triggers", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.01);

    const res = await request(app)
      .post("/bank/deposit")
      .send({ transactionId: "tx-dep-crash" });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Service Unavailable");
  }, 10000);

  it("✅ WITHDRAW: returns SUCCESS when chaos is low", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);

    const res = await request(app)
      .post("/bank/withdraw")
      .send({ transactionId: "tx-wit-1" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("SUCCESS");
  });

  it("⚠️ WITHDRAW: handles bank-side FAILED status", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.09);
    const res = await request(app)
      .post("/bank/withdraw")
      .send({ transactionId: "tx-wit-fail" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("FAILED");
  });

  it("⏱️ WITHDRAW: simulates latency", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.04);

    const res = await request(app)
      .post("/bank/withdraw")
      .send({ transactionId: "tx-slow" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("FAILED");
  }, 10000);
});
