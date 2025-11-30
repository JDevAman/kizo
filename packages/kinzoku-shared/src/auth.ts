import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// Initialize OpenAPI extension
extendZodWithOpenApi(z);

// --- SHARED ATOMS ---
export const emailSchema = z.string().email("Invalid email address").openapi({ 
  example: "user@kinzoku.com",
  description: "User's registered email"
});

export const passwordSchema = z.string().min(6, "Password must be at least 6 chars").openapi({ 
  example: "SecureP@ss123" 
});

export const nameSchema = z.string().min(1).max(50).openapi({ example: "John" });

// --- AUTH ACTION SCHEMAS ---

// 1. Sign Up
export const signupInput = z.object({
  userName: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  avatar: z.string().url().optional().openapi({ example: "https://github.com/shadcn.png" }),
}).openapi({ description: "Payload for registering a new user" });

// 2. Sign In
export const signinInput = z.object({
  userName: emailSchema,
  password: passwordSchema,
}).openapi({ description: "Payload for logging in" });

// 3. Update Profile
export const updateProfileInput = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
}).openapi({ description: "Fields to update on user profile" });

// --- TYPE EXPORTS ---
export type userSignUpSchema = z.infer<typeof signupInput>;
export type userSignInSchema = z.infer<typeof signinInput>;
export type updateUserSchema = z.infer<typeof updateProfileInput>;