-- DropIndex
DROP INDEX "transactions_fromUserId_idx";

-- DropIndex
DROP INDEX "transactions_toUserId_idx";

-- CreateIndex
CREATE INDEX "transactions_fromUserId_createdAt_idx" ON "transactions"("fromUserId", "createdAt");

-- CreateIndex
CREATE INDEX "transactions_toUserId_createdAt_idx" ON "transactions"("toUserId", "createdAt");
