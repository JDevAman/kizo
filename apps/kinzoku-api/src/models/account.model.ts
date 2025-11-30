import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

accountSchema.methods.getBalanceInRupees = function () {
  return this.balance / 100;
};

export const AccountModel = mongoose.model("Account", accountSchema);
