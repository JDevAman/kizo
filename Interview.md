# Interview Prep

## QUESTIONS

### DATABASES – Cross Questions Interviewers Will Ask

1. What happens if two transactions try to debit the same account at exactly the same time? Walk me through the exact sequence of locks and isolation level you used.
2. Did you use SERIALIZABLE isolation level anywhere? Why or why not? What are the performance implications?
3. What if the SELECT FOR UPDATE deadlocks? How do you detect it? How do you recover? Did you ever see it in stress tests?
4. How long does a typical transaction hold the row lock? What's the worst-case lock duration you measured?
5. What indexing strategy did you use on the transactions/ledger table? Did you add composite indexes? Covering indexes?
6. How do you prevent negative balances without application-level checks? (Pure DB constraint or trigger?)
7. If Postgres crashes mid-transaction, what guarantees do you have? WAL? How did you test crash recovery?

### Redis & Caching – Cross Questions

1. You said payments and balances are never cached — what if someone asks for balance 10 times per second? How do you protect the DB?
2. How do you handle cache stampede / thundering herd when TTL expires on popular profiles?
3. Write-through vs write-back — why did you choose write-through for profile updates? Trade-offs?
4. What happens if Redis goes down? Does the app still work correctly? Read path? Write path?
5. How do you monitor Redis memory usage and eviction? Did you ever hit OOM in tests?
6. Rate limiting with Redis sliding window — how exactly did you implement the counter? Lua script? Multi-key?

### BullMQ & Background Jobs – Cross Questions

1. What happens if the worker crashes while processing a job? Is the job retried? With backoff? How many times?
2. How do you handle poison messages / jobs that always fail?
3. How do you ensure exactly-once semantics when calling the mock bank? (idempotency key again?)
4. Reconciliation Janitor — what if it finds 10,000 stuck transactions? Does it overwhelm the queue? Throttling?
5. How do you monitor job backlog / queue depth / processing latency? Prometheus metrics? Alerts?
6. Worker concurrency = 50 — how did you decide 50? CPU-bound or I/O-bound? What metrics guided it?
7. What happens during deployment? Do you drain old workers gracefully? Zero-downtime strategy?

### General System Design & Trade-off Probes

1. Why Postgres + Redis instead of just Postgres with LISTEN/NOTIFY or pg_cron?
2. What’s the single point of failure right now? How would you make it highly available tomorrow?
3. Scale to 10,000 concurrent users — what breaks first? How would you fix it?
4. How would you add multi-currency support tomorrow? Schema changes? Locking strategy?
5. Fraud detection — any hooks or patterns you built in (velocity checks, amount anomalies)?
6. PII / sensitive data — how are you encrypting at rest? In transit? Secrets management?
7. Observability cost — Prometheus + Grafana + Loki on a single VM — when does it become a problem?
8. One production incident you simulated or imagined — what broke, how did you debug it fast?

## ANSWERS

## QnA

1. How did you handle Double Transactions?
   Used PostgreSQL Row-Level Locking (SELECT ... FOR UPDATE) within a database transaction. This ensures that when a balance is being updated, no other process can modify that specific user's row until the transaction commits or rolls back.

2. You have added Redis and BullMQ. How will you handle the Dual Write Problem?
   I implement the Transactional Outbox Pattern. Instead of writing to the DB and Redis separately (where one could fail), I write the "Intent" to a bank_transfers table in the same DB transaction as the balance update. A secondary process (or CDC tool) then ensures that record is pushed to BullMQ.

3. How did you find which APIs to cache?
   Focused on high Read-to-Write ratio endpoints (e.g., User Profile, static metadata). Payments and Balances are never cached to ensure 100% data freshness and consistency.

4. How did you decide TTL (Time-to-Live)?
   User Profile: 10 mins (Rarely changes).
   User Dashboard: 5 mins (Balance is fetched live, but layout/history metadata is cached).

5. How are you handling Cache Invalidation?
   Implemented Write-through caching for profile updates and Manual Invalidation (Purge) on sensitive metadata updates to prevent stale data.

6. How did you optimize worker throughput?
   Identified a processing bottleneck where the worker was handling 1 job at a time. Increased Worker Concurrency to 50, allowing the system to drain a 2,000+ transaction backlog in seconds by utilizing the server's idle I/O wait time.

7. What is the "Recon Job" (Reconciliation Janitor)?
   A Cron job running every 30 minutes (_/30 _ \* \* \*) that audits the database for any transactions stuck in a PROCESSING state for too long. It ensures system self-healing by re-queueing stalled jobs or flagging them for manual review.
