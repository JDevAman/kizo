import {
  getPrisma,
  transactionRepository,
  userBalanceRepository,
  TxStatus,
} from "@kizo/db";

export const p2pProcessor = async (job: any) => {
  const { transactionId } = job.data;
  const prisma = getPrisma();

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
      } catch (error: any) {
        if (error.message === "INSUFFICIENT_FUNDS") {
          await transactionRepository.updateStatus(
            transactionId,
            TxStatus.FAILED,
            tx,
            "Insufficient funds",
          );
        } else {
          throw error; // Retries for DB/Network errors
        }
      }
    },
    { isolationLevel: "Serializable" },
  );
};
