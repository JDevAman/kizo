import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Request } from "./requestSlice";

interface PaymentsState {
  balance: number; // in paise
  requests: Request[];
  addMoneyAmount: number; // frontend input, in rupees
  loading: boolean;
  error?: string | null;
}

const initialState: PaymentsState = {
  balance: 0,
  requests: [],
  addMoneyAmount: 0,
  loading: false,
  error: null,
};

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    addRequest: (state, action: PayloadAction<Request>) => {
      state.requests.unshift(action.payload);
    },
    clearRequests: (state) => {
      state.requests = [];
    },
    setAddMoneyAmount: (state, action: PayloadAction<number>) => {
      state.addMoneyAmount = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetPaymentsState: () => initialState,
  },
});

export const {
  setBalance,
  addRequest,
  clearRequests,
  setAddMoneyAmount,
  setLoading,
  setError,
  resetPaymentsState,
} = paymentsSlice.actions;

export default paymentsSlice.reducer;
