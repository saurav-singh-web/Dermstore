// src/store/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type User = {
  name: string;
  email: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user?: User;
  token?: string;
};

const initialState: AuthState = {
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<User & { token: string }>) => {
      state.isAuthenticated = true;
      state.user = { name: action.payload.name, email: action.payload.email };
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = undefined;
      state.token = undefined;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
