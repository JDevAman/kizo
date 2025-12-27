import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    user: null,
    signupEmail: null,
    loading: false,
};
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.loading = false; // done fetching
        },
        logout: (state) => {
            state.user = null;
            state.loading = false;
        },
        setSignupEmail: (state, action) => {
            state.signupEmail = action.payload;
        },
        startLoading: (state) => {
            state.loading = true;
        },
    },
});
export const { setUser, logout, setSignupEmail, startLoading } = authSlice.actions;
export default authSlice.reducer;
