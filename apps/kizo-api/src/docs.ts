import path from "path";
import fs from "fs";
import yaml from "yaml";
import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

function resolveOpenApiPath() {
  // 1️⃣ Production / Docker path (preferred)
  const prodPath = path.resolve(
    __dirname,
    "..", // dist → app root
    "assets",
    "openapi.yaml",
  );

  if (fs.existsSync(prodPath)) {
    return prodPath;
  }

  // 2️⃣ Local dev (monorepo) fallback
  const devPath = path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "packages",
    "kizo-shared",
    "openapi.yaml",
  );

  if (fs.existsSync(devPath)) {
    return devPath;
  }

  // 3️⃣ Fail loudly (this is GOOD)
  throw new Error(
    "openapi.yaml not found. Checked:\n" +
      `- ${prodPath}\n` +
      `- ${devPath}`,
  );
}

const openapiPath = resolveOpenApiPath();

// Load once on startup
const raw = fs.readFileSync(openapiPath, "utf8");
const openapiDoc = yaml.parse(raw);

router.get("/openapi.yaml", (_, res) => {
  res.type("text/yaml").send(raw);
});

router.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(openapiDoc, { explorer: true }),
);

export default router;
