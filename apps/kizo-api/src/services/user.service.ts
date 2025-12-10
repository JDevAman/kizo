import argon2 from "argon2";
import config from "../config";
import { v4 as uuidv4 } from "uuid";
import { userRepository } from "../repositories/user.repository";
import { signAccessToken } from "../utils/tokens";
import { SignupInput, SigninInput } from "@kinzoku/shared";

export class UserService {
  async updateProfile(userId: string, payload: updateUserSchema) {
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
    const token = signAccessToken({
      id: updatedUser.id,
    });

    return { token };
  }

  async bulkSearch(filter: string) {
    return await userRepository.searchUsers(filter);
  }
}

export const userService = new UserService();
