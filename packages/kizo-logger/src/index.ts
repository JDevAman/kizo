import pino from "pino";

export const createLogger = (serviceName: string) => {
  const isProd = process.env.NODE_ENV === "production";
  const lokiUrl = process.env.LOKI_URL;

  // Configuration for standard JSON logging (fastest for Prod)
  const config: pino.LoggerOptions = {
    level: process.env.LOG_LEVEL || "info",
    messageKey: "msg",
    base: { service: serviceName }, // Includes service name in every log line
  };

  // Only enable Loki transport if we have a URL and aren't strictly avoiding it
  if (lokiUrl && !process.env.DISABLE_LOKI) {
    config.transport = {
      target: "pino-loki",
      options: {
        batching: false,
        interval: 5,
        host: lokiUrl,
        endpoint: "/loki/api/v1/push",
        silenceErrors: true,
        labels: { service: serviceName },
      },
    };
  } else if (!isProd) {
    // Optional: Pretty printing for local development only
    config.transport = {
      target: "pino-pretty",
      options: { colorize: true },
    };
  }

  return pino(config);
};

export type { Logger } from "pino";