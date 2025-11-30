import mongoose from "mongoose";
import { UserModel } from "../models/user.model";

export async function getUserIdByEmail(email: string) {
  const user = await UserModel.findOne({
    userName: email.toLowerCase(),
  }).select("_id");
  if (!user) throwError("Recipient not found", 404);
  return user._id;
}


export const getUserEmailById = async (
  id: string | mongoose.Types.ObjectId
) => {
  if (!id) return null;

  // Ensure we have a valid ObjectId
  let objectId;
  try {
    objectId = new mongoose.Types.ObjectId(id);
  } catch {
    return null;
  }

  const user = await UserModel.findById(objectId).lean();
  return user?.email || null;
};

function throwError(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  throw err;
}

export default throwError;
