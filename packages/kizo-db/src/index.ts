import pg from "pg";
import { createClient, type RedisClientType } from "redis";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma

import PrismaPkg from "@prisma/client";
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

// Redis
export type KizoRedisClient = RedisClientType<
  Record<string, never>,
  Record<string, never>
>;

let redisClient: KizoRedisClient | null = null;

export function getRedis(): KizoRedisClient {
  if (!redisClient) {
    redisClient = createClient({
      // url: process.env.REDIS_URL
    }) as KizoRedisClient;
  }
  return redisClient;
}

export { TxStatus, TxType, BankTransferStatus };
export type { Prisma };
