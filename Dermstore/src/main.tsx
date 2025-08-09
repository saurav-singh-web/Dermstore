// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { loginSuccess } from './store/authSlice';
import { loadAddress } from './store/addressSlice'; 
import { sellerLoginSuccess } from './store/sellerAuthSlice';
import { PersistGate } from 'redux-persist/integration/react';
import { fetchCart } from './store/cartSlice';


const token = localStorage.getItem('token');
const email = localStorage.getItem('email');
const name = localStorage.getItem('name');
if (token && email && name) {
  store.dispatch(loginSuccess({ token, email, name }));
  store.dispatch(fetchCart());
}
const sellerToken = localStorage.getItem('seller_token');

const sellerEmail = localStorage.getItem('seller_email');


if (sellerToken && sellerEmail) {
  store.dispatch(sellerLoginSuccess({ token: sellerToken, email: sellerEmail }));
}

store.dispatch(loadAddress());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
