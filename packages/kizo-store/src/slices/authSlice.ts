import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@kizo/shared";

export interface AuthState {
  user: User | null;
  signupEmail: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  signupEmail: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.loading = false; // done fetching
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
    },
    setSignupEmail: (state, action: PayloadAction<string>) => {
      state.signupEmail = action.payload;
    },
    startLoading: (state) => {
      state.loading = true;
    },
  },
});

export const { setUser, logout, setSignupEmail, startLoading } =
  authSlice.actions;
export default authSlice.reducer;
