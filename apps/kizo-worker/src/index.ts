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
  const { traceId } = job.data._metadata || {};
  const jobLog = logger.child({
    traceId,
    jobId: job.id,
    jobName: job.name,
  });

  jobLog.info(`🚀 Starting job: ${job.name}`);
  try {
    switch (job.name) {
      case "P2P-Transfer":
        return p2pProcessor(job, jobLog);

      case "Deposit-Money":
        return depositProcessor(job, jobLog);

      case "Withdraw-Money":
        return withdrawalProcessor(job, jobLog);

      default:
        logger.warn(`❓ Unknown job type: ${job.name}`);
    }
  } catch (error) {
    jobLog.error({ err: error }, "Job execution crashed");
    throw error;
  }
});

worker.on("completed", (job) => {
  const traceId = job.data._metadata?.traceId;
  logger.info(
    { jobId: job.id, name: job.name, traceId },
    "✅ Job finished successfully",
  );
});

worker.on("failed", (job, err) => {
  const traceId = job?.data._metadata?.traceId;
  logger.error(
    {
      jobId: job?.id,
      name: job?.name,
      traceId,
      err: err.message,
    },
    "❌ Job failed",
  );
});
