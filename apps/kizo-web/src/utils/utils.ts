import { v4 as uuidv4 } from "uuid";

export function createIdempotencyKey() {
  return uuidv4();
}

export function rupeesToPaise(value: string): number {
  return (parseFloat(value) * 100);
}

export function PaiseToRupees(value: string): number {
  return (parseFloat(value) / 100);
}
