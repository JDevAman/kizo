import argon2, { hash } from "argon2";
import z from "zod";
import { v4 as uuidv4 } from "uuid";
import { authRepository } from "../repositories/auth.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import { signAccessToken } from "../utils/tokens.js";
import { schemas, SignupInput, SigninInput } from "@kizo/shared";
import getConfig from "../config.js";

const config = getConfig();
const REFRESH_MS = config.refreshTokenExpiresDays * 24 * 60 * 60 * 1000;

export class AuthService {
  async signUp(payload: SignupInput) {
    const { firstName, lastName, email, password } = payload;

    // 1. Check existence
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists!");
    }

    // 2. Hash Password
    const hashedPassword = await argon2.hash(password + config.pepper);
    // 3. Create User (Repo handles the atomic Account creation)
    const newUser = await authRepository.createUserWithBalance({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // 4. Generate Token
    const accessToken = signAccessToken({
      id: newUser.id,
    });

    // 3. Generate Refresh Token
    const refreshToken = uuidv4();
    const refreshExpiresAt = new Date(
      Date.now() + config.refreshTokenExpiresDays * 24 * 60 * 60 * 1000,
    );

    // 4. Store Refresh Token
    await authRepository.createRefreshToken(
      newUser.id,
      refreshToken,
      refreshExpiresAt,
    );

    // Return EVERYTHING
    return { user: newUser, accessToken, refreshToken };
  }

  async signIn(payload: SigninInput) {
    const { email, password } = payload;

    const user = await userRepository.findByEmail(email);
    if (!user || !user.password) {
      throw new Error("Invalid credentials");
    }

    // ✅ 1. SECURITY CHECK: Is user Banned?
    if (user.status !== "ACTIVE") {
      throw new Error(`Account is ${user.status}. Contact support.`);
    }

    const isValid = await argon2.verify(
      user.password,
      password + config.pepper,
    );
    if (!isValid) throw new Error("Incorrect password");

    // ✅ 2. Generate Access Token (JWT) - Short Lived (15m)
    const accessToken = signAccessToken({ id: user.id });

    // ✅ 3. Generate Refresh Token (UUID) - Long Lived (7d)
    const refreshToken = uuidv4();
    const refreshExpiresAt = new Date(
      Date.now() + config.refreshTokenExpiresDays * 24 * 60 * 60 * 1000,
    );

    // ✅ 4. Store Refresh Token in DB
    await authRepository.createRefreshToken(
      user.id,
      refreshToken,
      refreshExpiresAt,
    );

    return { user, accessToken, refreshToken };
  }

  async refreshAccessToken(incomingRefreshToken: string) {
    const existing =
      await authRepository.findRefreshTokenByRaw(incomingRefreshToken);
    if (!existing) {
      throw new Error("Invalid refresh token");
    }

    if (existing.user.status !== "ACTIVE") {
      await authRepository.revokeAllRefreshTokensForUser(existing.user.id);
      throw new Error("User not active");
    }

    const newExpires = new Date(
      Date.now() + config.refreshTokenExpiresDays * 24 * 60 * 60 * 1000,
    );

    const { newRawToken } = await authRepository.rotateRefreshToken(
      incomingRefreshToken,
      existing.user.id,
      newExpires,
    );

    // create new access token (JWT)
    const accessToken = signAccessToken({ id: existing.user.id });
    return {
      accessToken,
      refreshToken: newRawToken,
      user: existing.user,
    };
  }

  async logout(refreshToken: string) {
    if (!refreshToken) return;
    await authRepository.revokeRefreshTokenById(refreshToken);
  }
}

export const authService = new AuthService();
