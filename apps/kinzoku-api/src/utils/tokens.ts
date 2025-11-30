import jwt from "jsonwebtoken";
import config from "../config";

interface UserPayload {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string; // Optional: For cases where you only have a full name
  avatar?: string | null;
}

function signjwt(payload: UserPayload): string {
  // Use config.jwtsecret (ensure this exists in your config file)
  return jwt.sign(payload, config.jwtsecret || "secret", { expiresIn: "24h" });
}

function verifyjwt(token: string): UserPayload {
  try {
    return jwt.verify(token, config.jwtsecret || "secret") as UserPayload;
  } catch (err) {
    // It's often better to return null or throw a specific error object
    // so your middleware can send a proper 401 response.
    throw new Error("Invalid or expired token");
  }
}

export { signjwt, verifyjwt, UserPayload };