import express from "express";
import authenticate from "../middlewares/authMiddleware";
import {
  getMe,
  updateProfile,
  bulkSearch,
  uploadUrl,
} from "../controllers/user.controller";

const userRouter = express.Router();

// --- Protected Routes ---
// These require a valid Access Token in Authorization header
userRouter.use(authenticate);

userRouter.get("/me", getMe);
userRouter.put("/update-profile", updateProfile);
userRouter.post("/avatar/upload-url", uploadUrl);
userRouter.get("/bulk", bulkSearch);

export default userRouter;
