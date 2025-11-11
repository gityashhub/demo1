import axios from 'axios';

const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : `https://${window.location.hostname}:3000/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const freelancerAPI = {
  getAll: (params) => api.get('/freelancers', { params }),
  getDetails: (id) => api.get(`/freelancers/${id}`),
  createProfile: (data) => api.post('/freelancer/create-profile', data),
  updateProfile: (data) => api.put('/freelancer/update-profile', data),
  deleteProfile: () => api.delete('/freelancer/delete-profile'),
  getProfile: (userId) => api.get(`/freelancer/profile/${userId}`),
};

export const pricingAPI = {
  create: (data) => api.post('/pricing/create-package', data),
  getByFreelancer: (freelancerId) => api.get(`/pricing/packages/${freelancerId}`),
  update: (id, data) => api.put(`/pricing/update-package/${id}`, data),
  delete: (id) => api.delete(`/pricing/delete-package/${id}`),
};

export const projectAPI = {
  create: (data) => api.post('/project-showcase/create', data),
  getByFreelancer: (freelancerId) => api.get(`/project-showcase/freelancer/${freelancerId}`),
  update: (id, data) => api.put(`/project-showcase/update/${id}`, data),
  delete: (id) => api.delete(`/project-showcase/delete/${id}`),
};

export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  accept: (id) => api.patch(`/bookings/${id}/accept`),
  start: (id) => api.patch(`/bookings/${id}/start`),
  submit: (id) => api.patch(`/bookings/${id}/submit`),
  approve: (id) => api.patch(`/bookings/${id}/approve`),
  markPaid: (id) => api.patch(`/bookings/${id}/mark-paid`),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
};

export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getByFreelancer: (freelancerId) => api.get(`/reviews/${freelancerId}`),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/mark-all-read'),
};
