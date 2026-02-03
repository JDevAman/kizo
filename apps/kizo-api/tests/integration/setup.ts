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
vi.mock("@kizo/db", () => ({
  userRepository: {
    findByEmail: vi.fn(),
  },
  authRepository: {
    createUserWithBalance: vi.fn(),
    createRefreshToken: vi.fn(),
    rotateRefreshToken: vi.fn(),
    revokeRefreshTokenById: vi.fn(),
    revokeAllRefreshTokensForUser: vi.fn(),
    findRefreshTokenByRaw: vi.fn(),
  },
  initPrisma: vi.fn(),
  getPrisma: vi.fn(),
}));

// Mock Metrics/Logger globally if they are in every service
vi.mock("@kizo/logger", () => ({
  createLogger: vi.fn(() => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    child: vi.fn().mockReturnThis(),
  })),
}));

vi.mock("@kizo/metrics", () => ({
  workerDuration: { startTimer: vi.fn(() => vi.fn()) },
}));

/* ---------------- GLOBAL RESET ---------------- */
beforeEach(() => {
  vi.clearAllMocks();
});
