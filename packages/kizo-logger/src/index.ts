import pino from "pino";

export const createLogger = (serviceName: string) => {
  const forceOTel = true;

  return pino({
    level: process.env.LOG_LEVEL || "info",
    messageKey: "msg",
    transport: forceOTel
      ? {
          target: "pino-loki",
          options: {
            batching: true,
            interval: 5,
            host: "http://localhost:3100", // Direct to Loki
            labels: { service: serviceName },
          },
        }
      : { target: "pino-pretty", options: { colorize: true } },
  });
};
