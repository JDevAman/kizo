import type { Store } from "@reduxjs/toolkit";
import type { RootState } from "@kizo/store";
import { createStore } from "@kizo/store";

export const store: Store<RootState> = createStore();
