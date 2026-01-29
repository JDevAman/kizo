import { initPrisma } from "@kizo/db";
import { createTransactionWorker, transactionQueue } from "@kizo/queue";
import { p2pProcessor } from "./processors/p2p.processor.js";
import { createLogger } from "@kizo/logger";
import { depositProcessor } from "./processors/deposit.processor.js";
import { withdrawalProcessor } from "./processors/withdrawal.processor.js";
import { reconciliationProcessor } from "./processors/reconciliation.processor.js";

initPrisma(process.env.DATABASE_URL!);
const logger = createLogger("kizo-worker");

const scheduleReconciliation = async () => {
  try {
    await transactionQueue.add(
      "Reconciliation",
      {},
      {
        repeat: { pattern: "*/30 * * * *" }, // Runs every 30 minutes
        jobId: "system-reconciliation-janitor",
      },
    );
    logger.info("📅 Reconciliation job scheduled successfully");
  } catch (error) {
    logger.error(error, "Failed to schedule reconciliation job");
  }
};

scheduleReconciliation();

const worker = createTransactionWorker("TRANSACTION_QUEUE", async (job) => {
  logger.info(`Processing ${job.name} (ID: ${job.id})`);

  switch (job.name) {
    case "P2P-Transfer":
      return p2pProcessor(job);

    case "Deposit-Money":
      return depositProcessor(job);

    case "Withdraw-Money":
      return withdrawalProcessor(job);

    default:
      logger.warn(`❓ Unknown job type: ${job.name}`);
  }
});

worker.on("completed", (job) => {
  logger.info(
    { jobId: job.id, name: job.name },
    "✅ Job finished successfully",
  );
});

worker.on("failed", (job, err) => {
  logger.error(
    {
      jobId: job?.id,
      name: job?.name,
      err: err.message,
      stack: err.stack,
    },
    "❌ Job failed",
  );
});
