import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SellerProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  stock?: number;
  category?: string;
};

type State = {
  products: SellerProduct[];
};

const initialState: State = {
  products: [],
};



const sellerProductsSlice = createSlice({
  name: 'sellerProducts',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<SellerProduct>) => {
      state.products.push(action.payload);
    },
     updateSellerProduct: (state, action: PayloadAction<SellerProduct>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
      state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
    clearSellerProducts: (state) => {
      state.products = [];
    },
  },
});

export const { addProduct,updateSellerProduct,deleteProduct, clearSellerProducts } = sellerProductsSlice.actions;
export default sellerProductsSlice.reducer;
