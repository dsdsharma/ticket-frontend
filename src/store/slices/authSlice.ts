import { createSlice } from "@reduxjs/toolkit";
import type { User } from "@/lib/api/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: { payload: User | null }) {
      state.user = action.payload;
    },
    setLoading(state, action: { payload: boolean }) {
      state.isLoading = action.payload;
    },
    setInitialized(state, action: { payload: boolean }) {
      state.isInitialized = action.payload;
    },
    clearAuth(state) {
      state.user = null;
      state.isInitialized = true;
    },
  },
});

export const { setUser, setLoading, setInitialized, clearAuth } = authSlice.actions;
export default authSlice.reducer;
