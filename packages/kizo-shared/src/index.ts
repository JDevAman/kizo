import { z } from "zod";
import { schemas as generatedSchemas } from "./generated/api";

export { z };

export const SystemSchemas = {
  idempotencyKey: z
    .string()
    .uuid({ message: "Invalid Idempotency-Key format" }),

  pagination: z.object({
    take: z.coerce.number().min(1).max(100).default(20),
    skip: z.coerce.number().min(0).default(0),
  }),

  searchFilter: z.string().max(50).trim(),
};

export const schemas = generatedSchemas;

export type DepositMoneyInput = z.infer<
  typeof generatedSchemas.DepositMoneyInput
>;
export type DetailTransaction = z.infer<
  typeof generatedSchemas.DetailTransaction
>;
export type DashboardData = z.infer<typeof generatedSchemas.DashboardData>;
export type DashboardStats = z.infer<typeof generatedSchemas.DashboardStats>;
export type ListTransaction = z.infer<typeof generatedSchemas.ListTransaction>;
export type SignupInput = z.infer<typeof generatedSchemas.SignupInput>;
export type SigninInput = z.infer<typeof generatedSchemas.SigninInput>;
export type P2PTransferInput = z.infer<
  typeof generatedSchemas.P2PTransferInput
>;
export type UpdateProfileInput = z.infer<
  typeof generatedSchemas.UpdateProfileInput
>;
export type User = z.infer<typeof generatedSchemas.User>;
export type AuthUser = z.infer<typeof generatedSchemas.AuthUser>;
