import { vi, beforeEach } from "vitest";

vi.mock("@prisma/client", () => ({
  TxType: {
    DEPOSIT: "DEPOSIT",
    WITHDRAWAL: "WITHDRAWAL",
    TRANSFER: "TRANSFER",
  },
}));

// Reset timers, mocks, env
beforeEach(() => {
  vi.clearAllMocks();
});

// Optional: silence noisy logs
vi.stubGlobal("console", {
  ...console,
  log: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
});
