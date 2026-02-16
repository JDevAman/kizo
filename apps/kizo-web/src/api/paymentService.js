import { api } from "./api";
export const paymentService = {
    async transferPayment(payload, idempotencyKey) {
        return api.post("/payment/transfer", payload, {
            headers: {
                "Idempotency-Key": idempotencyKey,
            },
        });
    },
    // async requestPayment(payload: PaymentPayload) {
    //   return api.post("/payment/request", payload);
    // },
    async depositMoney(amount, idempotencyKey) {
        return api.post("/payment/deposit", { amount }, {
            headers: {
                "Idempotency-Key": idempotencyKey,
            },
        });
    },
    async withdrawMoney(amount, idempotencyKey) {
        return api.post("/payment/withdraw", { amount }, {
            headers: {
                "Idempotency-Key": idempotencyKey,
            },
        });
    },
    async getBalance() {
        const { data } = await api.get("/payment/balance");
        return data;
    },
};
