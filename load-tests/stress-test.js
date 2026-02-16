import http from "k6/http";
import { check, sleep, group } from "k6";
import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";

export const options = {
  stages: [
    { duration: "20s", target: 100 },
    { duration: "1m", target: 100 },
    { duration: "20s", target: 0 },
  ],
  thresholds: {
    "http_req_duration{module:auth}": ["p(99)<2000"], // Auth (Argon2) is expected to be slower
    "http_req_duration{module:payment}": ["p(99)<500"], // Payments should be fast
    "http_req_duration{module:dashboard}": ["p(99)<200"],
  },
};

const BASE_URL = "http://localhost:3000/api/v1";

export default function () {
  const userId = Math.floor(Math.random() * 5000);
  const email = `user-${userId}@kizo.dev`;

  const baseParams = { headers: { "Content-Type": "application/json" } };

  // --- AUTH MODULE ---
  group("Auth Module", function () {
    const loginRes = http.post(
      `${BASE_URL}/auth/signin`,
      JSON.stringify({
        email,
        password: "password123",
      }),
      { ...baseParams, tags: { module: "auth" } },
    );

    check(loginRes, { "Signin 200": (r) => r.status === 200 });
  });

  // --- DASHBOARD MODULE ---
  group("Dashboard Module", function () {
    const dashRes = http.get(`${BASE_URL}/dashboard`, {
      ...baseParams,
      tags: { module: "dashboard" },
    });

    check(dashRes, { "Dashboard 200": (r) => r.status === 200 });
  });

  // Transactions
  group("Transaction Module", function () {
    const transRes = http.get(`${BASE_URL}/transaction`, {
      ...baseParams,
      tags: { module: "transactions" },
    });
    check(transRes, { "Transactions 200": (r) => r.status === 200 });
  });

  // --- PAYMENT MODULE ---
  group("Payment Module", function () {
    const payParams = (name) => ({
      headers: { ...baseParams.headers, "Idempotency-Key": uuidv4() },
      tags: { module: "payment", name: name },
    });

    const deposit = http.post(
      `${BASE_URL}/payment/deposit`,
      JSON.stringify({ amount: 100 }),
      payParams("deposit"),
    );
    const transfer = http.post(
      `${BASE_URL}/payment/transfer`,
      JSON.stringify({ recipient: "corporate@kizo.dev", amount: 10 }),
      payParams("transfer"),
    );

    check(deposit, { "Deposit 200": (r) => r.status === 200 });
    check(transfer, {
      "Transfer 200/202": (r) => r.status === 200 || r.status === 202,
    });
  });

  sleep(1);
}
