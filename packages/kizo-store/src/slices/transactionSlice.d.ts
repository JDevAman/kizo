import type { ListTransaction } from "@kizo/shared";
export interface TransactionState {
    list: ListTransaction[];
    loading: boolean;
    error?: string | null;
}
export declare const setTransactions: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    id: string;
    referenceId: string;
    amount: string;
    status: "PROCESSING" | "SUCCESS" | "FAILED" | "REFUNDED";
    type: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER";
    description?: (string | null) | undefined;
    createdAt: string;
}[], "transactions/setTransactions">, addTransaction: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    id: string;
    referenceId: string;
    amount: string;
    status: "PROCESSING" | "SUCCESS" | "FAILED" | "REFUNDED";
    type: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER";
    description?: (string | null) | undefined;
    createdAt: string;
}, "transactions/addTransaction">, setLoading: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "transactions/setLoading">, setError: import("@reduxjs/toolkit").ActionCreatorWithPayload<string | null, "transactions/setError">, clearTransactions: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"transactions/clearTransactions">;
declare const _default: import("redux").Reducer<TransactionState>;
export default _default;
//# sourceMappingURL=transactionSlice.d.ts.map