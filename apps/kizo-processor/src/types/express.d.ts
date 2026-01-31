declare global {
  namespace Express {
    interface Request {
      traceId: string;
      log: Logger;
    }
  }
}

export {};
