/*
  Warnings:

  - A unique constraint covering the columns `[createdByUserId,idempotencyKey,type]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "transactions_createdByUserId_idempotencyKey_key";

-- DropIndex
DROP INDEX "transactions_idempotencyKey_key";

-- CreateIndex
CREATE UNIQUE INDEX "transactions_createdByUserId_idempotencyKey_type_key" ON "transactions"("createdByUserId", "idempotencyKey", "type");
