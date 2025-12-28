import { userRepository } from "../repositories/user.repository.js";
import { signAccessToken } from "../utils/tokens.js";
import { schemas, UpdateProfileInput } from "@kizo/shared";
import { getSupabase } from "../lib/storage.js";
import sharp from "sharp";
import z from "zod";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export class UserService {
  private get supabase() {
    return getSupabase();
  }
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

    const { error } = await this.supabase.storage
      .from("avatars")
      .upload(path, optimized, {
        contentType: "image/webp",
        upsert: true,
      });

    const { data } = this.supabase.storage.from("avatars").getPublicUrl(path);

    if (error) throw error;
    await userRepository.updateUser(userId, { avatar: data.publicUrl });
  }

  async bulkSearch(filter: string) {
    return await userRepository.searchUsers(filter);
  }
}

export const userService = new UserService();
