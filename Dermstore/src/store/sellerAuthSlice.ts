// src/store/sellerAuthSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type SellerAuthState = {
  isAuthenticated: boolean;
  token?: string | null;
  email?: string | null;
};

const initialState: SellerAuthState = {
  isAuthenticated: false,
   token: null,
   email: null,
};

const sellerAuthSlice = createSlice({
  name: 'sellerAuth',
  initialState,
  reducers: {
    sellerLoginSuccess(state, action: PayloadAction<{ token: string; email: string }>) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.email = action.payload.email;
    },
    sellerLogout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.email = null;
    },
  },
});

export const { sellerLoginSuccess, sellerLogout } = sellerAuthSlice.actions;
export default sellerAuthSlice.reducer;
