import pino from "pino";

const serviceName = process.env.SERVICE_NAME || "kizo-service";

export const logger = pino({
  name: serviceName,
  level: process.env.LOG_LEVEL || "info",
  base: {
    service: serviceName,
    env: process.env.NODE_ENV,
    pid: process.pid,
  },
  transport:
    process.env.NODE_ENV === "development"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
});
