import { vi } from "vitest";

export const prisma = {
  $transaction: vi.fn(),

  transaction: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },

  userBalance: {
    update: vi.fn(),
  },

  bankTransfer: {
    create: vi.fn(),
  },
};
