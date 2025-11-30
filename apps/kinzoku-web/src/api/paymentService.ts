import { api } from "./api";

export interface PaymentPayload {
  recipient: string;
  amount: number;
  note?: string;
}

export const paymentService = {
  async sendPayment(payload: PaymentPayload) {
    return api.post("/payments/transfer", payload);
  },

  async requestPayment(payload: PaymentPayload) {
    return api.post("/payments/request", payload);
  },

  async addMoney(amount: number) {
    return api.post("/payments/add-money", { amount });
  },

  async getBalance() {
    const { data } = await api.get("/payments/balance");
    return data.balance;
  },
};
