FROM node:20-alpine

WORKDIR /app
RUN corepack enable

COPY pnpm-workspace.yaml pnpm-lock.yaml ./
COPY package.json turbo.json ./
COPY packages ./packages
COPY apps ./apps

# ✅ install dev deps so turbo exists
RUN pnpm install --frozen-lockfile

ARG DIRECT_URL
ENV DIRECT_URL=$DIRECT_URL
ENV NODE_ENV=production

# prisma like local
RUN pnpm -w @kizo/db exec prisma generate

ARG PACKAGE_NAME
RUN pnpm build -w ${PACKAGE_NAME}

ARG APP_DIR
WORKDIR /app/apps/${APP_DIR}

CMD ["node", "dist/server.js"]
