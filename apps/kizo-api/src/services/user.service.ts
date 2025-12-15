import { userRepository } from "../repositories/user.repository";
import { signAccessToken } from "../utils/tokens";
import { UpdateProfileInput } from "@kizo/shared";

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

  async generateUploadUrl(userId: string) {
    const fileName = `avatars/${userId}/${uuidv4()}.jpg`;
    const file = bucket.file(fileName);

    const [uploadUrl] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
      contentType: "image/*",
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    return { uploadUrl, publicUrl };
  }

  async bulkSearch(filter: string) {
    return await userRepository.searchUsers(filter);
  }
}

export const userService = new UserService();
