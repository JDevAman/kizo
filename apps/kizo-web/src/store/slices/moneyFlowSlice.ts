import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MoneyFlow } from "../../utils/types";
// Unified transaction/request type

interface MoneyFlowState {
  list: MoneyFlow[];
  balance: number; // in paise
  loading: boolean;
  error?: string | null;
}

const initialState: MoneyFlowState = {
  list: [],
  balance: 0,
  loading: false,
  error: null,
};

const moneyFlowSlice = createSlice({
  name: "moneyFlow",
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    setMoneyFlows: (state, action: PayloadAction<MoneyFlow[]>) => {
      state.list = action.payload;
    },
    addMoneyFlow: (state, action: PayloadAction<MoneyFlow>) => {
      state.list.unshift(action.payload);
    },
    updateMoneyFlow: (state, action: PayloadAction<MoneyFlow>) => {
      const idx = state.list.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.list[idx] = action.payload;
    },
    removeMoneyFlow: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((t) => t.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearMoneyFlows: (state) => {
      state.list = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setBalance,
  setMoneyFlows,
  addMoneyFlow,
  updateMoneyFlow,
  removeMoneyFlow,
  setLoading,
  setError,
  clearMoneyFlows,
} = moneyFlowSlice.actions;

export default moneyFlowSlice.reducer;
