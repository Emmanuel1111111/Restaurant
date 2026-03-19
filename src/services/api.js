import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_BASE_URL, TIMEOUT, TOKEN_KEY } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - logout
      AsyncStorage.removeItem(TOKEN_KEY);
    }
    console.log('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error.message);
  }
);


// Auth APIs
export const sendOTP = (phone) => api.post('/auth/send-otp', { phone });

export const verifyOTP = (phone, otp) => api.post('/auth/verify-otp', { phone, otp });

export const getMe = () => api.get('/auth/me');
export const updateProfile = (data) => api.put('/auth/profile', data);

// Menu APIs
export const getMenu = () => api.get('/menu');
export const getMenuItem = (id) => api.get(`/menu/item/${id}`);
export const searchMenu = (query) => api.get(`/menu/search?q=${query}`);

// Order APIs
export const createOrder = (data) => api.post('/orders', data);

export const getMyOrders = (status) => 
  api.get(`/orders/my-orders${status ? `?status=${status}` : ''}`);

export const getOrder = (id) => api.get(`/orders/${id}`);

export const rateOrder = (id, rating, review) => 
  api.post(`/orders/${id}/rate`, { rating, review });

// Payment APIs
export const initializePayment = (amount, orderId) =>
  api.post('/payment/initialize', { amount, orderId });
export const verifyPayment = (reference) => api.get(`/payment/verify/${reference}`);

// Settings APIs
export const getSettings = () => api.get('/settings');

// Cart APIs
export const getCart = () => api.get('/cart');

export const addToCart = (menuItemId, quantity, selectedAddOns = []) =>
  api.post('/cart/add', { menuItemId, quantity, selectedAddOns });

export const updateCartItem = (itemIndex, quantity) =>
  api.put('/cart/update', { itemIndex, quantity });

export const removeFromCart = (itemIndex) =>
  api.delete('/cart/remove', { data: { itemIndex } });


export const clearCart = () => api.delete('/cart/clear');

export default api;
