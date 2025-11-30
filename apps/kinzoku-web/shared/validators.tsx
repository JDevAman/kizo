import { z } from "zod";

export const regex = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
  amount: /^[1-9]\d*(\.\d{1,2})?$/, 
};

export const validations = {
  email: z
    .string()
    .trim()
    .regex(regex.email, { message: "Please enter a valid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(regex.password, {
      message: "Password must contain letters and numbers",
    }),

  name: z
    .string()
    .trim()
    .min(1, { message: "Name cannot be empty" })
    .max(20, { message: "Name must be under 20 characters" }),

  amount: z
    .string()
    .trim()
    .regex(regex.amount, { message: "Enter a valid amount" }),
};

export const userSignInSchema = z.object({
  userName: validations.email,
  password: validations.password,
});

// Sign-up schema
export const userSignUpSchema = z
  .object({
    userName: validations.email,
    firstName: validations.name,
    lastName: validations.name,
    password: validations.password,
    confirmPassword: validations.password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Update user schema
export const updateUserSchema = z.object({
  firstName: validations.name,
  lastName: validations.name,
  password: validations.password.optional(), // optional if user doesn't want to change password
});
