import { Router } from "express";
import { prisma } from "./lib/db";

const webHooksRouter = Router();

webHooksRouter.post("/deposit", async (req, res) => {
  const { transactionId, externalRef, status } = req.body;

  if (!transactionId || !status) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1️⃣ Fetch transaction
      const transaction = await tx.transaction.findUnique({
        where: { id: transactionId },
      });

      if (!transaction) throw new Error("Transaction not found");

      // 2️⃣ Idempotency guard
      if (transaction.status !== "PROCESSING") {
        console.log(
          `[WEBHOOK] tx=${transaction.id}, status=${transaction.status}`
        );
        return;
      }
      // 3️⃣ Update bank transfer (NOT create)
      await tx.bankTransfer.updateMany({
        where: {
          transactionId,
          status: "PROCESSING",
        },
        data: {
          status: status === "SUCCESS" ? "SUCCESS" : "FAILED",
          externalRef,
        },
      });

      // 4️⃣ Handle failure
      if (status === "FAILED") {
        await tx.transaction.update({
          where: { id: transactionId },
          data: {
            status: "FAILED",
            processedAt: new Date(),
          },
        });
        return;
      }

      // 5️⃣ Credit balance
      await tx.userBalance.update({
        where: { userId: transaction.toUserId! },
        data: {
          balance: { increment: transaction.amount },
        },
      });

      // 6️⃣ Mark transaction success
      await tx.transaction.update({
        where: { id: transactionId },
        data: {
          status: "SUCCESS",
          processedAt: new Date(),
        },
      });
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Deposit webhook error:", err);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
});

webHooksRouter.post("/withdraw", async (req, res) => {
  const { transactionId, externalRef, status } = req.body;

  if (!transactionId || !status) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findUnique({
        where: { id: transactionId },
      });

      if (!transaction) throw new Error("Transaction not found");

      // Idempotency guard
      if (transaction.status !== "PROCESSING") {
        console.log(
          `[WEBHOOK] tx=${transaction.id}, status=${transaction.status}`
        );
        return;
      }

      // Update bank transfer
      await tx.bankTransfer.updateMany({
        where: {
          transactionId,
          status: "PROCESSING",
        },
        data: {
          status: status === "SUCCESS" ? "SUCCESS" : "FAILED",
          externalRef,
        },
      });

      // FAILED → refund + unlock
      if (status === "FAILED") {
        await tx.userBalance.update({
          where: { userId: transaction.fromUserId! },
          data: {
            balance: { increment: transaction.amount },
            locked: { decrement: transaction.amount },
          },
        });

        await tx.transaction.update({
          where: { id: transactionId },
          data: {
            status: "FAILED",
            processedAt: new Date(),
          },
        });
        return;
      }

      // SUCCESS → unlock only
      await tx.userBalance.update({
        where: { userId: transaction.fromUserId! },
        data: {
          balance: { decrement: transaction.amount },
          locked: { decrement: transaction.amount },
        },
      });

      await tx.transaction.update({
        where: { id: transactionId },
        data: {
          status: "SUCCESS",
          processedAt: new Date(),
        },
      });
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Withdraw webhook error:", err);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
});

export default webHooksRouter;
