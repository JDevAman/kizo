/*
  Warnings:

  - You are about to drop the column `type` on the `bank_transfers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bank_transfers" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "processedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "user_balances" ALTER COLUMN "locked" SET DATA TYPE BIGINT;
