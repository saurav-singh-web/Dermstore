// src/store/orderSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axiosInstance';
import type { Order } from '../types/order';

export const fetchOrders = createAsyncThunk('orders/fetch', async () => {
  const response = await axios.get<{ orders: Order[] }>('/orders');
  return response.data.orders;
});

interface OrderState {
  orders: Order[];
  loading: boolean;
  error?: string;
}
const initialState: OrderState = { orders: [], loading: false };

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchOrders.pending, state => { state.loading = true; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to load orders';
      });
  },
});

export const placeOrder = createAsyncThunk(
  'order/place',
  async (payload: { form: any }) => {
    await axios.post('/orders/place', payload);
  }
);

export default orderSlice.reducer;
