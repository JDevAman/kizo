import type { CookieOptions } from "express";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${name}`);
  }
  return value;
}

export type AppConfig = {
  accessTokenExpiresIn: string;
  accessTokenPath: string;
  beport: number;

  cookie: {
    accessCookieName: string;
    refreshCookieName: string;
    secure: boolean;
    sameSite: CookieOptions["sameSite"];
    domain: string;
  };

  databaseUrl: string;
  frontendURL: string;
  jwtsecret: string;
  maxAvatarSize: number;
  pepper: string;

  refreshTokenExpiresDays: number;
  refreshTokenPath: string;
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
};

let cachedConfig: AppConfig | null = null;

export default function getConfig(): AppConfig {
  if (cachedConfig) return cachedConfig;

  cachedConfig = {
    accessTokenExpiresIn: requireEnv("ACCESS_EXPIRES"),
    accessTokenPath: requireEnv("ACCESS_TOKEN_PATH"),
    beport: Number(process.env.BE_PORT),

    cookie: {
      accessCookieName: "access_token",
      refreshCookieName: "refresh_token",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain:
        process.env.NODE_ENV === "production"
          ? requireEnv("DOMAIN")
          : "localhost",
    },

    databaseUrl: requireEnv("DATABASE_URL"),
    frontendURL: requireEnv("FRONTEND_URL"),
    pepper: requireEnv("PEPPER"),
    jwtsecret: requireEnv("JWT_SECRET"),
    maxAvatarSize: Number(process.env.MAX_AVATAR_SIZE ?? 5_000_000),
    refreshTokenExpiresDays: Number(process.env.REFRESH_DAYS),
    refreshTokenPath: requireEnv("REFRESH_TOKEN_PATH"),
    supabaseUrl: requireEnv("SUPABASE_URL"),
    supabaseServiceRoleKey: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  };

  return cachedConfig;
}
