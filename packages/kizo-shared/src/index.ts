export * from "./generated/api";

import type { z } from "zod";
import { schemas } from "./generated/api";

export type User = z.infer<typeof schemas.User>;
export type ListTransaction = z.infer<typeof schemas.ListTransaction>;
export type DetailTransaction = z.infer<typeof schemas.DetailTransaction>;
