import { createIdempotencyKey } from "../utils/utils";
import { api } from "./api";
export const paymentService = {
    async transferPayment(payload) {
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
    async depositMoney(amount) {
        const idempotencyKey = createIdempotencyKey();
        return api.post("/payment/deposit", { amount }, {
            headers: {
                "Idempotency-Key": idempotencyKey,
            },
        });
    },
    async withdrawMoney(amount) {
        const idempotencyKey = createIdempotencyKey();
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
