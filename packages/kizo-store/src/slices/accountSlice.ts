import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AccountState {
  balance: string;
  locked: string;
  loading: boolean;
  lastFetchedAt: number | null;
  error?: string | null;
}

const initialState: AccountState = {
  balance: "0",
  locked: "0",
  loading: false,
  lastFetchedAt: null,
  error: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setAccount(
      state,
      action: PayloadAction<{ balance: string; locked: string }>
    ) {
      state.balance = action.payload.balance;
      state.locked = action.payload.locked;
      state.loading = false;
      state.error = null;
      state.lastFetchedAt = Date.now();
    },
    invalidateAccount(state) {
      state.lastFetchedAt = null;
    },
    setError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setAccount,
  startLoading,
  setError,
  invalidateAccount,
} = accountSlice.actions;

export default accountSlice.reducer;
