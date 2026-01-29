import pino from "pino";

export const createLogger = (serviceName: string) => {
  return pino({
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
};
