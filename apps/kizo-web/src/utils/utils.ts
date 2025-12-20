import { clsx } from "clsx";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: Parameters<typeof clsx>) {
  return clsx(...inputs);
}

export function createIdempotencyKey() {
  return uuidv4();
}

export function rupeesToPaise(value: string): number {
  return Math.round(parseFloat(value) * 100);
}

export function PaiseToRupees(value: string): number {
  return Math.round(parseFloat(value) / 100);
}
