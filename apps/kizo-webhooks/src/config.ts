import dotenv from "dotenv";

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${name}`);
  }
  return value;
}

export type AppConfig = {
  port: number;
  databaseUrl: string;
};

let cachedConfig: AppConfig | null = null;

/**
 * Lazy-loaded config
 * ✔ No env access at import time
 * ✔ Clean ESM startup
 * ✔ Clear error messages
 */
export default function getConfig(): AppConfig {
  if (cachedConfig) return cachedConfig;

  cachedConfig = {
    port: Number(process.env.PORT ?? 3001),
    databaseUrl: requireEnv("DATABASE_URL"),
  };

  return cachedConfig;
}
