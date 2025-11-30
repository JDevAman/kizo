import { prisma } from "../db";
import { Prisma, AuthProvider } from "@prisma/client"; // Added AuthProvider

export class UserRepository {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { userName: email },
    });
  }

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  // Used by Manual Sign Up
  async createUser(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
    });
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async searchUsers(filter: string) {
    return await prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: filter, mode: "insensitive" } },
          { lastName: { contains: filter, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        userName: true,
        avatar: true,
      },
    });
  }

  async findOrCreateOAuthUser(data: {
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    provider: AuthProvider; // Ensure you import this from @prisma/client
  }) {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) return existingUser;

    return await prisma.user.create({
      data: {
        userName: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
        // Prisma Enums are strict. Ensure data.provider matches "GOOGLE" or "GITHUB"
        role: "USER", // Default role
        status: "ACTIVE", // Default status
        // Create Account with versioning default
        Account: {
          create: { balance: 0, locked: 0, version: 0 },
        },
      },
    });
  }

  // ✅ NEW: Save Refresh Token to DB
  async createRefreshToken(userId: string, token: string, expiresAt: Date) {
    return await prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  // ✅ NEW: Find Refresh Token
  async findRefreshToken(token: string) {
    return await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true }, // Include user to check status later
    });
  }

  // ✅ NEW: Revoke Token (Logout)
  async deleteRefreshToken(token: string) {
    return await prisma.refreshToken.delete({
      where: { token },
    });
  }

  // ✅ NEW: Revoke All Tokens (Security: "Logout all devices")
  async deleteAllRefreshTokensForUser(userId: string) {
    return await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
  
}
export const userRepository = new UserRepository();
