declare global {
  namespace Express {
    interface Request {
      user: KizoUser;
      traceId: string;
      log: Logger;
    }
  }
}

export {};
