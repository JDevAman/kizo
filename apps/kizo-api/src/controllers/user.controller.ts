import { NextFunction, Request, Response } from "express";
import { userService } from "../services/user.service.js";
import { userRepository } from "@kizo/db";
import { invalidateProfileCache } from "../utils/cacheHelper.js";

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user.id;
  try {
    if (!userId) {
      const err: any = new Error("Unauthorized");
      err.status = 401;
      throw err;
    }

    await userService.updateProfile(userId, req.body);

    invalidateProfileCache(userId);
    req.log.info({ userId }, "Profile updated");
    return res.status(200).json({ message: "User profile updated" });
  } catch (error: any) {
    next(error);
  }
};

export const uploadAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user.id;
  const file = req.file;
  try {
    if (!userId) {
      const err: any = new Error("Unauthorized");
      err.status = 401;
      throw err;
    }

    if (!file) {
      const err: any = new Error("No file uploaded");
      err.status = 400;
      throw err;
    }

    await userService.uploadAvatar({
      userId,
      buffer: file.buffer,
      mime: file.mimetype,
      log: req.log,
    });

    invalidateProfileCache(req.user.id);
    req.log.info({ userId, mime: file.mimetype }, "Avatar uploaded");
    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userFromAuth = req.user;
    if (!userFromAuth) {
      const err: any = new Error("Not logged in");
      err.status = 401;
      throw err;
    }

    const user = await userRepository.findById(userFromAuth.id);
    if (!user) {
      const err: any = new Error("User No Longer Exists");
      err.status = 404;
      throw err;
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
    next(error);
  }
};

export const bulkSearch = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const filter = req.query.filter as string;
  const startTime = Date.now();
  try {
    if (!filter) {
      const err: any = new Error("Missing filter param");
      err.status = 400;
      throw err;
    }

    const users = await userService.bulkSearch(filter);
    req.log.info(
      {
        filter,
        resultsCount: users.length,
        duration: `${Date.now() - startTime}ms`,
      },
      "User bulk search completed",
    );
    return res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};
