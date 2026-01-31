import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import { authRepository, userRepository } from "@kizo/db";
import { signAccessToken } from "../utils/tokens.js";
import { SignupInput, SigninInput } from "@kizo/shared";
import getConfig from "../config.js";
import { Logger } from "@kizo/logger";

const config = getConfig();
const REFRESH_MS = config.refreshTokenExpiresDays * 24 * 60 * 60 * 1000;

export class AuthService {
  async signUp(payload: SignupInput, log: Logger) {
    const { firstName, lastName, email, password } = payload;

    // 1. Check existence
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      log.warn({ email }, "Signup rejected: User already exists"); // Essential
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

    log.info(
      { userId: newUser.id, email: newUser.email },
      "New user registered",
    );
    // 4. Generate Token
    const accessToken = signAccessToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    // 3. Generate Refresh Token
    const refreshToken = uuidv4();
    const refreshExpiresAt = new Date(Date.now() + REFRESH_MS);

    // 4. Store Refresh Token
    await authRepository.createRefreshToken(
      newUser.id,
      refreshToken,
      refreshExpiresAt,
    );

    // Return EVERYTHING
    return { user: newUser, accessToken, refreshToken };
  }

  async signIn(payload: SigninInput, log: Logger) {
    const { email, password } = payload;

    const user = await userRepository.findByEmail(email);
    if (!user || !user.password) {
      log.warn({ email }, "Failed login: User not found");
      throw new Error("Invalid credentials");
    }

    // ✅ 1. SECURITY CHECK: Is user Banned?
    if (user.status !== "ACTIVE") {
      log.warn(
        { userId: user.id, status: user.status },
        "Login blocked: Inactive account",
      );
      throw new Error(`Account is ${user.status}. Contact support.`);
    }

    const isValid = await argon2.verify(
      user.password,
      password + config.pepper,
    );
    if (!isValid) {
      log.warn({ userId: user.id, email }, "Login failed: Incorrect password"); // Brute force tracking
      throw new Error("Incorrect password");
    }

    log.info({ userId: user.id }, "User session started");

    // ✅ 2. Generate Access Token (JWT) - Short Lived (15m)
    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // ✅ 3. Generate Refresh Token (UUID) - Long Lived (7d)
    const refreshToken = uuidv4();
    const refreshExpiresAt = new Date(Date.now() + REFRESH_MS);

    // ✅ 4. Store Refresh Token in DB
    await authRepository.createRefreshToken(
      user.id,
      refreshToken,
      refreshExpiresAt,
    );

    return { user, accessToken, refreshToken };
  }

  async refreshAccessToken(incomingRefreshToken: string, log: Logger) {
    try {
      const newExpires = new Date(Date.now() + REFRESH_MS);
      const newRaw = uuidv4();
      const { newRawToken, record } = await authRepository.rotateRefreshToken(
        incomingRefreshToken,
        newRaw,
        newExpires,
      );
      log.info({ userId: record.user.id }, "Token rotated");
      // create new access token (JWT)
      const accessToken = signAccessToken({
        id: record.user.id,
        email: record.user.email,
        role: record.user.role,
      });

      return {
        accessToken,
        newRawToken,
      };
    } catch (error) {
      log.error({ err: error.message }, "Token rotation failed");
      throw error;
    }
  }

  async logout(refreshToken: string) {
    if (!refreshToken) return;
    await authRepository.revokeRefreshTokenById(refreshToken);
  }
}

export const authService = new AuthService();
