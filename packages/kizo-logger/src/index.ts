import pino from "pino";

export const createLogger = (serviceName: string) => {
  return pino({
    level: process.env.LOG_LEVEL,
    messageKey: "msg",
    transport: {
      target: "pino-loki",
      options: {
        batching: false,
        interval: 5,
        host: process.env.LOKI_URL || "http://loki:3100",
        endpoint: "/loki/api/v1/push",
        silenceErrors: true,
        labels: { service: serviceName },
      },
    },
  });
};

export type { Logger } from "pino";
