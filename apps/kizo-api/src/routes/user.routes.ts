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

const userRouter = express.Router();

// --- Protected Routes ---
userRouter.use(authenticate);

userRouter.get("/me", cacheMiddleware("user:profile", 600), getMe);
userRouter.put("/update-profile", updateProfile);
userRouter.post("/avatar", avatarUpload.single("avatar"), uploadAvatar);
userRouter.get("/bulk", bulkSearch);

export default userRouter;
