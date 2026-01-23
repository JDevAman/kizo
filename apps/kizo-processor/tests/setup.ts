import { vi, beforeEach } from "vitest";

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
