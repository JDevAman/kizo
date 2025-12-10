import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Read the URL from the environment (provided by the App, not this package)
const connectionString = process.env.DATABASE_URL;

// 1. Configure the Pool
const pool = new Pool({ 
  connectionString,
  // Uncomment SSL if needed for Supabase Transaction mode in Prod
  // ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined
});

// 2. Create Adapter
const adapter = new PrismaPg(pool);

// 3. Instantiate Client
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export * from "@prisma/client";