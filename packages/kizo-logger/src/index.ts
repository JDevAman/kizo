import pino from "pino";

export const createLogger = (serviceName: string) => {
  const forceOTel = true;

  return pino({
    level: process.env.LOG_LEVEL,
    messageKey: "msg",
    transport: forceOTel
      ? {
          target: "pino-loki",
          options: {
            batching: true,
            interval: 5,
            host: (process.env.LOKI_URL || 'http://kizo-loki:3100').replace(/\/$/, ""),
            labels: { service: serviceName },
          },
        }
      : { target: "pino-pretty", options: { colorize: true } },
  });
};

export type { Logger } from "pino";
