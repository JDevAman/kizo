import {
  TxStatus,
  bankTransferRepository,
  getPrisma,
  transactionRepository,
  userBalanceRepository,
} from "@kizo/db";
import { triggerMockBankWebhook } from "../lib/webhook.js";
import { Logger } from "@kizo/logger";
import { workerDuration } from "@kizo/metrics";

export const depositProcessor = async (job: any, log: Logger) => {
  const { transactionId } = job.data;
  const prisma = getPrisma();

  const end = workerDuration.startTimer({ job_name: "Deposit-Money" });
  log.info({ transactionId }, "Starting deposit settlement flow");

  const transaction = await transactionRepository.findById(transactionId);
  if (!transaction || transaction.status !== TxStatus.PROCESSING) return;

  try {
    const bankResponse = await triggerMockBankWebhook(
      transaction.id,
      "DEPOSIT",
      log,
    );

    await prisma.$transaction(async (tx) => {
      if (bankResponse.success) {
        await bankTransferRepository.markSuccess(
          transactionId,
          bankResponse.externalRef,
          tx,
        );
      } else {
        await bankTransferRepository.markFailed(
          transactionId,
          bankResponse.externalRef,
          tx,
        );
      }

      const txRecord = await transactionRepository.findById(transactionId, tx);
      if (txRecord?.status !== TxStatus.PROCESSING) return;

      if (bankResponse.success) {
        await userBalanceRepository.settleDeposit(
          transaction.toUserId!,
          transaction.amount,
          tx,
        );
        await transactionRepository.updateStatus(
          transactionId,
          TxStatus.SUCCESS,
          tx,
        );
        log.info({ transactionId, status: "SUCCESS" }, "Deposit finalized");
      } else {
        await transactionRepository.updateStatus(
          transactionId,
          TxStatus.FAILED,
          tx,
          bankResponse.message || "Bank rejected deposit",
        );
      }
    });
  } catch (err) {
    throw err;
  } finally {
    end();
  }
};
