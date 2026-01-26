import { Request, Response } from "express";
import { userService } from "../services/user.service.js";
import { userRepository } from "../repositories/user.repository.js";
import { invalidateProfileCache } from "../utils/cacheHelper.js";

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await userService.updateProfile(currentUser.id, req.body);

    invalidateProfileCache(req.user.id);

    return res.status(200).json({ message: "User profile updated" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const file = req.file; // multer
    if (!file) return res.status(400).json({ message: "No file" });

    await userService.uploadAvatar({
      userId: currentUser.id,
      buffer: file.buffer,
      mime: file.mimetype,
    });

    invalidateProfileCache(req.user.id);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userFromAuth = req.user;
    if (!userFromAuth)
      return res.status(401).json({ message: "Not logged in" });

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
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
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
