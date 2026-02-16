import crypto from "crypto";

function hashToken(token: string): string {
  return crypto.createHash("SHA256").update(token).digest("hex");
}

export { hashToken };
