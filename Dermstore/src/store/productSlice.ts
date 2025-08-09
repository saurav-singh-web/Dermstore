// store/productSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Product {
  _id: string;
  title: string;
  // add other fields
}

interface ProductState {
  allProducts: Product[];
}

const initialState: ProductState = {
  allProducts: [],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setAllProducts(state, action: PayloadAction<Product[]>) {
      state.allProducts = action.payload;
    },
  },
});

export const { setAllProducts } = productSlice.actions;
export default productSlice.reducer;
