  import mongoose from "mongoose";

  const transactionSchema = new mongoose.Schema(
    {
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: function () {
          return this.type !== "add";
        },
      },
      to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      amount: { type: Number, required: true, min: 1 },
      type: {
        type: String,
        enum: ["transfer", "request", "add", "refund"],
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "success", "failed", "rejected", "cancelled"],
        default: "pending",
      },
      description: { type: String, default: null },
      relatedTransaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        default: null,
      },
      initiatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      expiresAt: { type: Date, default: undefined },
      finalizedAt: { type: Date, default: null },
    },
    { timestamps: true }
  );

  transactionSchema.index({ from: 1 });
  transactionSchema.index({ to: 1 });
  transactionSchema.index({ type: 1, status: 1 });
  transactionSchema.index({ createdAt: -1 });
  transactionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

  export const TransactionModel = mongoose.model(
    "Transaction",
    transactionSchema
  );
