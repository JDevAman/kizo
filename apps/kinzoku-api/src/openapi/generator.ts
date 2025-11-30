import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry";
import "./paths";

export function generateOpenAPI() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "KinzokuPay API",
      version: "1.0.0",
      description: "Fintech API Documentation",
    },
    servers: [{ url: "http://localhost:3000" }], // Update port if needed
  });
}