# --- STAGE 1: Builder ---
FROM node:22-slim AS builder
RUN apt-get update -y && apt-get install -y openssl wget && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# 1. Copy Manifests individually to FORCE the correct directory structure
COPY package*.json turbo.json ./
COPY apps/kizo-api/package.json ./apps/kizo-api/
COPY apps/kizo-worker/package.json ./apps/kizo-worker/
COPY apps/kizo-processor/package.json ./apps/kizo-processor/

# Explicitly copy each package manifest so the directory exists for npm
COPY packages/kizo-db/package.json ./packages/kizo-db/
COPY packages/kizo-shared/package.json ./packages/kizo-shared/
COPY packages/kizo-logger/package.json ./packages/kizo-logger/
COPY packages/kizo-metrics/package.json ./packages/kizo-metrics/
COPY packages/kizo-queue/package.json ./packages/kizo-queue/

# 2. Install (This will now correctly find local workspaces)
RUN npm install --legacy-peer-deps

# 3. Copy source and build EVERYTHING
COPY . .
ENV DATABASE_URL="postgresql://stub:stub@localhost:5432/stub"
ENV DIRECT_URL="postgresql://stub:stub@localhost:5432/stub"

# Build all apps (API, Worker, Processor)
RUN ./node_modules/.bin/turbo build \
    --filter=@kizo/api... \
    --filter=@kizo/worker... \
    --filter=@kizo/processor...

# 4. Prune for production size
RUN npm prune --production

# --- STAGE 2: Runner ---
FROM node:22-slim AS runner
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps ./apps
COPY --from=builder /app/packages ./packages

# Start all three in one container
CMD node --max-old-space-size=256 apps/kizo-api/dist/server.js & \
    node --max-old-space-size=256 apps/kizo-worker/dist/server.js & \
    node --max-old-space-size=256 apps/kizo-processor/dist/server.js & \
    wait