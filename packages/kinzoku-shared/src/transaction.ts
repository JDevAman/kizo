import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

// --- HELPERS ---
// Used by Zod transform
const rupeesToPaise = (rupees: number) => Math.round(rupees * 100);
// Exported for Frontend use (Display logic)
export const paiseToRupees = (paise: number) => paise / 100;

// --- BASE SCHEMAS ---

// Amount Validator:
// 1. Must be positive number
// 2. Max 1 Lakh per tx
// 3. Max 2 decimal places (10.99 is ok, 10.999 is error)
// 4. Transforms 10.50 (Rupees) -> 1050 (Paise) automatically
const amountSchema = z
  .number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  })
  .positive("Amount must be positive")
  .max(100000, "Transaction limit exceeded (Max ₹1 Lakh)")
  .refine((val) => Number.isInteger(val * 100), {
    message: "Amount can have up to 2 decimal places (e.g. 10.99)",
  })
  .openapi({ 
    example: 1500.50, 
    description: "Amount in Rupees (will be converted to Paise)" 
  })
  .transform(rupeesToPaise);

// --- TRANSACTION ACTION SCHEMAS ---

// 1. P2P Transfer
export const p2pTransferInput = z.object({
  recipient: z.string().trim().email("Enter a valid recipient email").openapi({ example: "friend@kinzoku.com" }),
  amount: amountSchema,
  note: z.string().max(200, "Note too long").optional().openapi({ example: "Dinner bill" }),
}).openapi({ description: "Send money to another user via email" });

// 2. Add Money (OnRamp)
export const addMoneyInput = z.object({
  amount: amountSchema,
  provider: z.enum(["HDFC", "AXIS", "STRIPE", "RAZORPAY"]).default("HDFC").openapi({ example: "HDFC" }),
}).openapi({ description: "Simulate adding money from a bank" });

// 3. Create Request
export const createRequestInput = z.object({
  recipient: z.string().trim().email("Enter a valid email address").openapi({ example: "debtor@kinzoku.com" }),
  amount: amountSchema,
  note: z.string().max(200).optional(),
}).openapi({ description: "Request money from another user" });


// --- TYPE EXPORTS ---
export type P2pTransferInput = z.infer<typeof p2pTransferInput>;
export type AddMoneyInput = z.infer<typeof addMoneyInput>;
export type CreateRequestInput = z.infer<typeof createRequestInput>;