// src/store/addressSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type Address = {
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  country: string;
};

type AddressState = {
  saved: Address | null;
};
const initialState: AddressState = {
  saved: null,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    saveAddress: (state, action: PayloadAction<Address>) => {
      state.saved = action.payload;
      localStorage.setItem('address', JSON.stringify(action.payload));
    },
     loadAddress: (state) => {
      const stored = localStorage.getItem('address');
      if (stored) state.saved = JSON.parse(stored);
    },
    clearAddress: (state) => {
      state.saved = null;
      localStorage.removeItem('address');
    },
  },
});

export const { saveAddress, loadAddress, clearAddress } = addressSlice.actions;
export default addressSlice.reducer;
