import { createClient, type RedisClientType } from "redis";
import { Queue, Worker, type Processor } from "bullmq";

// 1. Connection Logic
const REDIS_URL = process.env.REDIS_URL;

// 2. The Producer (API uses this)
export const transactionQueue = new Queue("TRANSACTION_QUEUE", {
  connection: {
    url: REDIS_URL,
  },
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: true,
  },
});

// 3. The Consumer Factory (Worker uses this)
export const createTransactionWorker = (name: string, processor: Processor) => {
  return new Worker(name, processor, {
    connection: { url: REDIS_URL },
    concurrency: 50,
    lockDuration: 30000,
  });
};

// 4. Cache Client (node-redis for your middlewares)
export type KizoRedisClient = RedisClientType;
let redisClient: KizoRedisClient | null = null;

export function getRedis(): KizoRedisClient {
  if (!redisClient) {
    redisClient = createClient({ url: REDIS_URL });
  }
  return redisClient;
}
