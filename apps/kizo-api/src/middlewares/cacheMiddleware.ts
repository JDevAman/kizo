import { getRedis } from "@kizo/db";
import { NextFunction, Request, Response } from "express";

export const cacheMiddleware = (keyPrefix: string, ttl = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) return next();

    const cacheKey = `${keyPrefix}:${userId}`;
    const redis = getRedis();
    try {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      const originalJson = res.json;

      res.json = (body: any): Response => {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redis
            .set(cacheKey, JSON.stringify(body), {
              EX: ttl,
            })
            .catch((err) => console.error("Redis Set Error:", err));
        }
        return originalJson.call(res, body);
      };

      next();
    } catch (error) {
      console.error("Cache Middleware Error:", error);
      next(); // Fallback to DB if Redis fails
    }
  };
};
