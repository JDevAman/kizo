import express from "express";
import authenticate from "../middlewares/authMiddleware";
import {
  getMe,
  updateProfile,
  bulkSearch,
  uploadAvatar,
} from "../controllers/user.controller";
import { avatarUpload } from "../middlewares/fileMiddleware";

const userRouter = express.Router();

// --- Protected Routes ---
// These require a valid Access Token in Authorization header
userRouter.use(authenticate);

userRouter.get("/me", getMe);
userRouter.put("/update-profile", updateProfile);
userRouter.post("/avatar", avatarUpload.single("avatar"), uploadAvatar);
userRouter.get("/bulk", bulkSearch);

export default userRouter;
