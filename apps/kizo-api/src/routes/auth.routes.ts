import { Router } from "express";
import authenticate from "../middlewares/authMiddleware.js";
import {
  logout,
  refresh,
  signIn,
  signUp,
} from "../controllers/auth.controller.js";

const authRouter: Router = Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.post("/refresh", refresh);

authRouter.use(authenticate);

authRouter.post("/logout", logout);

export default authRouter;
