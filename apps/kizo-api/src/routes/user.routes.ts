import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  getMe,
  updateProfile,
  bulkSearch,
  uploadAvatar,
} from "../controllers/user.controller.js";
import { avatarUpload } from "../middlewares/fileMiddleware.js";
import { cacheMiddleware } from "../middlewares/cacheMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { schemas } from "@kizo/shared";

const userRouter = express.Router();

// --- Protected Routes ---
userRouter.use(authenticate);

userRouter.get("/me", cacheMiddleware("user:profile", 600), getMe);
userRouter.put(
  "/update-profile",
  validate({ body: schemas.UpdateProfileInput }),
  updateProfile,
);
userRouter.post("/avatar", avatarUpload.single("avatar"), uploadAvatar);
userRouter.get("/bulk", bulkSearch);

export default userRouter;
