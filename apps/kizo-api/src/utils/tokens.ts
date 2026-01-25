import jwt from "jsonwebtoken";
import crypto from "crypto";
import getConfig from "../config.js";

export type AccessTokenPayload = {
  id: string;
  email: string;
  role: string;
};

const config = getConfig();

function hashToken(token: string): string {
  return crypto.createHash("SHA256").update(token).digest("hex");
}

function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, config.jwtsecret, {
    expiresIn: config.accessTokenExpiresIn,
  });
}

function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, config.jwtsecret) as AccessTokenPayload;
}

export { signAccessToken, verifyAccessToken, hashToken };
