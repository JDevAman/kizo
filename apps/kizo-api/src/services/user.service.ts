import { userRepository } from "../repositories/user.repository";
import { signAccessToken } from "../utils/tokens";
import { UpdateProfileInput } from "@kizo/shared";
import { v4 as uuidv4 } from "uuid";
import supabase from "../lib/storage";
import sharp from "sharp";
import config from "../config";

const MAX_AVATAR_SIZE = config.maxAvatarSize * 1024; // 100 KB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export class UserService {
  async updateProfile(userId: string, payload: UpdateProfileInput) {
    const { firstName, lastName } = payload;
    const updateData: any = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;

    const updatedUser = await userRepository.updateUser(userId, updateData);

    // Re-issue token because details changed
    const token = signAccessToken({
      id: updatedUser.id,
    });

    return { token };
  }

  async uploadAvatar({
    userId,
    buffer,
    mime,
  }: {
    userId: string;
    buffer: Buffer;
    mime: string;
  }) {
    if (!ALLOWED_TYPES.includes(mime)) {
      throw new Error("Invalid file type");
    }

    const optimized = await sharp(buffer)
      .resize(256, 256, { fit: "cover" })
      .webp({ quality: 80 })
      .toBuffer();

    const path = `avatars/${userId}/avatar.webp`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, optimized, {
        contentType: "image/webp",
        upsert: true,
      });

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);

    if (error) throw error;
    await userRepository.updateUser(userId, { avatar: data.publicUrl });
  }

  async bulkSearch(filter: string) {
    return await userRepository.searchUsers(filter);
  }
}

export const userService = new UserService();
