import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import moneyFlowReducer from "./slices/moneyFlowSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    moneyFlow: moneyFlowReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
