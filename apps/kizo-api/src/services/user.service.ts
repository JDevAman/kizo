import { userRepository } from "@kizo/db";
import { UpdateProfileInput } from "@kizo/shared";
import { getSupabase } from "../lib/storage.js";
import sharp from "sharp";
import { Logger } from "@kizo/logger";

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

    await userRepository.updateUser(userId, updateData);
    return;
  }

  async uploadAvatar({
    userId,
    buffer,
    mime,
    log,
  }: {
    userId: string;
    buffer: Buffer;
    mime: string;
    log: Logger;
  }) {
    if (!ALLOWED_TYPES.includes(mime)) {
      log.warn({ userId, mime }, "Avatar upload rejected: Invalid type");
      throw new Error("Invalid file type");
    }

    const sharpStart = Date.now();
    const optimized = await sharp(buffer)
      .resize(256, 256, { fit: "cover" })
      .webp({ quality: 80 })
      .toBuffer();

    log.info(
      { duration: `${Date.now() - sharpStart}ms` },
      "Avatar image optimized",
    );

    const path = `avatars/${userId}/avatar.webp`;

    const { error } = await this.supabase.storage
      .from("avatars")
      .upload(path, optimized, {
        contentType: "image/webp",
        upsert: true,
      });
    const { data } = this.supabase.storage.from("avatars").getPublicUrl(path);

    if (error) {
      log.error(
        { userId, error: error.message },
        "Supabase storage upload failed",
      );
      throw error;
    }
    await userRepository.updateUser(userId, { avatar: data.publicUrl });
  }

  async bulkSearch(filter: string) {
    return await userRepository.searchUsers(filter);
  }
}

export const userService = new UserService();
