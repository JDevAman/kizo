export type AppConfig = {
  port: number;
};

let cachedConfig: AppConfig | null = null;

export default function getConfig(): AppConfig {
  if (cachedConfig) return cachedConfig;

  cachedConfig = {
    port: Number(process.env.WEBHOOKS_PORT ?? 3001),
  };

  return cachedConfig;
}
