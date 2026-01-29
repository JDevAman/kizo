import { getPrisma, TxStatus, TxType, transactionRepository } from "@kizo/db";
import { transactionQueue } from "@kizo/queue";

export const reconciliationProcessor = async () => {
  const prisma = getPrisma();
  const RETRY_LIMIT = 3;
  const STUCK_THRESHOLD = new Date(Date.now() - 15 * 60 * 1000);

  // 1. Find "Zombies" (Stuck in PROCESSING)
  const stuckTxs = await prisma.transaction.findMany({
    where: {
      status: TxStatus.PROCESSING,
      createdAt: { lt: STUCK_THRESHOLD },
      reconciliationAttempts: { lt: RETRY_LIMIT }
    },
    include: { bankTransfer: true }
  });

  for (const tx of stuckTxs) {
    // 2. DATA VALIDATION GUARD
    if (tx.type === TxType.DEPOSIT && !tx.toUserId) {
      await finalizeFailure(tx.id, "DATA_ERROR: Missing toUserId for Deposit");
      continue;
    }

    // 3. INTELLIGENT RE-QUEUEING
    await prisma.transaction.update({
      where: { id: tx.id },
      data: { 
        reconciliationAttempts: { increment: 1 },
        lastReconciledAt: new Date()
      }
    });

    // Push back to the queue. BullMQ { jobId } prevents duplicates if already active.
    const jobName = getJobName(tx.type);
    await transactionQueue.add(jobName, { transactionId: tx.id }, { jobId: tx.id });
  }
};

async function finalizeFailure(txId: string, reason: string) {
  const prisma = getPrisma();
  await transactionRepository.updateStatus(txId, TxStatus.FAILED, prisma, reason);
  console.log(`❌ Reconciliation: Force-failed transaction ${txId} due to ${reason}`);
}

function getJobName(type: TxType) {
  if (type === TxType.TRANSFER) return "P2P-Transfer";
  if (type === TxType.DEPOSIT) return "Deposit-Money";
  return "Withdraw-Money";
}