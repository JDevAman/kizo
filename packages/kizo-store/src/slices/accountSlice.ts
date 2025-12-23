import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AccountState {
  balance: string; // serialized bigint
  locked: string; // serialized bigint
  loading: boolean;
  error?: string | null;
}

const initialState: AccountState = {
  balance: "0",
  locked: "0",
  loading: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount(
      state,
      action: PayloadAction<{ balance: string; locked: string }>
    ) {
      state.balance = action.payload.balance;
      state.locked = action.payload.locked;
    },
    startLoading: (state) => {
      state.loading = true;
    },
    setError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setAccount, startLoading, setError } = accountSlice.actions;
export default accountSlice.reducer;
