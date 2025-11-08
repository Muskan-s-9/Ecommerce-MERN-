import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
};

export const cartService = {
  getAll: () => api.get('/cart'),
  addItem: (productId, quantity = 1) => api.post('/cart', { productId, quantity }),
  updateItem: (id, quantity) => api.put(`/cart/${id}`, { quantity }),
  removeItem: (id) => api.delete(`/cart/${id}`),
  checkout: () => api.post('/cart/checkout'),
};

