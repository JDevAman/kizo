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
process.env.ACCESS_TOKEN_PATH = "mock/path/to/private.key";
process.env.REFRESH_TOKEN_PATH = "mock/path/to/refresh.key";

// Prisma
const staticPrisma = {
  $transaction: vi.fn((cb) => cb(staticPrisma)),
  $queryRaw: vi.fn().mockResolvedValue([{ balance: 1000n, locked: 0n }]),
  userBalance: { update: vi.fn() },
};

vi.mock("@kizo/db", () => ({
  // Enums
  TxType: {
    DEPOSIT: "DEPOSIT",
    WITHDRAWAL: "WITHDRAWAL",
    TRANSFER: "TRANSFER",
  },
  authRepository: {
    createUserWithBalance: vi.fn(),
    createRefreshToken: vi.fn(),
    rotateRefreshToken: vi.fn(),
    revokeRefreshTokenById: vi.fn(),
    revokeAllRefreshTokensForUser: vi.fn(),
    findRefreshTokenByRaw: vi.fn(),
  },
  bankTransferRepository: { create: vi.fn().mockResolvedValue({}) },
  transactionRepository: {
    createDeposit: vi.fn(),
    createWithdraw: vi.fn(),
    createTransfer: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    findByIdempotencyKey: vi.fn(),
    getDashboardStats: vi.fn(),
    listTransaction: vi.fn(),
  },
  userRepository: {
    findByEmail: vi.fn(),
    findById: vi.fn(),
    updateUser: vi.fn(),
  },
  userBalanceRepository: {
    getAccount: vi.fn(),
    executeTransfer: vi.fn(),
  },
  initPrisma: vi.fn(),
  getPrisma: vi.fn(() => staticPrisma),
}));

// Mock Bullmq
vi.mock("bullmq", () => ({
  Queue: vi.fn().mockImplementation(() => ({
    add: vi.fn(),
    on: vi.fn(),
  })),
  Worker: vi.fn().mockImplementation(() => ({
    on: vi.fn(),
  })),
}));

// Mock Async Worker
vi.mock("@kizo/queue", () => ({
  transactionQueue: {
    add: vi.fn().mockResolvedValue({ id: "mock-job-id" }),
  },
  getRedis: vi.fn(() => ({
    del: vi.fn().mockResolvedValue("OK"),
    get: vi.fn(),
    set: vi.fn(),
  })),
}));

// Mock Logs
vi.mock("@kizo/logger", () => ({
  createLogger: vi.fn(() => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    bindings: vi.fn().mockReturnValue({ traceId: "test-trace" }),
    child: vi.fn().mockReturnThis(),
  })),
}));

// Mock metrics
vi.mock("@kizo/metrics", () => ({
  workerDuration: { startTimer: vi.fn(() => vi.fn()) },
}));

/* ---------------- GLOBAL RESET ---------------- */
beforeEach(() => {
  vi.clearAllMocks();
});

export { staticPrisma };
