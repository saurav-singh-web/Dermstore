// src/utils/axiosInstance.ts
import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

function isSellerProductRequest(config: InternalAxiosRequestConfig) {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();

  return (
    url.startsWith('/seller') ||
    (url.startsWith('/products') &&
      (method !== 'get' || url === '/products/me' || url === '/products/mine'))
  );
}

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const sellerToken = localStorage.getItem('seller_token');
    const userToken = localStorage.getItem('token');

    config.headers = config.headers || {};

    if (isSellerProductRequest(config)) {
      if (sellerToken) {
        config.headers['Authorization'] = `Bearer ${sellerToken}`;
      }
    } else {
      if (userToken) {
        config.headers['Authorization'] = `Bearer ${userToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
