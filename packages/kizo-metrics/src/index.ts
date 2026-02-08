import client from "prom-client";

client.collectDefaultMetrics();
const buckets = [0.005, 0.01, 0.025, 0.05, 0.1, 0.5, 1, 2, 5];
// 💡 Existing: Tracks API P95/P99
export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code", "service"],
  buckets,
});

// 💡 New: Tracks Background Worker P95/P99
export const workerDuration = new client.Histogram({
  name: "worker_job_duration_seconds",
  help: "Duration of background jobs in seconds",
  labelNames: ["job_name", "queue", "status"],
  buckets,
});

export { client as prometheus };
