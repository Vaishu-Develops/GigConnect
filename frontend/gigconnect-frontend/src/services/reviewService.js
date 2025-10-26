import api from './api';

export const reviewService = {
  async submitReview(reviewData) {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  async getFreelancerReviews(freelancerId, page = 1, limit = 10) {
    const response = await api.get(`/reviews/freelancer/${freelancerId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getUserReviews(userId) {
    const response = await api.get(`/reviews/freelancer/${userId}`);
    return response.data;
  },

  async getMyReviews() {
    const response = await api.get('/reviews/user/my-reviews');
    return response.data;
  },

  async updateReview(reviewId, reviewData) {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  async deleteReview(reviewId) {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  }
};