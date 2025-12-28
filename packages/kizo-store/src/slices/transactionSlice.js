import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    list: [],
    loading: false,
    error: null,
};
const transactionSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        setTransactions: (state, action) => {
            state.list = action.payload;
        },
        addTransaction: (state, action) => {
            state.list.unshift(action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearTransactions: (state) => {
            state.list = [];
            state.loading = false;
            state.error = null;
        },
    },
});
export const { setTransactions, addTransaction, setLoading, setError, clearTransactions, } = transactionSlice.actions;
export default transactionSlice.reducer;
