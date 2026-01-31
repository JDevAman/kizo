// @kizo/api/src/middleware/trace.middleware.ts
import { v4 as uuidv4 } from "uuid";
import { logger } from "../server.js";

export const traceMiddleware = (req, res, next) => {
  const traceId = uuidv4();
  req.traceId = traceId;
  req.log = logger.child({ traceId });
  res.setHeader("x-trace-id", traceId);
  next();
};
