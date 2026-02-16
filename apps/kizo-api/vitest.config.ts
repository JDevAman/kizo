import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "kizo-api",
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      exclude: [
        "node_modules/",
        "dist/",
        "**/*.d.ts",
        "**/tests/**",
        "./db.ts",
      ],
    },
    globals: true,
    isolate: true,
    setupFiles: ["./tests/unit/setup.ts"],
    include: ["tests/unit/**/*.test.ts"],
    silent: false,
  },
});