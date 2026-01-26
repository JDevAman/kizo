import { getPrisma, Prisma } from "@kizo/db";
import { hashToken } from "../utils/token";

export class AuthRepository {
  private get prisma() {
    return getPrisma();
  }
  async createUserWithBalance(data: Prisma.UserCreateInput) {
    const created = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({ data });
      await tx.userBalance.create({
        data: { userId: user.id, balance: BigInt(0) },
      });
      return user;
    });
    return created;
  }

  async createRefreshToken(userId: string, rawToken: string, expiresAt: Date) {
    const tokenHash = hashToken(rawToken);
    return await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
  }

  async revokeRefreshTokenById(tokenId: string) {
    return this.prisma.refreshToken.updateMany({
      where: { id: tokenId },
      data: {
        revoked: true,
      },
    });
  }

  async rotateRefreshToken(
    oldRawToken: string,
    newRaw: string,
    newExpires: Date,
  ) {
    const oldHash = hashToken(oldRawToken);

    return await this.prisma.$transaction(async (tx) => {
      const now = new Date();
      const oldRecord = await tx.refreshToken.findUnique({
        where: { tokenHash: oldHash },
        select: {
          id: true,
          revoked: true,
          userId: true,
          expiresAt: true,
          user: {
            select: {
              id: true,
              status: true,
              email: true,
              role: true,
            },
          },
        },
      });

      if (!oldRecord) {
        throw new Error("Invalid refresh token");
      }

      if (oldRecord.revoked) {
        await tx.refreshToken.updateMany({
          where: { userId: oldRecord.userId },
          data: { revoked: true },
        });
        throw new Error("Refresh token reuse detected");
      }

      if (oldRecord.user.status !== "ACTIVE") {
        throw new Error("User suspended");
      }

      if (oldRecord.expiresAt < now) {
        await tx.refreshToken.update({
          where: { id: oldRecord.id },
          data: { revoked: true },
        });
        throw new Error("Refresh token expired");
      }

      const newHash = hashToken(newRaw);

      await tx.refreshToken.create({
        data: {
          userId: oldRecord.userId,
          tokenHash: newHash,
          expiresAt: newExpires,
        },
      });

      // revoke old and point to new
      await tx.refreshToken.update({
        where: { id: oldRecord.id },
        data: { revoked: true },
      });

      return { newRawToken: newRaw, record: oldRecord };
    });
  }
}

export const authRepository = new AuthRepository();
