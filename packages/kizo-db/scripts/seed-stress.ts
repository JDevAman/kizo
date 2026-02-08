import { initPrisma, getPrisma } from "../src/index";
import argon2 from "argon2";
import { createLogger } from "@kizo/logger";

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error("DATABASE_URL environment variable is missing");
}

initPrisma(dbUrl); 
const prisma = getPrisma(); 
const logger = createLogger("db-seeder");

async function seedStress() {
  logger.info("🏗️ Starting functional stress seed...");

  try {
    const passwordHash = await argon2.hash("password123");

    // 1. Create Employer
    const employer = await prisma.user.upsert({
      where: { email: "corporate@kizo.dev" },
      update: {},
      create: {
        email: "corporate@kizo.dev",
        firstName: "Kizo",
        lastName: "Corp",
        password: passwordHash,
        UserBalance: { create: { balance: BigInt(10000000) } },
      },
    });
    logger.info({ employerId: employer.id }, "✅ Employer created/verified");

    // 2. Prepare Employee Data
    const count = 5000;
    const employeeData = Array.from({ length: count }).map((_, i) => ({
      email: `user-${i}@kizo.dev`,
      firstName: `User`,
      lastName: `${i}`,
      password: passwordHash,
    }));

    const { count: createdCount } = await prisma.user.createMany({
      data: employeeData,
      skipDuplicates: true,
    });
    logger.info({ createdCount }, "✅ Employees batch created");

    // 3. Balance Initialization
    const userIds = await prisma.user.findMany({
      where: { email: { startsWith: "user-" } },
      select: { id: true },
    });

    await prisma.userBalance.createMany({
      data: userIds.map((u) => ({ userId: u.id, balance: BigInt(5000) })),
      skipDuplicates: true,
    });
    logger.info("✅ All balances initialized");
  } catch (error) {
    logger.error({ err: error }, "❌ Seeding failed");
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    logger.info("🏁 Prisma disconnected. Seed process complete.");
  }
}

seedStress();
