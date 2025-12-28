import jwt from "jsonwebtoken";
import crypto from "crypto";
import getConfig from "../config.js";

export type AccessTokenPayload = { id: string };
const config = getConfig();
function hashToken(token: string) {
  return crypto.createHash("SHA256").update(token).digest("hex");
}

function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, config.jwtsecret, {
    expiresIn: config.accessTokenExpiresIn,
  });
}

function verifyAccessToken(token: AccessTokenPayload) {
  try {
    return jwt.verify(token, config.jwtsecret) as AccessTokenPayload;
  } catch (err) {
    return err;
  }
}

export { signAccessToken, verifyAccessToken, hashToken };
