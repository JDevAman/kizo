import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import PrismaPkg from "@prisma/client";

// Prisma
const { PrismaClient, TxStatus, TxType, BankTransferStatus } = PrismaPkg;
const { Pool } = pg;
let prisma: PrismaPkg.PrismaClient | null = null;

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

export function getPrisma() {
  if (!prisma) {
    throw new Error("Prisma not initialized. Call initPrisma() first.");
  }
  return prisma;
}

export { TxStatus, TxType, BankTransferStatus };
export { Prisma } from "@prisma/client";

export type TxStatus = PrismaPkg.TxStatus;
export type TxType = PrismaPkg.TxType;
export type BankTransferStatus = PrismaPkg.BankTransferStatus;
export type PrismaClientType = PrismaPkg.PrismaClient;
export type TransactionClient = Omit<
  PrismaPkg.PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;

export * from "./repositories/auth.repository.js";
export * from "./repositories/bankTransfer.repository.js";
export * from "./repositories/payment.repository.js";
export * from "./repositories/transaction.repository.js";
export * from "./repositories/user.repository.js";
