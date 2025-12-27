export declare const rootReducer: import("redux").Reducer<{
    auth: import("./slices/authSlice").AuthState;
    ui: import("./slices/uiSlice").UIState;
    transaction: import("./slices/transactionSlice").TransactionState;
    account: import("./slices/accountSlice").AccountState;
}, import("redux").UnknownAction, Partial<{
    auth: import("./slices/authSlice").AuthState | undefined;
    ui: import("./slices/uiSlice").UIState | undefined;
    transaction: import("./slices/transactionSlice").TransactionState | undefined;
    account: import("./slices/accountSlice").AccountState | undefined;
}>>;
export type RootState = ReturnType<typeof rootReducer>;
//# sourceMappingURL=rootReducer.d.ts.map