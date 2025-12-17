import { describe, it, expect } from "vitest";
import crypto from "crypto";
import {
  signAccessToken,
  hashToken,
  verifyAccessToken,
} from "../../src/utils/tokens";

describe("tokens utils", () => {
  it("signs and verifies access token", () => {
    const token = signAccessToken({ id: "user-id" });

    const payload = verifyAccessToken(token);

    expect(payload.id).toBe("user-id");
  });

  it("hash token", () => {
    const token = "test-token";
    const expected = crypto.createHash("SHA256").update(token).digest("hex");
    const result = hashToken(token);
    expect(result).toEqual(expected);
  });
});
