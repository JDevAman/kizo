import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/tokens.js";
import getConfig from "../config.js";

// 💡 Use the Request type we extended in src/types/express.d.ts
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

    // 3. Populate req.user - TS now knows the shape!
    req.user = {
      id: decoded.id,
      email: decoded?.email || "", // Fallback if not in JWT
      role: decoded?.role || "user", // Future-proofing
    };

    next();
  } catch (err) {
    // 💡 Pro Tip: Handle specific JWT errors (TokenExpiredError vs JsonWebTokenError)
    return res.status(401).json({ message: "Session expired or invalid" });
  }
};
