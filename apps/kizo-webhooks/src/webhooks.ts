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

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      // 2️⃣ Idempotency guard
      if (transaction.status !== "PROCESSING") {
        return;
      }

      // 3️⃣ Record bank response
      await tx.bankTransfer.create({
        data: {
          transactionId: transaction.id,
          externalRef,
          amount: transaction.amount,
          status: status === "SUCCESS" ? "SUCCESS" : "FAILED",
        },
      });

      // 4️⃣ Handle failure
      if (status === "FAILED") {
        await tx.transaction.update({
          where: { id: transaction.id },
          data: { status: "FAILED" },
        });
        return;
      }

      // 5️⃣ Credit user balance
      await tx.userBalance.update({
        where: { userId: transaction.toUserId! },
        data: {
          balance: {
            increment: transaction.amount,
          },
        },
      });

      // 6️⃣ Mark transaction success
      await tx.transaction.update({
        where: { id: transaction.id },
        data: { status: "SUCCESS" },
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

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      if (transaction.status !== "PROCESSING") {
        return;
      }

      await tx.bankTransfer.create({
        data: {
          transactionId: transaction.id,
          externalRef,
          amount: transaction.amount,
          status: status === "SUCCESS" ? "SUCCESS" : "FAILED",
        },
      });

      if (status === "FAILED") {
        // refund locked funds
        await tx.userBalance.update({
          where: { userId: transaction.fromUserId! },
          data: {
            balance: { increment: transaction.amount },
            locked: { decrement: transaction.amount },
          },
        });

        await tx.transaction.update({
          where: { id: transaction.id },
          data: { status: "FAILED" },
        });
        return;
      }

      // SUCCESS → just unlock
      await tx.userBalance.update({
        where: { userId: transaction.fromUserId! },
        data: {
          locked: { decrement: transaction.amount },
        },
      });

      await tx.transaction.update({
        where: { id: transaction.id },
        data: { status: "SUCCESS" },
      });
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Withdraw webhook error:", err);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
});

export default webHooksRouter;
