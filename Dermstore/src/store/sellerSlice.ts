import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type SellerState = {
  isAuthenticated: boolean;
  name?: string;
  token?: string;
};

const initialState: SellerState = {
  isAuthenticated: false,
};

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    sellerLoginSuccess: (state, action: PayloadAction<{ name: string; token: string }>) => {
      state.isAuthenticated = true;
      state.name = action.payload.name;
      state.token = action.payload.token;
    },
    sellerLogout: (state) => {
      state.isAuthenticated = false;
      state.name = undefined;
      state.token = undefined;
    },
  },
});

export const { sellerLoginSuccess, sellerLogout } = sellerSlice.actions;
export default sellerSlice.reducer;
