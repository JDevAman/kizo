import { RootState } from "./rootReducer";
export declare const createStore: (preloadedState?: Partial<RootState>) => import("@reduxjs/toolkit").EnhancedStore<{
    auth: import("./slices/authSlice").AuthState;
    ui: import("./slices/uiSlice").UIState;
    transaction: import("./slices/transactionSlice").TransactionState;
    account: import("./slices/accountSlice").AccountState;
}, import("redux").UnknownAction, import("@reduxjs/toolkit").Tuple<[import("redux").StoreEnhancer<{
    dispatch: import("@reduxjs/toolkit").ThunkDispatch<{
        auth: import("./slices/authSlice").AuthState;
        ui: import("./slices/uiSlice").UIState;
        transaction: import("./slices/transactionSlice").TransactionState;
        account: import("./slices/accountSlice").AccountState;
    }, undefined, import("redux").UnknownAction>;
}>, import("redux").StoreEnhancer]>>;
export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore["dispatch"];
//# sourceMappingURL=createStore.d.ts.map