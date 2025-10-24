import api from './api';

export const paymentService = {
  async createOrder(orderData) {
    const response = await api.post('/payments/create-order', orderData);
    return response.data;
  },

  async verifyPayment(paymentData) {
    const response = await api.post('/payments/verify', paymentData);
    return response.data;
  },

  async getPayment(orderId) {
    const response = await api.get(`/payments/${orderId}`);
    return response.data;
  },

  async getUserPayments() {
    const response = await api.get('/payments/user/my-payments');
    return response.data;
  },

  async getPaymentHistory() {
    const response = await api.get('/payments/history');
    return response.data;
  },
};