import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { app } from "../../src/app";

// mock service only
vi.mock("../../src/services/auth.service");
vi.mock("../../src/config", () => ({
  default: {
    refreshTokenExpiresDays: 7,
    cookie: {
      accessCookieName: "accessToken",
      refreshCookieName: "refreshToken",
      secure: false,
      sameSite: "strict",
    },
  },
}));

import { authService } from "../../src/services/auth.service";

describe("Auth Controller (integration)", () => {
  const user = {
    id: "user-id",
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    role: "USER",
    avatar: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------- SIGN UP ----------
  it("POST /auth/signup → 201, sets cookies", async () => {
    (authService.signUp as vi.Mock).mockResolvedValue({
      user,
      accessToken: "access.jwt",
      refreshToken: "refresh.jwt",
    });

    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "password123",
      })
      .expect(201);

    expect(res.body.message).toBe("User successfully created");
    expect(res.body.user.email).toBe(user.email);

    const cookies = res.headers["set-cookie"].join(";");
    expect(cookies).toContain("accessToken=");
    expect(cookies).toContain("refreshToken=");
  });

  it("POST /auth/signup → 422 on invalid payload", async () => {
    await request(app)
      .post("/api/v1/auth/signup")
      .send({ email: "bad" })
      .expect(422);
  });

  it("POST /auth/signup → 409 if user exists", async () => {
    (authService.signUp as vi.Mock).mockRejectedValue(
      new Error("User already exists!"),
    );

    await request(app)
      .post("/api/v1/auth/signup")
      .send({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "password123",
      })
      .expect(409);
  });

  // ---------- SIGN IN ----------
  it("POST /auth/signin → 200, sets cookies", async () => {
    (authService.signIn as vi.Mock).mockResolvedValue({
      user,
      accessToken: "access.jwt",
      refreshToken: "refresh.jwt",
    });

    const res = await request(app)
      .post("/api/v1/auth/signin")
      .send({
        email: user.email,
        password: "password123",
      })
      .expect(200);

    expect(res.body.message).toBe("Logged in");
    expect(res.body.user.email).toBe(user.email);

    const cookies = res.headers["set-cookie"].join(";");
    expect(cookies).toContain("accessToken=");
    expect(cookies).toContain("refreshToken=");
  });

  it("POST /auth/signin → 401 on invalid credentials", async () => {
    (authService.signIn as vi.Mock).mockRejectedValue(
      new Error("Invalid credentials"),
    );

    await request(app)
      .post("/api/v1/auth/signin")
      .send({
        email: user.email,
        password: "wrong",
      })
      .expect(401);
  });

  // ---------- REFRESH ----------
  it("POST /auth/refresh → 200 and sets new access token", async () => {
    (authService.refreshAccessToken as vi.Mock).mockResolvedValue({
      accessToken: "new-access.jwt",
    });

    const res = await request(app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", ["refresh_token=refresh.jwt"])
      .expect(200);

    expect(res.body.message).toBe("Access token refreshed");

    const cookies = res.headers["set-cookie"].join(";");
    expect(cookies).toContain("accessToken=");
  });

  it("POST /auth/refresh → 401 if cookie missing", async () => {
    await request(app).post("/api/v1/auth/refresh").expect(401);
  });

  it("POST /auth/refresh → 403 if token invalid", async () => {
    (authService.refreshAccessToken as vi.Mock).mockRejectedValue(
      new Error("Invalid"),
    );

    await request(app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", ["refresh_token=bad"])
      .expect(403);
  });

  // ---------- LOGOUT ----------
  it("POST /auth/logout → clears cookies", async () => {
    (authService.logout as vi.Mock).mockResolvedValue(undefined);

    const res = await request(app)
      .post("/api/v1/auth/logout")
      .set("Cookie", ["refreshToken=refresh.jwt"])
      .expect(200);

    expect(res.body.message).toContain("Logged out");

    const cookies = res.headers["set-cookie"].join(";");
    expect(cookies).toContain("accessToken=");
    expect(cookies).toContain("refreshToken=");
  });
});
