import {
  getPrisma,
  transactionRepository,
  userBalanceRepository,
  TxStatus,
} from "@kizo/db";
import { Logger } from "@kizo/logger";

export const p2pProcessor = async (job: any, log: Logger) => {
  const { transactionId } = job.data;
  const prisma = getPrisma();

  log.info({ transactionId }, "Starting Transfer flow");
  await prisma.$transaction(
    async (tx) => {
      // 1. Get the intent
      const transaction = await transactionRepository.findById(
        transactionId,
        tx,
      );
      if (!transaction || transaction.status !== TxStatus.PROCESSING) return;

      try {
        // 2. Use the "Muscle" method
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

        log.info({ transactionId, status: "SUCCESS" }, "Transfer finalized");
      } catch (error: any) {
        const currentTx = await transactionRepository.findById(
          transactionId,
          tx,
        );
        if (currentTx?.status === TxStatus.SUCCESS) return;
        if (error.message === "INSUFFICIENT_FUNDS") {
          await transactionRepository.updateStatus(
            transactionId,
            TxStatus.FAILED,
            tx,
            "Insufficient funds",
          );
          log.warn({ transactionId }, "Transfer failed: Insufficient funds");
        } else {
          throw error; // Retries for DB/Network errors
        }
      }
    },
    { isolationLevel: "Serializable" },
  );
};
