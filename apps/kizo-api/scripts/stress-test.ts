import axios from "axios";
import pLimit from "p-limit";
import { createLogger } from "@kizo/logger";

const logger = createLogger("stress-tester");
const API_URL = "http://localhost:3000/api/v1";
const CONCURRENCY = 50; // How many users acting at the exact same time
const limit = pLimit(CONCURRENCY);

async function simulateUser(index: number) {
  const email = `user-${index}@kizo.dev`;
  const password = "password123";

  try {
    // 1. LOGIN
    const authRes = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    const token = authRes.data.accessToken;
    const userId = authRes.data.user.id;

    // 2. PERFORM TRANSACTION (P2P Transfer)
    // Sending 100 subunits to a "Target" (e.g., User 0)
    await axios.post(
      `${API_URL}/transactions/p2p`,
      { toUserId: "target-user-uuid-here", amount: 100 },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    logger.info({ email }, "✅ Login & Transfer Successful");
  } catch (error: any) {
    logger.error(
      { email, error: error.response?.data || error.message },
      "❌ Flow Failed",
    );
  }
}

async function run() {
  logger.info("🚀 Starting Stress Test for 5000 users...");

  const tasks = Array.from({ length: 5000 }).map((_, i) =>
    limit(() => simulateUser(i)),
  );

  await Promise.all(tasks);
  logger.info("🏁 Stress Test Complete");
}

run();
