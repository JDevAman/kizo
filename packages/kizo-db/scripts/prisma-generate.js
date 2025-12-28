import { execSync } from "child_process";

if (process.env.SKIP_PRISMA_GENERATE === "true") {
  console.log("⏭️  Skipping prisma generate (CI / frontend build)");
  process.exit(0);
}

console.log("▶ Running prisma generate");
execSync("prisma generate", { stdio: "inherit" });
