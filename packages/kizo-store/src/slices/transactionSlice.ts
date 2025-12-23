import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ListTransaction } from "@kizo/shared";

export interface TransactionState {
  list: ListTransaction[];
  loading: boolean;
  error?: string | null;
}

const initialState: TransactionState = {
  list: [],
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<ListTransaction[]>) => {
      state.list = action.payload;
    },
    addTransaction: (state, action: PayloadAction<ListTransaction>) => {
      state.list.unshift(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearTransactions: (state) => {
      state.list = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setTransactions,
  addTransaction,
  setLoading,
  setError,
  clearTransactions,
} = transactionSlice.actions;

export default transactionSlice.reducer;
