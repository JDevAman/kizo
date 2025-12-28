export * from "./generated/api";
export { schemas } from "./generated/api";

import type { z } from "zod";
import { schemas as _schemas } from "./generated/api";

// Types derived from schemas
export type DepositMoneyInput = z.infer<typeof _schemas.DepositMoneyInput>;
export type DetailTransaction = z.infer<typeof _schemas.DetailTransaction>;
export type DashboardData = z.infer<typeof _schemas.DashboardData>;
export type DashboardStats = z.infer<typeof _schemas.DashboardStats>;
export type ListTransaction = z.infer<typeof _schemas.ListTransaction>;
export type SignupInput = z.infer<typeof _schemas.SignupInput>;
export type SigninInput = z.infer<typeof _schemas.SigninInput>;
export type P2PTransferInput = z.infer<typeof _schemas.P2PTransferInput>;
export type UpdateProfileInput = z.infer<typeof _schemas.UpdateProfileInput>;
export type User = z.infer<typeof _schemas.User>;
