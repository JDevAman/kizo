# Base
FROM node:20-alpine AS base
WORKDIR /repo
RUN corepack enable

# ---- deps ----
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml ./
COPY package.json turbo.json ./
COPY packages ./packages
COPY apps ./apps
RUN pnpm install --frozen-lockfile

# ---- build ----
FROM deps AS build
ARG PACKAGE_NAME
ARG DIRECT_URL
ENV DIRECT_URL=$DIRECT_URL

RUN pnpm build \
  --filter @kizo/db \
  --filter @kizo/shared \
  --filter ${PACKAGE_NAME}

# ---- deploy (CRITICAL STAGE) ----
FROM deps AS deploy
ARG PACKAGE_NAME
RUN pnpm deploy --prod --filter ${PACKAGE_NAME} /out

# ---- runtime ----
FROM node:20-alpine AS runtime
WORKDIR /app
ARG APP_DIR
ENV NODE_ENV=production

COPY --from=deploy /out ./
COPY --from=build /repo/apps/${APP_DIR}/dist ./dist
COPY --from=build /repo/packages/kizo-db/dist \
  ./node_modules/@kizo/db/dist
COPY --from=build /repo/packages/kizo-shared/dist \
  ./node_modules/@kizo/shared/dist

RUN mkdir -p /app/assets
COPY --from=build /repo/packages/kizo-shared/openapi.yaml ./assets/openapi.yaml

CMD ["node", "dist/server.js"]
