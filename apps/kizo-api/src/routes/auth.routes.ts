import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  logout,
  refresh,
  signIn,
  signUp,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { schemas } from "@kizo/shared";

const authRouter: Router = Router();

authRouter.post("/signup", validate({ body: schemas.SignupInput }), signUp);
authRouter.post("/signin", validate({ body: schemas.SigninInput }), signIn);
authRouter.post("/refresh", refresh);

authRouter.use(authenticate);

authRouter.post("/logout", logout);

export default authRouter;
