import { createIdempotencyKey } from "../utils/utils";
import { api } from "./api";

export interface PaymentPayload {
  recipient: string;
  amount: number;
  note?: string;
}

export const paymentService = {
  async transferPayment(payload: PaymentPayload) {
    const idempotencyKey = createIdempotencyKey();
    return api.post("/payment/transfer", payload, {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    });
  },

  // async requestPayment(payload: PaymentPayload) {
  //   return api.post("/payment/request", payload);
  // },

  async depositMoney(amount: number) {
    const idempotencyKey = createIdempotencyKey();
    return api.post(
      "/payment/deposit",
      { amount },
      {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      }
    );
  },

  async withdrawMoney(amount: number) {
    const idempotencyKey = createIdempotencyKey();
    return api.post(
      "/payment/withdraw",
      { amount },
      {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      }
    );
  },

  async getBalance() {
    const { data } = await api.get("/payment/balance");
    return data.balance;
  },
};
