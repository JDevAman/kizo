import { configureStore } from "@reduxjs/toolkit";
import { rootReducer, RootState } from "./rootReducer";

export const createStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore["dispatch"];
