import mongoose from "mongoose";
import { AccountModel } from "./account.model";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
      lowercase: true,
      unique: true,
      trim: true,
    },
    firstName: { type: String, required: true, maxlength: 20, trim: true },
    lastName: { type: String, required: true, maxlength: 20, trim: true },
    password: {
      type: String,
      minlength: 6,
      required: function () {
        return !this.oauthProvider;
      },
    },
    avatar: { type: String, default: null },
    oauthProvider: { type: String, enum: ["google", "github"], default: null },
    role: {
      type: String,
      enum: ["USER", "ADMIN", "SUPERADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.statics.findByUsername = function (username: string) {
  return this.findOne({ userName: username.toLowerCase() });
};

userSchema.post("save", async function (doc) {
  const existing = await AccountModel.findOne({ userId: doc._id });
  if (!existing) await AccountModel.create({ userId: doc._id, balance: 0 });
});

export const UserModel = mongoose.model("User", userSchema);
