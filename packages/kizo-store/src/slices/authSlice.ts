import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@kizo/shared";

export interface AuthState {
  user: User | null;
  loading: boolean;
  authChecked: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true, // start in loading
  authChecked: false, // not checked yet
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },

    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.loading = false;
      state.authChecked = true;
    },

    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.authChecked = true;
    },
  },
});

export const { setUser, logout, startLoading } = authSlice.actions;
export default authSlice.reducer;
