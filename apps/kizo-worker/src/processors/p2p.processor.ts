import {
  getPrisma,
  transactionRepository,
  userBalanceRepository,
  TxStatus,
} from "@kizo/db";
import { Logger } from "@kizo/logger";
import { workerDuration } from "@kizo/metrics";

export const p2pProcessor = async (job: any, log: Logger) => {
  const { transactionId } = job.data;
  const prisma = getPrisma();

  const end = workerDuration.startTimer({ jobName: "Transfer-Money" });

  log.info({ transactionId }, "Starting Transfer flow");

  try {
    await prisma.$transaction(
      async (tx) => {
        // 1. Get the intent
        const transaction = await transactionRepository.findById(
          transactionId,
          tx,
        );

        // Idempotency check
        if (!transaction || transaction.status !== TxStatus.PROCESSING) {
          log.warn(
            { transactionId },
            "P2P Job skipped: Not in PROCESSING state",
          );
          return;
        }

        try {
          // 2. Atomic Balance Swap
          await userBalanceRepository.executeTransfer(
            transaction.fromUserId!,
            transaction.toUserId!,
            transaction.amount,
            tx,
          );

          // 3. Finalize
          await transactionRepository.updateStatus(
            transactionId,
            TxStatus.SUCCESS,
            tx,
          );

          log.info({ transactionId }, "Transfer finalized successfully");
        } catch (error: any) {
          // 💡 Business Logic Failure
          if (error.message === "INSUFFICIENT_FUNDS") {
            await transactionRepository.updateStatus(
              transactionId,
              TxStatus.FAILED,
              tx,
              "Insufficient funds",
            );
            log.warn({ transactionId }, "Transfer failed: Insufficient funds");
          } else {
            throw error;
          }
        }
      },
      { isolationLevel: "Serializable" }, // 🛡️ Protects against concurrent balance updates
    );
  } catch (err: any) {
    log.error(
      { transactionId, err: err.message },
      "P2P Processor system error",
    );
    throw err;
  } finally {
    end();
  }
};
