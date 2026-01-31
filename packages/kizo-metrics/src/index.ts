import client from "prom-client";

client.collectDefaultMetrics();

// 💡 Existing: Tracks API P95/P99
export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5],
});

// 💡 New: Tracks Background Worker P95/P99
export const workerDuration = new client.Histogram({
  name: "worker_job_duration_seconds",
  help: "Duration of background jobs in seconds",
  labelNames: ["jobName"],
  buckets: [0.1, 0.5, 1, 2, 5, 10], // Added 10s bucket for heavy bank hangs
});

export { client as prometheus };
