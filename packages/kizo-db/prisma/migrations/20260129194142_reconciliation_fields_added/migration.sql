/*
  Warnings:

  - You are about to drop the `merchant_balances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `merchants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `settlements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `webhook_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `webhooks` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[externalRef]` on the table `bank_transfers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "merchant_balances" DROP CONSTRAINT "merchant_balances_merchantId_fkey";

-- DropForeignKey
ALTER TABLE "settlements" DROP CONSTRAINT "settlements_merchantId_fkey";

-- DropForeignKey
ALTER TABLE "webhook_logs" DROP CONSTRAINT "webhook_logs_webhookId_fkey";

-- DropForeignKey
ALTER TABLE "webhooks" DROP CONSTRAINT "webhooks_merchantId_fkey";

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "failureReason" TEXT,
ADD COLUMN     "lastReconciledAt" TIMESTAMP(3),
ADD COLUMN     "reconciliationAttempts" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "merchant_balances";

-- DropTable
DROP TABLE "merchants";

-- DropTable
DROP TABLE "settlements";

-- DropTable
DROP TABLE "webhook_logs";

-- DropTable
DROP TABLE "webhooks";

-- CreateIndex
CREATE UNIQUE INDEX "bank_transfers_externalRef_key" ON "bank_transfers"("externalRef");
