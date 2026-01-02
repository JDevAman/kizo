import { v4 as uuidv4 } from "uuid";

export function createIdempotencyKey() {
  return uuidv4();
}

export function rupeesToPaise(value: string): number {
  return parseFloat(value) * 100;
}

export function PaiseToRupees(value: string): number {
  return parseFloat(value) / 100;
}

export const regex = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
  amount: /^[1-9]\d*(\.\d{1,2})?$/,
};
