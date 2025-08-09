import { createSlice, createAsyncThunk, } from '@reduxjs/toolkit';
import axios from '../utils/axiosInstance';
import type { Product } from '../types/product';

export type CartItem = {
  _id: string;
  product: Product;
  quantity: number;
};

interface CartState {
  items: CartItem[];
  couponCode?: string;
  discountAmount?: number;
  loading: boolean;
  error?: string;
}


const initialState: CartState = {
  items: [],
  couponCode: undefined,
  discountAmount:0,
  loading: false,
  error: undefined,
};

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  const response = await axios.get<{ items: CartItem[];  couponCode?: string; discountAmount?: number; }>('/cart');
  return response.data;
});

export const updateCartOnServer = createAsyncThunk<
  { items: CartItem[]; couponCode?: string; discountAmount?: number },
  { productId: string; quantity: number; couponCode?: string }
>(
  'cart/update',
  async ({ productId, quantity, couponCode }) => {
    const response = await axios.post<{
      items: CartItem[];
      couponCode?: string;
      discountAmount?: number;
    }>('/cart/update', { productId, quantity, couponCode });
    return response.data;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart(state) {
      state.items = [];
      state.couponCode = undefined;
      state.discountAmount = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.couponCode = action.payload.couponCode;
        state.discountAmount = action.payload.discountAmount;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to load cart';
      })
      .addCase(updateCartOnServer.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.couponCode = action.payload.couponCode;
        state.discountAmount = action.payload.discountAmount;
      });
  },
});

export const {  clearCart } = cartSlice.actions;
export default cartSlice.reducer;
