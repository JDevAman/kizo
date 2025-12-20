# 🚀 Kizo —  Digital Wallet System

**Full-stack system showcasing backend architecture, infra, observability, and CI/CD best practices.**

Tech Stack

- **Backend:** Node.js (Express) , TypeScript, PostgreSQL, Prisma/Drizzle
- **Frontend:** React + TypeScript
- **Infra:** Docker, Docker Compose
- **Observability:** Prometheus, Grafana, Loki
- **Testing:** Vitest/Jest + Supertest
- **Tracing:** OpenTelemetry _(optional)_
- **Logging:** Pino
- **CI/CD:** GitHub Actions → Deploy to dev environment

---

# 📌 Overview

Kizo is a production-ready financial backend + dashboard system.
It solves:

- Authentication & RBAC
- Secure user & wallet management
- Structured logs / metrics / monitoring
- CI/CD pipelines
- Dev vs Prod deployment workflows

This repo demonstrates **how I architect real-world systems** — clean modules, observability-first, and testable design.

---

# 🧩 Architecture Diagram (High-Level)

```
          ┌──────────┐       ┌────────────┐
Frontend →│ API Layer│──────▶│ Controllers│
          └──────────┘       └────────────┘
                                  │
                                  ▼
                          ┌──────────────┐
                          │ Services     │
                          └──────────────┘
                                  │
                                  ▼
                         ┌────────────────┐
                         │ PostgreSQL DB  │
                         └────────────────┘

Infra:
Prometheus ← Metrics Exporter
Grafana ← Dashboards
Loki ← Structured Logs
GitHub Actions ← CI/CD
```

---

# 🛠 Features (MVP Tracker)

### ✅ Backend Core

| Feature                                    | Status         |
| ------------------------------------------ | -------------- |
| User authentication (JWT + refresh)        | 🟢 Done        |
| RBAC (User/Admin roles)                    | 🟢 Done        |
| CRUD modules (Users, Wallet, Transactions) | 🟡 In Progress |
| Pagination, search, filtering              | 🔴 Todo        |
| Structured logging (Pino/Winston)          | 🔴 Todo        |
| Global error handler                       | 🟢 Done        |
| Rate limiting + throttling                 | 🔴 Todo        |
| Validation (Zod/Validator)                 | 🟢 Done        |

---

### 🛢 Database & Migrations

| Feature                   | Status         |
| ------------------------- | -------------- |
| PostgreSQL schema design  | 🟢 Done        |
| Prisma migrations         | 🟢 Done        |
| Seed scripts              | 🔴 Todo  |

---

### 🧪 Testing

| Feature                        | Status         |
| ------------------------------ | -------------- |
| Unit tests (services & utils)  | 🟡 In Progress |
| Integration tests (auth, CRUD) | 🟡 In Progress |
| Supertest for API endpoints    | 🟡 In Progress |
| Test coverage reporting        | 🟡 In Progress |

---

### 📈 Observability

| Feature                                  | Status         |
| ---------------------------------------- | -------------- |
| Prometheus metrics endpoint (`/metrics`) | 🟡 In Progress |
| Grafana dashboards (latency, errors)     | 🟡 In Progress |
| Loki log aggregation                     | 🔴 Todo        |
| OpenTelemetry traces                     | 🔴 Optional    |

---

### ⚙️ CI/CD

| Feature                                            | Status                            |
| -------------------------------------------------- | --------------------------------- |
| GitHub Actions — Lint + Test on PR                 | 🟢 Added                          |
| Build backend + frontend                           | 🟡 In Progress                    |
| Auto deploy to dev environment (Railway/Render/VM) | 🟡 In Progress                    |
| Prod deployment                                    | 🔴 Limited (documented in README) |

---

### 🐳 Dockerization

| Feature                                          | Status         |
| ------------------------------------------------ | -------------- |
| Dockerfile backend                               | 🟡 In Progress |
| Dockerfile frontend                              | 🟡 In Progress |
| docker-compose (API + DB + Prometheus + Grafana) | 🟡 In Progress |

---

# 📁 Folder Structure

| Feature                                          | Status         |
| ------------------------------------------------ | -------------- |
| Dockerfile backend                               | 🟢 Done        |
| Dockerfile frontend                              | 🟢 Done        |
| docker-compose (API + DB + Prometheus + Grafana) | 🟡 In Progress |

---

# 📁 Folder Structure

```
kizo/
 ├─ apps/
 │   ├─ kizo-api/         # Node.js backend
 │   └─ kizo-web/         # React frontend
 ├─ infra/
 │   ├─ prometheus/
 │   ├─ grafana/
 │   └─ loki/
 ├─ docker/
 ├─ packages/             # shared configs (tsconfig, eslint, etc)
 └─ README.md
```
kizo/
 ├─ apps/
 │   ├─ kizo-api/         # Node.js backend
 │   └─ kizo-web/         # React frontend
 ├─ infra/
 │   ├─ prometheus/
 │   ├─ grafana/
 │   └─ loki/
 ├─ docker/
 ├─ packages/             # shared configs (tsconfig, eslint, etc)
 └─ README.md
```

---

# ▶️ Running Locally (Dev)

```
pnpm install
pnpm dev
```

Backend:

```
cd apps/kizo-api
pnpm dev
```

Prometheus + Grafana:

```
docker compose up -d
```

---

# 🔐 Authentication Model

- Access token (short-lived)
- Refresh token (long-lived)
- HttpOnly cookies
- RBAC: `USER`, `ADMIN`

---

# 📊 Metrics Overview (Prometheus)

Exported metrics:

- `http_request_duration_seconds`
- `http_requests_total`
- `process_cpu_usage`
- `db_pool_connections`
- `api_error_total`

Grafana dashboards included in `/infra/grafana/dashboards`.

---

# 🚀 Deployment

### Dev environment:

✔ automatically deployed from `main` branch
✔ full logs + metrics visible
✦ production minimized due to VM quotas (explained in this README)

### Production environment (Limited)

- Basic deployment works
- VM resource constraints limit uptime and load testing
- Documented transparently for recruiters

---

# 🧭 Roadmap

- Add distributed tracing (OpenTelemetry)
- Improve error taxonomy
- Add transaction ledger with idempotency keys

---

# 🤝 Contributing

PRs welcome!
Run locally with:

```
pnpm lint
pnpm test
pnpm dev
```
