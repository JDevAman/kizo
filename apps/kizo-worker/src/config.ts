export type AppConfig = {
  baseUrl: string;
};

let cachedConfig: AppConfig | null = null;

export function getConfig(): AppConfig | null {
  if (cachedConfig) return cachedConfig;

  cachedConfig = {
    baseUrl: process.env.WEBHOOK_BASE_URL ?? "http://localhost:3001",
  };
  return cachedConfig;
}
