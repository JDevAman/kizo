import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ListTransaction } from "@kizo/shared";

export interface TransactionState {
  list: ListTransaction[];
  loading: boolean;
  lastFetchedAt: number | null;
  error: string | null;
}

const initialState: TransactionState = {
  list: [],
  loading: false,
  lastFetchedAt: null,
  error: null,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    startTxnLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setTransactions(state, action: PayloadAction<ListTransaction[]>) {
      state.list = action.payload;
      state.loading = false;
      state.error = null;
      state.lastFetchedAt = Date.now();
    },
    invalidateTransactions(state) {
      state.lastFetchedAt = null;
    },
    setError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearTransactions(state) {
      state.list = [];
      state.loading = false;
      state.lastFetchedAt = null;
      state.error = null;
    },
  },
});

export const {
  startTxnLoading,
  setTransactions,
  invalidateTransactions,
  setError,
  clearTransactions,
} = transactionSlice.actions;

export default transactionSlice.reducer;
