import axios from 'axios';

const API_BASE_URL = 'https://feedbackhub-server-etyk.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const feedbackAPI = {
  // Submit feedback
  submitFeedback: async (feedbackData) => {
    const response = await api.post('/feedback', feedbackData);
    return response.data;
  },

  // Get all feedbacks (for admin)
  getAllFeedbacks: async () => {
    const response = await api.get('/feedback');
    return response.data;
  },

  // Get user feedbacks
  getUserFeedbacks: async (userId) => {
    const response = await api.get(`/feedback/user/${userId}`);
    return response.data;
  },
};

export const userAPI = {
  // Get all users (admin)
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
};

export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },
};

export default api;