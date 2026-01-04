import type { CookieOptions } from "express";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${name}`);
  }
  return value;
}

export type AppConfig = {
  jwtsecret: string;
  pepper: string;
  frontendURI: string;

  port: number;
  accessTokenExpiresIn: string;
  refreshTokenExpiresDays: number;
  databaseUrl: string;

  cookie: {
    accessCookieName: string;
    refreshCookieName: string;
    secure: boolean;
    sameSite: CookieOptions["sameSite"];
    domain: string;
  };

  maxAvatarSize: number;
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
};

let cachedConfig: AppConfig | null = null;

export default function getConfig(): AppConfig {
  if (cachedConfig) return cachedConfig;

  cachedConfig = {
    jwtsecret: requireEnv("JWT_SECRET"),
    pepper: requireEnv("PEPPER"),
    frontendURI: requireEnv("FRONTEND_URL"),

    port: Number(process.env.BE_PORT ?? 3000),
    accessTokenExpiresIn: requireEnv("ACCESS_EXPIRES"),
    refreshTokenExpiresDays: Number(process.env.REFRESH_DAYS ?? 7),
    databaseUrl: requireEnv("DATABASE_URL"),

    cookie: {
      accessCookieName: "access_token",
      refreshCookieName: "refresh_token",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain: process.env.NODE_ENV === "production" ? requireEnv("DOMAIN") : ""
    },

    maxAvatarSize: Number(process.env.MAX_AVATAR_SIZE ?? 5_000_000),

    supabaseUrl: requireEnv("SUPABASE_URL"),
    supabaseServiceRoleKey: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  };

  return cachedConfig;
}
