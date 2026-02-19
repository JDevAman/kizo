import { getPrisma, type Prisma } from "../index.js";

export class UserRepository {
  private get prisma() {
    return getPrisma();
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async searchUsers(filter: string) {
    return this.prisma.user.findMany({
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
        email: true,
        avatar: true,
      },
    });
  }
}

export const userRepository = new UserRepository();
