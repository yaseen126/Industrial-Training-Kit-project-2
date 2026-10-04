import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const orderService = {
  /**
   * GET /api/orders
   * @param {Object} params - Query params (search, status, sortBy)
   */
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  /**
   * GET /api/orders/:id
   * @param {string} id
   */
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  /**
   * POST /api/orders
   * @param {Object} orderData
   */
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  /**
   * PATCH /api/orders/:id/status
   * @param {string} id
   * @param {string} status
   */
  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  /**
   * DELETE /api/orders/:id
   * @param {string} id
   */
  deleteOrder: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  }
};

export const productService = {
  /**
   * GET /api/products
   */
  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  }
};

export const analyticsService = {
  /**
   * GET /api/analytics/stats
   */
  getStats: async () => {
    const response = await api.get('/analytics/stats');
    return response.data;
  }
};

export default api;
