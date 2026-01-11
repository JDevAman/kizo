import { vi, beforeEach } from "vitest";

/* -------- MOCK ENVS --------------- */
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_123";
process.env.PEPPER = process.env.PEPPER || "test_pepper_456";
process.env.FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
process.env.ACCESS_EXPIRES = process.env.ACCESS_EXPIRES || "1h";
process.env.DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://mock@localhost:5432/db";
process.env.SUPABASE_URL =
  process.env.SUPABASE_URL || "https://mock.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "mock_key";

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
