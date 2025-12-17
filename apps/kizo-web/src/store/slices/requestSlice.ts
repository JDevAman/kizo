import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Request {
  id: string;
  from: string; // requester email
  to: string; // recipient email
  amount: number; // in paise
  status: "pending" | "completed" | "rejected";
  date: string;
  note?: string;
}

interface RequestsState {
  list: Request[];
  loading: boolean;
  error?: string | null;
}

const initialState: RequestsState = {
  list: [],
  loading: false,
  error: null,
};

const requestSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    setRequests: (state, action: PayloadAction<Request[]>) => {
      state.list = action.payload;
    },
    addRequest: (state, action: PayloadAction<Request>) => {
      state.list.unshift(action.payload);
    },
    updateRequest: (state, action: PayloadAction<Request>) => {
      const idx = state.list.findIndex((r) => r.id === action.payload.id);
      if (idx !== -1) state.list[idx] = action.payload;
    },
    removeRequest: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((r) => r.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearRequests: (state) => {
      state.list = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setRequests,
  addRequest,
  updateRequest,
  removeRequest,
  setLoading,
  setError,
  clearRequests,
} = requestSlice.actions;

export default requestSlice.reducer;
