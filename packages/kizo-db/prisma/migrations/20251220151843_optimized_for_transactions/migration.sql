/*
  Warnings:

  - The values [P2P_TRANSFER] on the enum `TxType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[transactionId]` on the table `bank_transfers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[createdByUserId,idempotencyKey]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Made the column `transactionId` on table `bank_transfers` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `createdByUserId` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BankTransferStatus" AS ENUM ('PROCESSING', 'SUCCESS', 'FAILED');

-- AlterEnum
BEGIN;
CREATE TYPE "TxType_new" AS ENUM ('TRANSFER', 'DEPOSIT', 'WITHDRAWAL');
ALTER TABLE "transactions" ALTER COLUMN "type" TYPE "TxType_new" USING ("type"::text::"TxType_new");
ALTER TYPE "TxType" RENAME TO "TxType_old";
ALTER TYPE "TxType_new" RENAME TO "TxType";
DROP TYPE "public"."TxType_old";
COMMIT;

-- AlterTable
ALTER TABLE "bank_transfers" ALTER COLUMN "transactionId" SET NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "createdByUserId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bank_transfers_transactionId_key" ON "bank_transfers"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_createdByUserId_idempotencyKey_key" ON "transactions"("createdByUserId", "idempotencyKey");
