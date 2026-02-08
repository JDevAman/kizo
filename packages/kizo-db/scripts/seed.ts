import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { createLogger } from "@kizo/logger";

const logger = createLogger("db-seeder");
async function main() {
  console.log("🌱 Seeding Dev DB...");

  const employer = await prisma.user.upsert({
    where: { email: "admin@kizo.dev" },
    update: {},
    create: {
      email: "admin@kizo.dev",
      firstName: "Main",
      lastName: "Employer",
      UserBalance: {
        create: {
          balance: BigInt(1000000),
        },
      },
    },
  });

  logger.info(`✅ Seeded: ${employer.email}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
