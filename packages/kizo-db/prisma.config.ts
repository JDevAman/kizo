import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const isCI = process.env.SKIP_PRISMA_GENERATE === "true";

const config = isCI
  ? defineConfig({
      // Minimal, inert config for frontend CI
      schema: "prisma/schema.prisma",
    })
  : defineConfig({
      schema: "prisma/schema.prisma",
      migrations: {
        path: "prisma/migrations",
      },
      datasource: {
        url: env("DIRECT_URL"),
      },
    });

export default config;
