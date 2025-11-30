import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Transaction {
  id: string;
  type: "send" | "receive" | "refund";
  amount: number; // always in paise
  status: "success" | "pending" | "failed" | "refunded";
  date: string;
  sender?: string;
  recipient?: string;
  note?: string;
}

interface TransactionsState {
  list: Transaction[];
  loading: boolean;
  error?: string | null;
}

const initialState: TransactionsState = {
  list: [],
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.list = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.list.unshift(action.payload);
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const idx = state.list.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.list[idx] = action.payload;
    },
    refundTransaction: (state, action: PayloadAction<string>) => {
      const txn = state.list.find((t) => t.id === action.payload);
      if (txn) txn.status = "refunded";
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
  updateTransaction,
  refundTransaction,
  setLoading,
  setError,
  clearTransactions,
} = transactionSlice.actions;

export default transactionSlice.reducer;
