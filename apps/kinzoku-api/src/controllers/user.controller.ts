import { Request, Response } from "express";
import { userService } from "../services/user.service";
import {
  signupInput,      // Value (for .safeParse)
  signinInput,      // Value
  updateProfileInput // Value
} from "@kinzoku/shared";

const ACCESS_TOKEN_MS = 15 * 60 * 1000; // 15 mins
const REFRESH_TOKEN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const signUp = async (req: Request, res: Response) => {
  try {
    const validation = signupInput.safeParse(req.body);
    if (!validation.success) {
      return res.status(422).json({ message: "Invalid input data" });
    }

    // ✅ FIX 1: SignUp now returns both tokens (User is auto-logged in)
    // Make sure your userService.signUp also returns { user, accessToken, refreshToken }
    const { user, accessToken, refreshToken } = await userService.signUp(validation.data);

    // ✅ FIX 2: Send Dual Cookies (Same as SignIn)
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_MS,
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_MS,
      path: "/api/v1/auth", // Restricted path
    });

    return res.status(201).json({
      message: "User successfully created",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.userName,
        role: user.role,
      },
    });
  } catch (error: any) {
    const status = error.message === "User already exists!" ? 409 : 500;
    return res.status(status).json({ message: error.message });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const validation = signinInput.safeParse(req.body);
    if (!validation.success) return res.status(422).json({ message: "Invalid input" });

    const { user, accessToken, refreshToken } = await userService.signIn(validation.data);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_MS,
      path: "/"
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_MS,
      path: "/api/v1/auth"
    });

    return res.status(200).json({
      message: "Logged in",
      user: { id: user.id, email: user.userName, role: user.role }
    });
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json({ message: "Refresh Token Missing" });
  }

  try {
    const { accessToken } = await userService.refreshAccessToken(incomingRefreshToken);

    // Send new Access Token
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_MS,
      path: "/",
    });

    return res.json({ message: "Access token refreshed" });
  } catch (error: any) {
    // If refresh fails, clear everything so user is forced to login
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken", { path: "/api/v1/auth" });
    return res.status(403).json({ message: "Invalid Refresh Token, please login again" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const validation = updateProfileInput.safeParse(req.body);
    if (!validation.success) {
      return res.status(422).json({ message: "Invalid profile data" });
    }

    // @ts-ignore
    const currentUser = req.user;

    const result = await userService.updateProfile(
      currentUser.id,
      currentUser.email,
      validation.data
    );

    // ✅ FIX 4: Only update Access Token (Refresh token stays same)
    // Note: UserService needs to return just the token here
    res.cookie("accessToken", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: ACCESS_TOKEN_MS,
        path: "/",
    });

    return res.status(200).json({ message: "User profile updated" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMe = (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user;
  if (!user) return res.status(401).json({ message: "Not logged in" });

  return res.status(200).json({
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      role: user.role, // Added role
    },
  });
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      // Try to remove from DB
      await userService.logout(refreshToken);
    }
    
    // Success response
    return res.status(200).json({ message: "Logged out successfully" });

  } catch (error: any) {
    console.error("Logout Error:", error);
    // Even if DB fails, we return 200 so the frontend feels "logged out"
    return res.status(200).json({ message: "Logged out (Server cleanup failed)" });
  } finally {
    // ✅ CRITICAL: Always clear cookies, even if DB explodes
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken", { path: "/api/v1/auth" });
  }
};

export const bulkSearch = async (req: Request, res: Response) => {
  try {
    const filter = req.query.filter as string;
    if (!filter) return res.status(400).json({ message: "Missing filter param" });

    const users = await userService.bulkSearch(filter);
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};