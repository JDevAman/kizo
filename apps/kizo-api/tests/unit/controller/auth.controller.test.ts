import { vi, it, describe, expect, beforeEach } from "vitest";
import {
  signUp,
  signIn,
  refresh,
} from "../../../src/controllers/auth.controller";
import { authService } from "../../../src/services/auth.service";
import getConfig from "../../../src/config";

const config = getConfig();

vi.mock("../../../src/services/auth.service", () => ({
  authService: {
    signUp: vi.fn(),
    signIn: vi.fn(),
    refreshAccessToken: vi.fn(),
    logout: vi.fn(),
  },
}));

describe("Auth Controller Unit Tests", () => {
  let req: any, res: any, next: any;

  beforeEach(() => {
    vi.clearAllMocks();

    req = {
      user: { id: "user-123" },
      body: {},
      log: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      cookie: vi.fn().mockReturnThis(),
      clearCookie: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  it("✅ SignUp: should create user and set cookies", async () => {
    req.body = { email: "test@kizo.com", password: "123" };
    const mockResponse = {
      user: { id: "u1", email: "test@kizo.com", role: "USER" },
      accessToken: "access-jwt",
      refreshToken: "refresh-raw",
    };

    vi.mocked(authService.signUp).mockResolvedValue(mockResponse as any);

    await signUp(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.cookie).toHaveBeenCalledTimes(2);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User successfully created",
      }),
    );
  });

  it("✅ SignIn: should log in user and set cookies", async () => {
    req.body = { email: "test@kizo.com", password: "123" };
    const mockResponse = {
      user: { id: "u1", email: "test@kizo.com" },
      accessToken: "access-jwt",
      refreshToken: "refresh-raw",
    };

    vi.mocked(authService.signIn).mockResolvedValue(mockResponse as any);

    await signIn(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.cookie).toHaveBeenCalledWith(
      expect.any(String),
      "access-jwt",
      expect.any(Object),
    );
  });

  it("✅ Refresh: should refresh token", async () => {
    const cookieName = config.cookie.refreshCookieName;
    req.cookies = { [cookieName]: "old-raw-token" };

    const mockResponse = {
      accessToken: "new-access-jwt",
      newRawToken: "new-refresh-raw",
    };

    vi.mocked(authService.refreshAccessToken).mockResolvedValue(
      mockResponse as any,
    );

    await refresh(req, res, next);

    expect(authService.refreshAccessToken).toHaveBeenCalledWith(
      "old-raw-token",
      expect.anything(),
    );

    expect(res.cookie).toHaveBeenCalledWith(
      config.cookie.accessCookieName,
      "new-access-jwt",
      expect.anything(),
    );

    expect(res.json).toHaveBeenCalledWith({
      message: "Access token refreshed",
    });

    expect(next).not.toHaveBeenCalled();
  });
});
