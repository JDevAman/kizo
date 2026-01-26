import { getRedis } from "@kizo/db";

const invalidateProfileCache = async (userId: string) => {
  const redis = getRedis();
  const key = `user:profile:${userId}`;
  await redis.del(key);
};

const invalidateDashboardCache = async (userId: string) => {
  const redis = getRedis();
  const key = `user:dash:${userId}`;
  await redis.del(key);
};

export { invalidateDashboardCache, invalidateProfileCache };
