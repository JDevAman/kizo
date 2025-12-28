import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
export const createStore = (preloadedState) => configureStore({
    reducer: rootReducer,
    preloadedState,
});
