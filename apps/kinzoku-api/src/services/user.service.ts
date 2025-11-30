import argon2 from "argon2";
import config from "../config";
import { v4 as uuidv4 } from "uuid";
import { userRepository } from "../repositories/user.repository";
import { signjwt } from "../utils/tokens";
import {
  userSignUpSchema,
  userSignInSchema,
  updateUserSchema,
} from "@kinzoku/shared" 

export class UserService {
  async signUp(payload: userSignUpSchema) {
    const { firstName, lastName, userName, password } = payload;

    // 1. Check existence
    const existingUser = await userRepository.findByEmail(userName);
    if (existingUser) {
      throw new Error("User already exists!");
    }

    // 2. Hash Password
    const hashedPassword = await argon2.hash(password + config.pepper);

    // 3. Create User (Repo handles the atomic Account creation)
    const newUser = await userRepository.createUser({
      firstName,
      lastName,
      userName,
      password: hashedPassword,
      Account: {
        create: { balance: 0 },
      },
    });

    // 4. Generate Token
    const accessToken = signjwt({
        id: newUser.id,
        email: newUser.userName,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
    });

    // 3. Generate Refresh Token
    const refreshToken = uuidv4();
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    // 4. Store Refresh Token
    await userRepository.createRefreshToken(newUser.id, refreshToken, refreshExpiresAt);

    // Return EVERYTHING
    return { user: newUser, accessToken, refreshToken };
  }

  async signIn(payload: userSignInSchema) {
    const { userName, password } = payload;

    const user = await userRepository.findByEmail(userName);
    if (!user || !user.password) {
      throw new Error("Invalid credentials");
    }

    // ✅ 1. SECURITY CHECK: Is user Banned?
    if (user.status !== "ACTIVE") {
      throw new Error(`Account is ${user.status}. Contact support.`);
    }

    const isValid = await argon2.verify(
      user.password,
      password + config.pepper
    );
    if (!isValid) throw new Error("Incorrect password");

    // ✅ 2. Generate Access Token (JWT) - Short Lived (15m)
    const accessToken = signjwt({
      id: user.id,
      email: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role, // Add role to JWT for frontend RBAC
    });

    // ✅ 3. Generate Refresh Token (UUID) - Long Lived (7d)
    const refreshToken = uuidv4();
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 Days

    // ✅ 4. Store Refresh Token in DB
    await userRepository.createRefreshToken(
      user.id,
      refreshToken,
      refreshExpiresAt
    );

    return { user, accessToken, refreshToken };
  }

  async refreshAccessToken(incomingRefreshToken: string) {
    // 1. Find token in DB
    const record = await userRepository.findRefreshToken(incomingRefreshToken);

    // 2. Validate
    if (!record) throw new Error("Invalid refresh token");
    if (record.expiresAt < new Date()) throw new Error("Refresh token expired");
    if (record.revoked) throw new Error("Token revoked"); // If you implement soft delete
    if (record.user.status !== "ACTIVE") throw new Error("User banned");

    // 3. Issue new Access Token
    const newAccessToken = signjwt({
      id: record.user.id,
      email: record.user.userName,
      firstName: record.user.firstName,
      lastName: record.user.lastName,
      role: record.user.role,
    });

    // Optional: Rotate Refresh Token (Delete old, create new) for extra security
    // For now, we just return the new access token
    return { accessToken: newAccessToken };
  }

  async logout(refreshToken: string) {
    if (!refreshToken) return;
    await userRepository.deleteRefreshToken(refreshToken);
  }

  async updateProfile(
    userId: string,
    currentUserEmail: string,
    payload: updateUserSchema
  ) {
    const { firstName, lastName, email, password } = payload;
    const updateData: any = {};

    // Logic: Check if new email is taken
    if (email && email !== currentUserEmail) {
      const existing = await userRepository.findByEmail(email);
      if (existing) throw new Error("Email already in use");
      updateData.userName = email;
    }

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (password) {
      updateData.password = await argon2.hash(password + config.pepper);
    }

    const updatedUser = await userRepository.updateUser(userId, updateData);

    // Re-issue token because details changed
    const token = signjwt({
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.userName,
      role: updatedUser.role,
    });

    return { token };
  }

  async bulkSearch(filter: string) {
    return await userRepository.searchUsers(filter);
  }
}

export const userService = new UserService();
