# 🚀 Kizo — Production-Grade Digital Wallet System

> **Not a tutorial app. Not a CRUD demo.**
> Kizo is a real-world digital wallet system designed to demonstrate scalable, observable, and failure-tolerant architecture.

[![Status](https://img.shields.io/badge/Status-V1_Stable-success)]()
[![Stack](https://img.shields.io/badge/Stack-PERN_%2B_Astro-blue)]()

---

## 🌍 Live Demo

- **Landing Page (Astro):** [kizo.devaman.space](https://kizo.devaman.space)
- **Web Application (React):** [app.kizo.devaman.space](https://app.kizo.devaman.space)
- **Developer Portfolio:** [devaman.space](https://devaman.space)

---

## 🎯 Why Kizo Exists

Most "full-stack projects" stop at basic auth and happy-path flows. Kizo goes further. It is built to mirror how real companies run financial systems—handling concurrency, ensuring consistency, and planning for failure.

This project represents my approach as a Full-Stack Engineer: **breaking systems, fixing bottlenecks, making trade-offs, and prioritizing correctness over feature bloat.**

### 🧠 Engineering Philosophy

- **Correctness > Features:** Idempotency and data consistency take precedence over UI flashiness.
- **Observability First:** Logging and metrics are architectural requirements, not afterthoughts.
- **Simple First, Extensible Later:** No premature optimization, but clear pathways for V2 scaling.
- **AI-Assisted, Human-Architected:** I use tools like ChatGPT/v0.dev to accelerate coding, but **all architectural decisions, validations, and edge case handling are mine.**

---

## 🌐 System Architecture

Designed with a clear separation of concerns, optimized for SEO on the public face and performance on the dashboard.

```mermaid
graph TD
    User((Public User))
    AuthUser((Auth User))

    subgraph "Frontend Layer"
        Astro[Astro Landing Page]
        React[React Dashboard]
    end

    subgraph "Backend Layer"
        Express[Express API Gateway]
        Services[Domain Services]
    end

    subgraph "Data Layer"
        Postgres[(PostgreSQL)]
    end

    User -->|SEO Content| Astro
    AuthUser -->|SPA Interaction| React
    React -->|REST / JWT| Express
    Express -->|Business Logic| Services
    Services -->|Transactions| Postgres

```

---

## 🏗️ Tech Stack

### Backend

- **Node.js + Express:** API Layer.
- **TypeScript:** Type safety across the stack.
- **PostgreSQL:** Relational data for users and wallets.
- **Prisma + Raw SQL:** Prisma for standard CRUD; **Raw SQL** used specifically for high-performance queries where ORM overhead is unacceptable.
- **Auth:** JWT + Refresh Token rotation with RBAC.

### Frontend

- **React + TypeScript:** Main application dashboard.
- **Astro:** Static/SSR hybrid for high-performance, SEO-friendly landing pages.
- **Redux Toolkit + Axios:** State management and networking.
- **Optimization:** Lazy loading & route-based code splitting.

### Infra & Tooling

- **GitHub Actions:** CI/CD pipelines.
- **Docker:** Containerization (selective usage).
- **OpenAPI:** Standardized API documentation.
- **Testing:** Unit + Integration testing strategy.

---

## 🔍 Key Engineering Decisions & Trade-offs

### 1. Raw SQL vs. ORM

While Prisma is used for schema management and basic queries, I explicitly use **Raw SQL** for complex dashboard aggregations and financial transactions. This ensures control over the generated queries and performance optimization that ORMs often obscure.

### 2. Idempotent Money Flows

The system implements idempotency keys to prevent double-spending or duplicate transactions during network retries—a critical requirement for any fintech application.

### 3. V1 vs. V2 Strategy

I avoided over-engineering the V1. For example, message queues (Redis/BullMQ) are reserved for the V2 roadmap to handle bank downtime scenarios. V1 focuses on strong ACID compliance within the database.

---

## 🧩 Monorepo Structure

```bash
kizo/
├── apps/
│   ├── kizo-api/       # Express backend + Bank mock
│   ├── kizo-web/       # React application (Dashboard)
│   └── kizo-landing/   # Astro public site
├── infra/              # Observability configs (Prometheus/Grafana)
├── docker/             # Container definitions
├── packages/           # Shared TypesScript configs & utilities
└── README.md

```

---

## 🚀 Roadmap (V2)

The V2 roadmap is planned to introduce eventual consistency and advanced observability.

- **Caching:** Redis for hot reads (Wallet Balances).
- **Resiliency:** Retryable queues for handling external bank downtime.
- **Observability:** Prometheus metrics, Grafana dashboards, and Loki for structured logging.
- **CI/CD:** Selective builds (Monorepo optimization) and stricter merge checks.
- **Infra**: Nginx/Redis/BullMQ be in github

---

## 🧪 Testing Strategy

- **Unit Tests:** Focus on core services and utility functions.
- **Integration Tests:** Cover critical Auth flows and Transaction APIs.
- **CI Checks:** Automated testing pipeline to prevent regression before merging.

---

## 🧑‍💻 About Me

I’m a Full-Stack Developer who thinks in systems, not just features. I understand that code is a liability and correctness is an asset.

This project is my way of demonstrating how I handle production-level constraints, backend failures, and architectural trade-offs.

[Check out my portfolio](https://devaman.space)
