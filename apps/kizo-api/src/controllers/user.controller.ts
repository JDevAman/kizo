import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { schemas } from "@kizo/shared/generated/zod-schemas";
import { userRepository } from "../repositories/user.repository";
import config from "../config";

const ACCESS_MS = 15 * 60 * 1000;

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const validation = schemas.UpdateProfileInput.safeParse(req.body);
    if (!validation.success) {
      return res.status(422).json({ message: "Invalid profile data" });
    }

    // @ts-ignore
    const currentUser = req.user;

    const result = await userService.updateProfile(
      currentUser.id,
      validation.data
    );

    // ✅ FIX 4: Only update Access Token (Refresh token stays same)
    // Note: UserService needs to return just the token here
    res.cookie(config.cookie.accessCookieName, result.token, {
      httpOnly: true,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
      path: "/",
      maxAge: ACCESS_MS,
    });

    return res.status(200).json({ message: "User profile updated" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const uploadUrl = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      res.status(401).json({ message: "Unauthorized" });
    }

    const { fileName, contentType, size } = req.body;

    if (!fileName || !contentType || !size) {
      return res.status(400).json({ message: "Missing file metadata" });
    }

    const result = await userService.generateUploadUrl({
      userId: currentUser.id,
      fileName,
      contentType,
      size,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Failed to generate URL" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  // @ts-ignore
  const userFromAuth = req.user;
  if (!userFromAuth) return res.status(401).json({ message: "Not logged in" });

  const user = await userRepository.findById(userFromAuth.id);
  if (!user) {
    return res.status(404).json({ message: "User no longer exists" });
  }

  return res.status(200).json({
    message: "User Profile Fetched",
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
};

export const bulkSearch = async (req: Request, res: Response) => {
  try {
    const filter = req.query.filter as string;
    if (!filter)
      return res.status(400).json({ message: "Missing filter param" });

    const users = await userService.bulkSearch(filter);
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
