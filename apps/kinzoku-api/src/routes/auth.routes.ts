import { Router } from "express";
import passport from "passport";
import { oauthCallback } from "../controllers/auth.controller";
import "../config/passport"; 

const authRouter = Router();

// --- Google ---
// 1. Triggers the redirect to Google
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// 2. Google redirects back here -> Passport verifies code -> Calls your oauthCallback
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  oauthCallback
);

// --- GitHub ---
authRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

authRouter.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  oauthCallback
);

export default authRouter;