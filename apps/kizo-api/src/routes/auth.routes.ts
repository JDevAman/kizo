import { Router } from "express";
import authenticate from "../middlewares/authMiddleware";
import {
  logout,
  refresh,
  signIn,
  signUp,
} from "../controllers/auth.controller";

const authRouter: Router = Router();

authRouter.post("/signup", signUp);
authRouter.post("/siginin", signIn);
authRouter.post("/refresh", refresh);

authRouter.use(authenticate);

authRouter.post("/logout", logout);

export default authRouter;
