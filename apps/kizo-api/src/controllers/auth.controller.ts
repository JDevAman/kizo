import { Request, Response } from "express";
import { schemas } from "@kizo/shared";
import { authService } from "../services/auth.service.js";
import getConfig from "../config.js";

const config = getConfig();
const ACCESS_MS = 15 * 60 * 1000;
const REFRESH_MS = config.refreshTokenExpiresDays * 24 * 60 * 60 * 1000;

export const signUp = async (req: Request, res: Response) => {
  try {
    const { user, accessToken, refreshToken } = await authService.signUp(
      req.body,
    );

    res.cookie(config.cookie.accessCookieName, accessToken, {
      httpOnly: true,
      secure: config.cookie.secure,
      domain: config.cookie.domain,
      sameSite: config.cookie.sameSite,
      path: config.accessTokenPath,
      maxAge: ACCESS_MS,
    });

    res.cookie(config.cookie.refreshCookieName, refreshToken, {
      httpOnly: true,
      secure: config.cookie.secure,
      domain: config.cookie.domain,
      sameSite: config.cookie.sameSite,
      path: config.refreshTokenPath,
      maxAge: REFRESH_MS,
    });

    return res.status(201).json({
      message: "User successfully created",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    const status = error.message === "User already exists!" ? 409 : 500;
    return res.status(status).json({ message: error.message });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { user, accessToken, refreshToken } = await authService.signIn(
      req.body,
    );

    res.cookie(config.cookie.accessCookieName, accessToken, {
      httpOnly: true,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
      domain: config.cookie.domain,
      path: config.accessTokenPath,
      maxAge: ACCESS_MS,
    });

    res.cookie(config.cookie.refreshCookieName, refreshToken, {
      httpOnly: true,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
      domain: config.cookie.domain,
      path: config.refreshTokenPath,
      maxAge: REFRESH_MS,
    });

    return res.status(200).json({
      message: "Logged in",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies[config.cookie.refreshCookieName];

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.clearCookie(config.cookie.accessCookieName, { path: "/" });
    res.clearCookie(config.cookie.refreshCookieName, { path: "/api/v1" });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout cleanup failed:", error);
    res.status(500).json({ error: error });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const incomingRefreshToken = req.cookies[config.cookie.refreshCookieName];

    if (!incomingRefreshToken) {
      return res.status(401).json({ message: "Refresh Token Missing" });
    }

    const { accessToken, newRawToken } = await authService.refreshAccessToken(
      incomingRefreshToken,
    );
    // Send new Access Token
    res.cookie(config.cookie.accessCookieName, accessToken, {
      httpOnly: true,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
      domain: config.cookie.domain,
      maxAge: ACCESS_MS,
      path: config.accessTokenPath,
    });

    res.cookie(config.cookie.refreshCookieName, newRawToken, {
      httpOnly: true,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
      domain: config.cookie.domain,
      path: config.refreshTokenPath,
      maxAge: REFRESH_MS,
    });

    return res.json({ message: "Access token refreshed" });
  } catch (error: any) {
    res.clearCookie(config.cookie.accessCookieName, { path: "/" });
    res.clearCookie(config.cookie.refreshCookieName, {
      path: "/api/v1",
    });
    return res
      .status(403)
      .json({ message: "Invalid Refresh Token, please login again" });
  }
};
