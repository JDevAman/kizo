import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// Ensure OpenAPI extension is loaded
extendZodWithOpenApi(z);

// 1. Define the Transaction Object (used in the list)
// We define this separately so it can be reused
export const transactionObj = z.object({
  id: z.string().uuid(),
  amount: z.number(),      // In Rupees (Float)
  status: z.enum(["SUCCESS", "PROCESSING", "FAILED", "PENDING", "REJECTED"]),
  type: z.enum(["P2P_TRANSFER", "DEPOSIT", "WITHDRAWAL", "REQUEST"]),
  date: z.date().or(z.string()), // Dates often serialize to string over JSON
  direction: z.enum(["sent", "received"]),
  description: z.string().optional(),
  referenceId: z.string().optional(),
  otherParty: z.object({
    firstName: z.string(),
    lastName: z.string(),
    userName: z.string().email(),
    avatar: z.string().nullable().optional(),
  }).nullable(), // Null if system transaction
}).openapi({ description: "A single transaction entry" });

// 2. Define the Dashboard Response
export const dashboardOutput = z.object({
  balance: z.number().openapi({ example: 10500.50 }),
  locked: z.number().optional().openapi({ example: 0 }),
  
  stats: z.object({
    sent: z.number().openapi({ example: 5000 }),
    received: z.number().openapi({ example: 2000 }),
    thisMonth: z.number().openapi({ example: 7000 }),
    totalCount: z.number().openapi({ example: 15 }),
  }),

  recentTransactions: z.array(transactionObj),
}).openapi({ description: "Dashboard summary data" });

// 3. Export the TypeScript Type
export type DashboardData = z.infer<typeof dashboardOutput>;
export type TransactionData = z.infer<typeof transactionObj>;