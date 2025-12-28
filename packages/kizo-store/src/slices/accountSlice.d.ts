export interface AccountState {
    balance: string;
    locked: string;
    loading: boolean;
    error?: string | null;
}
export declare const setAccount: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    balance: string;
    locked: string;
}, "account/setAccount">, startLoading: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"account/startLoading">, setError: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "account/setError">;
declare const _default: import("redux").Reducer<AccountState>;
export default _default;
//# sourceMappingURL=accountSlice.d.ts.map