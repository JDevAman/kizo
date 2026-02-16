import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/tokens.js";
import getConfig from "../config.js";

const config = getConfig();
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.method === "OPTIONS") return next();

  const token = req.cookies[config.cookie.accessCookieName];

  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }

  try {
    const decoded = verifyAccessToken(token);

    if (!decoded || typeof decoded !== "object" || !decoded.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }
    req.user = {
      id: decoded.id,
      email: decoded?.email,
      role: decoded?.role,
    };

    next();
  } catch (err) {
    // 💡 Pro Tip: Handle specific JWT errors (TokenExpiredError vs JsonWebTokenError)
    return res.status(401).json({ message: "Session expired or invalid" });
  }
};
