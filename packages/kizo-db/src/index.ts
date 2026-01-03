import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// ✅ Runtime-safe import (CJS → ESM)
import PrismaPkg from "@prisma/client";

// ✅ Type-only imports (erased at runtime)
import type { Prisma, PrismaClient as PrismaClientType } from "@prisma/client";

const { Pool } = pg;
const { PrismaClient, TxStatus, TxType, BankTransferStatus } = PrismaPkg;

let prisma: PrismaClientType | null = null;

export function initPrisma(databaseUrl: string) {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to initialize Prisma");
  }

  if (prisma) return;

  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);

  prisma = new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  }) as PrismaClientType;
}

export function getPrisma(): PrismaClientType {
  if (!prisma) {
    throw new Error("Prisma not initialized. Call initPrisma() first.");
  }
  return prisma;
}

// ✅ re-export enums (runtime values)
export { TxStatus, TxType, BankTransferStatus };

// ✅ re-export Prisma namespace (types only)
export type { Prisma };
