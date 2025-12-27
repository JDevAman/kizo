import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    balance: "0",
    locked: "0",
    loading: false,
};
const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        setAccount(state, action) {
            state.balance = action.payload.balance;
            state.locked = action.payload.locked;
        },
        startLoading: (state) => {
            state.loading = true;
        },
        setError(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});
export const { setAccount, startLoading, setError } = accountSlice.actions;
export default accountSlice.reducer;
