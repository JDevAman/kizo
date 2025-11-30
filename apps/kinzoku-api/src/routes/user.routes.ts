import express from "express";
import authenticate from "../middlewares/authMiddleware";
import {
  signUp,
  signIn,
  refresh, 
  getMe,
  logout,
  updateProfile,
  bulkSearch,
} from "../controllers/user.controller";

const userRouter = express.Router();

// --- Public Routes ---
// These do not require a valid Access Token headers
userRouter.post("/signup", signUp);
userRouter.post("/signin", signIn);
userRouter.post("/refresh", refresh);

// --- Protected Routes ---
// These require a valid Access Token in Authorization header
userRouter.use(authenticate);

userRouter.get("/me", getMe);
userRouter.post("/logout", logout);
userRouter.put("/update-profile", updateProfile);
userRouter.get("/bulk", bulkSearch);

export default userRouter;