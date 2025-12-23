import { Request, Response } from "express";
import config from "../config";
import { schemas } from "@kizo/shared";
import { authService } from "../services/auth.service";

const ACCESS_MS = 15 * 60 * 1000;
const REFRESH_MS = config.refreshTokenExpiresDays * 24 * 60 * 60 * 1000;

// export const oauthCallback = (req: Request, res: Response) => {
//   // 1. Passport attaches the DB user object to req.user
//   const user = req.user as any;

//   if (!user) {
//     return res.status(401).json({ message: "Authentication failed" });
//   }

//   // 2. Generate JWT
//   const token = signjwt({
//     id: user.id,
//     email: user.userName,
//     firstName: user.firstName,
//     lastName: user.lastName,
//     avatar: user.avatar,
//   });

//   // 3. Set Access Token
//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     path: "/",
//     maxAge: 24 * 60 * 60 * 1000,
//   });

//   //4. Set Refresh Token

//   // 4. Send the Popup Closer Script
//   res.send(`
//     <html>
//       <body>
//         <script>
//           window.opener.postMessage({ success: true }, "${config.frontendURI}");
//           window.close();
//         </script>
//       </body>
//     </html>
//   `);
// };

export const signUp = async (req: Request, res: Response) => {
  try {
    const validation = schemas.SignupInput.safeParse(req.body);
    if (!validation.success) {
      return res.status(422).json({ message: "Invalid input data" });
    }
    const { user, accessToken, refreshToken } = await authService.signUp(
      validation.data
    );

    res.cookie(config.cookie.accessCookieName, accessToken, {
      httpOnly: true,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
      path: "/",
      maxAge: ACCESS_MS,
    });

    res.cookie(config.cookie.refreshCookieName, refreshToken, {
      httpOnly: true,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
      path: "/api/v1/auth/refresh",
      maxAge: REFRESH_MS,
    });

    return res.status(201).json({
      message: "User successfully created",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    const status = error.message === "User already exists!" ? 409 : 500;
    return res.status(status).json({ message: error.message });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const validation = schemas.SigninInput.safeParse(req.body);
    if (!validation.success)
      return res.status(422).json({ message: "Invalid input" });

    const { user, accessToken, refreshToken } = await authService.signIn(
      validation.data
    );

    res.cookie(config.cookie.accessCookieName, accessToken, {
      httpOnly: true,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
      path: "/",
      maxAge: ACCESS_MS,
    });

    res.cookie(config.cookie.refreshCookieName, refreshToken, {
      httpOnly: true,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
      path: "/api/v1/auth/refresh",
      maxAge: REFRESH_MS,
    });

    return res.status(200).json({
      message: "Logged in",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Try to remove from DB
      await authService.logout(refreshToken);
    }

    // Success response
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.error("Logout Error:", error);
    // Even if DB fails, we return 200 so the frontend feels "logged out"
    return res
      .status(200)
      .json({ message: "Logged out (Server cleanup failed)" });
  } finally {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken", { path: "/api/v1/auth/refresh" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies.refresh_token;

  if (!incomingRefreshToken) {
    return res.status(401).json({ message: "Refresh Token Missing" });
  }

  try {
    const { accessToken } =
      await authService.refreshAccessToken(incomingRefreshToken);
    // Send new Access Token
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ACCESS_MS,
      path: "/",
    });

    return res.json({ message: "Access token refreshed" });
  } catch (error: any) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken", { path: "/api/v1/auth/refresh" });
    return res
      .status(403)
      .json({ message: "Invalid Refresh Token, please login again" });
  }
};
