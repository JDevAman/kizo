import { userRepository } from "../repositories/user.repository";
import { signAccessToken } from "../utils/tokens";
import { UpdateProfileInput } from "@kizo/shared";
import { v4 as uuidv4 } from "uuid";
import { storageService } from "../lib/storage";
import config from "../config";

const MAX_AVATAR_SIZE = config.maxAvatarSize * 1024; // 100 KB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export class UserService {
  async updateProfile(userId: string, payload: UpdateProfileInput) {
    const { firstName, lastName, avatar } = payload;
    const updateData: any = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (avatar) updateData.avatar = avatar;

    const updatedUser = await userRepository.updateUser(userId, updateData);

    // Re-issue token because details changed
    const token = signAccessToken({
      id: updatedUser.id,
    });

    return { token };
  }

  async generateUploadUrl({
    userId,
    fileName,
    contentType,
    size,
  }: {
    userId: string;
    fileName: string;
    contentType: string;
    size: number;
  }) {
    if (!ALLOWED_TYPES.includes(contentType)) {
      throw new Error("Invalid file type");
    }

    if (size > MAX_AVATAR_SIZE) {
      throw new Error("File too large (max 100KB)");
    }

    const objectPath = `avatars/${userId}/${Date.now()}-${fileName}`;

    const { uploadUrl, publicUrl } =
      await storageService.generateSignedUploadUrl({
        objectPath,
        contentType,
        maxSize: MAX_AVATAR_SIZE,
      });

    return { uploadUrl, publicUrl };
  }

  async bulkSearch(filter: string) {
    return await userRepository.searchUsers(filter);
  }
}

export const userService = new UserService();
