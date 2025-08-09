// src/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import ordersReducer from './orderSlice'; 
import cartReducer from './cartSlice';
import searchReducer from './searchSlice';
import preferencesReducer from './preferencesSlice';
import authReducer from './authSlice';
import toastReducer from './toastSlice';
import addressReducer from './addressSlice';
import sellerReducer from './sellerSlice';
import sellerProductsReducer from './sellerProductsSlice';
import sellerAuthReducer from './sellerAuthSlice';
import productReducer from './productSlice';

const rootReducer = combineReducers({
  cart: cartReducer,
  orders: ordersReducer,
  search: searchReducer,
  preferences: preferencesReducer,
  auth: authReducer,
  toast: toastReducer,
  address: addressReducer,
  seller: sellerReducer,
  sellerProducts: sellerProductsReducer,
  sellerAuth: sellerAuthReducer,
  product: productReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'sellerProducts'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});


export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
