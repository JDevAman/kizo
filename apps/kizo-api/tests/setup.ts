import { vi, beforeEach } from "vitest";

/* ---------------- PRISMA ---------------- */
vi.mock("@kizo/db", () => {
  const prismaMock = {
    account: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    userBalance: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    transaction: {
      findFirst: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
      findMany: vi.fn(),
    },
    $transaction: vi.fn(async (cb) => cb(prismaMock)),
  };

  return {
    getPrisma: () => prismaMock,
  };
});

/* ---------------- PRISMA ENUM ---------------- */
vi.mock("@prisma/client", () => ({
  TxType: {
    DEPOSIT: "DEPOSIT",
    WITHDRAWAL: "WITHDRAWAL",
    TRANSFER: "TRANSFER",
  },
}));

/* ---------------- GLOBAL RESET ---------------- */
beforeEach(() => {
  vi.clearAllMocks();
});

/* ---------------- SILENCE LOGS ---------------- */
vi.stubGlobal("console", {
  ...console,
  log: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
});
