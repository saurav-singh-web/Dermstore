// src/store/toastSlice.ts
import { createSlice } from '@reduxjs/toolkit';

type ToastState = {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';

};

const initialState: ToastState = {
  message: '',
  type: 'info', 
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
 reducers: {
    showToast(state, action: { payload: ToastState }) {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    clearToast(state) {
      state.message = '';
      state.type = undefined;
    },
  },
});

export const { showToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;
