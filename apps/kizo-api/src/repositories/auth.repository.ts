import { prisma } from "../db";
import { Prisma, AuthProvider } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { hashToken } from "../utils/tokens";

export class AuthRepository {
  async createUser(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
    });
  }

  async createRefreshToken(userId: string, rawToken: string, expiresAt: Date) {
    const tokenHash = hashToken(rawToken);
    return await prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
  }

  async revokeRefreshTokenById(tokenId: string) {
    return prisma.refreshToken.update({
      where: { id: tokenId },
      data: {
        revoked: true,
      },
    });
  }

  async findRefreshTokenByRaw(rawToken: string) {
    const tokenHash = hashToken(rawToken);
    return await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
  }

  async revokeAllRefreshTokensForUser(userId: string) {
    return prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  }

  async rotateRefreshToken(
    oldRawToken: string,
    userId: string,
    newExpiresAt: Date
  ) {
    const oldHash = hashToken(oldRawToken);

    return await prisma.$transaction(async (tx) => {
      const oldRecord = await tx.refreshToken.findUnique({
        where: { tokenHash: oldHash },
      });

      if (!oldRecord) {
        throw new Error("Invalid refresh token");
      }

      if (oldRecord.revoked) {
        await tx.refreshToken.updateMany({
          where: { userId },
          data: { revoked: true },
        });
        throw new Error("Refresh token reuse detected");
      }

      if (oldRecord.expiresAt < new Date()) {
        await tx.refreshToken.update({
          where: { id: oldRecord.id },
          data: { revoked: true },
        });
        throw new Error("Refresh token expired");
      }

      const newRaw = uuidv4();
      const newHash = hashToken(newRaw);

      const newRecord = await tx.refreshToken.create({
        data: {
          userId,
          tokenHash: newHash,
          expiresAt: newExpiresAt,
        },
      });

      // revoke old and point to new
      await tx.refreshToken.update({
        where: { id: oldRecord.id },
        data: { revoked: true },
      });

      return { newRawToken: newRaw, newRecord };
    });
  }
}

export const authRepository = new AuthRepository();
