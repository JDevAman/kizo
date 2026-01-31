import { AuthUser as KizoUser } from "@kizo/shared";

declare global {
  namespace Express {
    interface User extends KizoUser {}

    interface Request {
      user: KizoUser;
    }
  }
}

export {};
