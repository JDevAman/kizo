import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import transactionReducer from "./slices/transactionSlice";
import accountReducer from "./slices/accountSlice";
export const rootReducer = combineReducers({
    auth: authReducer,
    ui: uiReducer,
    transaction: transactionReducer,
    account: accountReducer,
});
