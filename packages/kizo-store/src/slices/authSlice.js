import { createSlice } from "@reduxjs/toolkit";
const initialState = {
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
        setUser: (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.authChecked = true; // ✅ auth check completed
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
