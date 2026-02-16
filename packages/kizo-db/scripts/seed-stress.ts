import { initPrisma, getPrisma } from "../src/index";
import argon2 from "argon2";
import { createLogger } from "@kizo/logger"; // Assuming this is your logger path

const logger = createLogger("db-seeder");

async function seedStress() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL is missing");

  initPrisma(dbUrl);
  const prisma = getPrisma();
  logger.info("🏗️ Starting functional stress seed...");

  try {
    // 🔥 Optimization: Don't re-hash 5000 times. Hash ONCE.
    const PEPPER = process.env.PEPPER || "cosmicbyte";
    const passwordHash = await argon2.hash("password123" + PEPPER);

    await prisma.$transaction(async (tx) => {
      // 1. Create Employer
      const employer = await tx.user.upsert({
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

      // 2. Prepare & Create Employees
      const employeeData = Array.from({ length: 5000 }).map((_, i) => ({
        email: `user-${i}@kizo.dev`,
        firstName: `User`,
        lastName: `${i}`,
        password: passwordHash,
      }));

      await tx.user.createMany({
        data: employeeData,
        skipDuplicates: true,
      });

      // 3. Batch Balance Initialization
      // We pull IDs once and use createMany for the balances
      const userIds = await tx.user.findMany({
        where: { email: { startsWith: "user-" } },
        select: { id: true },
      });

      await tx.userBalance.createMany({
        data: userIds.map((u) => ({
          userId: u.id,
          balance: BigInt(5000), // Ensure this matches your DB decimal/bigint type
        })),
        skipDuplicates: true,
      });
    });

    logger.info("✅ Database seeded and ACID compliant transaction complete.");
  } catch (error) {
    logger.error({ err: error }, "❌ Seeding failed");
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedStress();
