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

export default function getConfig(): AppConfig {
  if (cachedConfig) return cachedConfig;

  cachedConfig = {
    port: Number(process.env.WEBHOOKS_PORT ?? 3001),
    databaseUrl: requireEnv("DATABASE_URL"),
  };

  return cachedConfig;
}
