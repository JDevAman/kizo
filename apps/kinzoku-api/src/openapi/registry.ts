import { OpenAPIRegistry  } from "@asteasolutions/zod-to-openapi";

export const registry = new OpenAPIRegistry();

// Register JWT Security Schema
registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});