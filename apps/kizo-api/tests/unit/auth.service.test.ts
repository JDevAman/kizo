import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuthService } from "../../src/services/auth.service";

// ---- mocks ----
vi.mock("../../src/repositories/user.repository");
vi.mock("../../src/repositories/auth.repository");
vi.mock("argon2");
vi.mock("uuid", () => ({ v4: vi.fn() }));
vi.mock("../../src/utils/tokens");
vi.mock("../../src/config", () => ({
  default: () => ({
    pepper: "pepper",
    refreshTokenExpiresDays: 7,
  }),
}));

import { userRepository } from "../../src/repositories/user.repository";
import { authRepository } from "../../src/repositories/auth.repository";
import * as argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import { signAccessToken } from "../../src/utils/tokens";

describe("AuthService (unit)", () => {
  const service = new AuthService();

  const user = {
    id: "user-id",
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    password: "hashed-password",
    status: "ACTIVE",
    role: "USER",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------- SIGN UP ----------
  it("signUp: creates user, issues tokens, stores refresh token", async () => {
    vi.spyOn(userRepository, "findByEmail").mockResolvedValue(null);
    vi.spyOn(authRepository, "createUserWithBalance").mockResolvedValue(
      user as any,
    );
    vi.spyOn(authRepository, "createRefreshToken").mockResolvedValue(undefined);

    (argon2.hash as vi.Mock).mockResolvedValue("hashed-password");
    (uuidv4 as vi.Mock).mockReturnValue("refresh-token");
    (signAccessToken as vi.Mock).mockReturnValue("access.jwt");

    const result = await service.signUp({
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "password123",
    });

    expect(result).toEqual({
      user,
      accessToken: "access.jwt",
      refreshToken: "refresh-token",
    });
  });

  it("signUp: throws if user exists", async () => {
    vi.spyOn(userRepository, "findByEmail").mockResolvedValue(user as any);

    await expect(
      service.signUp({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "password123",
      }),
    ).rejects.toThrow("User already exists!");

    expect(authRepository.createUserWithBalance).not.toHaveBeenCalled();
  });

  // ---------- SIGN IN ----------
  it("signIn: returns tokens for valid credentials", async () => {
    vi.spyOn(userRepository, "findByEmail").mockResolvedValue(user as any);
    vi.spyOn(authRepository, "createRefreshToken").mockResolvedValue(undefined);

    (argon2.verify as vi.Mock).mockResolvedValue(true);
    (uuidv4 as vi.Mock).mockReturnValue("refresh-token");
    (signAccessToken as vi.Mock).mockReturnValue("access.jwt");

    const result = await service.signIn({
      email: user.email,
      password: "password123",
    });

    expect(result).toEqual({
      user,
      accessToken: "access.jwt",
      refreshToken: "refresh-token",
    });
  });

  it("signIn: throws if user is not ACTIVE", async () => {
    vi.spyOn(userRepository, "findByEmail").mockResolvedValue({
      ...user,
      status: "BANNED",
    } as any);

    await expect(
      service.signIn({ email: user.email, password: "password123" }),
    ).rejects.toThrow("Account is BANNED. Contact support.");
  });

  it("signIn: throws on invalid password", async () => {
    vi.spyOn(userRepository, "findByEmail").mockResolvedValue(user as any);
    (argon2.verify as vi.Mock).mockResolvedValue(false);

    await expect(
      service.signIn({ email: user.email, password: "wrong" }),
    ).rejects.toThrow("Incorrect password");
  });

  // ---------- REFRESH ----------
  it("refreshAccessToken: rotates refresh token and returns new tokens", async () => {
    vi.spyOn(authRepository, "findRefreshTokenByRaw").mockResolvedValue({
      user,
    } as any);

    vi.spyOn(authRepository, "rotateRefreshToken").mockResolvedValue({
      newRawToken: "new-refresh",
    } as any);

    (signAccessToken as vi.Mock).mockReturnValue("new-access.jwt");

    const result = await service.refreshAccessToken("old-refresh");

    expect(result).toEqual({
      accessToken: "new-access.jwt",
      refreshToken: "new-refresh",
      user,
    });
  });

  it("refreshAccessToken: revokes tokens if user not ACTIVE", async () => {
    vi.spyOn(authRepository, "findRefreshTokenByRaw").mockResolvedValue({
      user: { ...user, status: "SUSPENDED" },
    } as any);

    vi.spyOn(authRepository, "revokeAllRefreshTokensForUser").mockResolvedValue(
      undefined,
    );

    await expect(service.refreshAccessToken("bad-refresh")).rejects.toThrow(
      "User not active",
    );

    expect(authRepository.revokeAllRefreshTokensForUser).toHaveBeenCalled();
  });

  // ---------- LOGOUT ----------
  it("logout: revokes refresh token", async () => {
    vi.spyOn(authRepository, "revokeRefreshTokenById").mockResolvedValue(
      undefined,
    );

    await service.logout("refresh-token");

    expect(authRepository.revokeRefreshTokenById).toHaveBeenCalledWith(
      "refresh-token",
    );
  });

  it("logout: does nothing if token missing", async () => {
    await expect(service.logout("")).resolves.not.toThrow();
  });
});
