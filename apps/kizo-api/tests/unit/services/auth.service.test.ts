import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "../../../src/services/auth.service";
import { userRepository, authRepository } from "@kizo/db";
import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import { signAccessToken } from "../../../src/utils/tokens";

vi.mock("argon2", () => ({
  default: {
    hash: vi.fn(),
    verify: vi.fn(),
  },
}));

vi.mock("uuid", () => ({ v4: vi.fn() }));
vi.mock("../../../src/utils/tokens");
const mockLog = { info: vi.fn(), warn: vi.fn(), error: vi.fn() } as any;

describe("AuthService (unit)", () => {
  const service = new AuthService();
  const user = { id: "u-1", email: "t@t.com", status: "ACTIVE", role: "USER" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // SIGN UP
  it("signUp: creates user, issues tokens, stores refresh token", async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
    vi.mocked(authRepository.createUserWithBalance).mockResolvedValue(
      user as any,
    );
    vi.mocked(argon2.hash).mockResolvedValue("hashed");
    (uuidv4 as any).mockReturnValue("ref-token");
    vi.mocked(signAccessToken).mockReturnValue("acc-jwt");

    const result = await service.signUp(
      {
        firstName: "T",
        lastName: "U",
        email: "t@t.com",
        password: "123",
      },
      mockLog,
    );

    expect(result.accessToken).toBe("acc-jwt");
    expect(authRepository.createRefreshToken).toHaveBeenCalled();
    expect(mockLog.info).toHaveBeenCalledWith(
      expect.anything(),
      "New user registered",
    );
  });

  it("signUp: throws if user exists", async () => {
    vi.spyOn(userRepository, "findByEmail").mockResolvedValue(user as any);

    await expect(
      service.signUp(
        {
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          password: "password123",
        },
        mockLog,
      ),
    ).rejects.toThrow("User already exists!");

    expect(authRepository.createUserWithBalance).not.toHaveBeenCalled();
  });

  // ---------- SIGN IN ----------
  it("signIn: returns tokens for valid credentials", async () => {
    vi.spyOn(userRepository, "findByEmail").mockResolvedValue({
      ...user,
      password: "hashed-password",
    } as any);
    vi.spyOn(authRepository, "createRefreshToken").mockResolvedValue({
      id: "token-id",
      userId: user.id,
      tokenHash: "hashed-token",
      expiresAt: new Date(),
      createdAt: new Date(),
      revoked: false,
    } as any);

    vi.mocked(argon2.verify).mockResolvedValue(true);
    (uuidv4 as any).mockReturnValue("refresh-token");
    (signAccessToken as any).mockReturnValue("access.jwt");

    const result = await service.signIn(
      {
        email: user.email,
        password: "123",
      },
      mockLog,
    );
    expect(result).toEqual(
      expect.objectContaining({
        accessToken: "access.jwt",
        refreshToken: "refresh-token",
        user: expect.objectContaining({ id: "u-1", email: "t@t.com" }),
      }),
    );
  });

  it("signIn: throws if user is not ACTIVE", async () => {
    vi.spyOn(userRepository, "findByEmail").mockResolvedValue({
      ...user,
      status: "BANNED",
      password: "hashed-password",
    } as any);

    await expect(
      service.signIn({ email: user.email, password: "123" }, mockLog),
    ).rejects.toThrow(/Account is BANNED/);
  });

  it("signIn: throws on invalid password", async () => {
    vi.spyOn(userRepository, "findByEmail").mockResolvedValue({
      ...user,
      password: "hashed-password",
    } as any);
    (argon2.verify as any).mockResolvedValue(false);

    await expect(
      service.signIn({ email: user.email, password: "wrong" }, mockLog),
    ).rejects.toThrow("Incorrect password");
  });

  // ---------- REFRESH ----------
  it("refreshAccessToken: rotates refresh token and returns new tokens", async () => {
    const mockNewRaw = "newRaw";
    const mockNewAccess = "new-access.jwt";

    (uuidv4 as any).mockReturnValue("newRaw");
    vi.spyOn(authRepository, "rotateRefreshToken").mockResolvedValue({
      newRawToken: mockNewRaw,
      record: { user },
    } as any);

    vi.mocked(signAccessToken).mockReturnValue(mockNewAccess);

    const result = await service.refreshAccessToken("old-refresh", mockLog);
    expect(authRepository.rotateRefreshToken).toHaveBeenCalledWith(
      "old-refresh",
      mockNewRaw,
      expect.any(Date),
    );
    expect(mockLog.info).toHaveBeenCalledWith(
      expect.objectContaining({ userId: user.id }),
      "Token rotated",
    );

    expect(result).toEqual({
      accessToken: mockNewAccess,
      newRawToken: mockNewRaw,
    });
  });

  it("refreshAccessToken: revokes tokens if user not ACTIVE", async () => {
    vi.mocked(authRepository.rotateRefreshToken).mockResolvedValue({
      newRawToken: "newRaw",
      record: { user: { ...user, status: "BANNED" } },
    } as any);

    await expect(
      service.refreshAccessToken("bad-refresh", mockLog),
    ).rejects.toThrow("User not active");
  });

  // ---------- LOGOUT ----------
  it("logout: revokes refresh token", async () => {
    vi.spyOn(authRepository, "revokeRefreshTokenById").mockResolvedValue({
      count: expect.any(Number),
    });

    await service.logout("refresh-token");

    expect(authRepository.revokeRefreshTokenById).toHaveBeenCalledWith(
      "refresh-token",
    );
  });

  it("logout: does nothing if token missing", async () => {
    await expect(service.logout("")).resolves.not.toThrow();
  });
});
