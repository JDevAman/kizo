import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/repositories/**/*.ts"],
      exclude: ["node_modules/", "dist/", "src/index.ts"],
      reporter: ["text", "html"],
    },
  },
});
