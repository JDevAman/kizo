import mongoose from "mongoose";
import { TransactionModel } from "../models/transaction.model";

export default async function logTransaction({
  from,
  to,
  amount,
  type,
  status,
  description,
  session,
  expiresAt,
}: {
  from?: string | null;
  to?: string | null;
  amount: number;
  type: string;
  status: string;
  description?: string;
  session?: any;
  expiresAt?: Date | null;
}) {
  const transaction = new TransactionModel({
    from: from ? new mongoose.Types.ObjectId(from) : null,
    to: to ? new mongoose.Types.ObjectId(to) : null,
    amount,
    type,
    status,
    description,
    expiresAt: expiresAt || null,
  });

  await transaction.save({ session });
  return transaction;
}
