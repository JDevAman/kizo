import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // 💡 In Vitest 3+, 'workspace' is now 'projects'
    projects: ["packages/*/vitest.config.ts", "apps/*/vitest.config.ts"],
    // Global options like coverage or reporters go here
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
