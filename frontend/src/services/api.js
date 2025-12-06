import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Assets API
export const assetsAPI = {
  getAll: (params) => api.get('/assets', { params }),
  getById: (id) => api.get(`/assets/${id}`),
  create: (data) => api.post('/assets', data),
  update: (id, data) => api.put(`/assets/${id}`, data),
  delete: (id) => api.delete(`/assets/${id}`),
};

// Threats API
export const threatsAPI = {
  getAll: (params) => api.get('/threats', { params }),
  getById: (id) => api.get(`/threats/${id}`),
  create: (data) => api.post('/threats', data),
  update: (id, data) => api.put(`/threats/${id}`, data),
  delete: (id) => api.delete(`/threats/${id}`),
};

// Vulnerabilities API
export const vulnerabilitiesAPI = {
  getAll: (params) => api.get('/vulnerabilities', { params }),
  getById: (id) => api.get(`/vulnerabilities/${id}`),
  create: (data) => api.post('/vulnerabilities', data),
  update: (id, data) => api.put(`/vulnerabilities/${id}`, data),
  delete: (id) => api.delete(`/vulnerabilities/${id}`),
};

// Risks API
export const risksAPI = {
  getAll: (params) => api.get('/risks', { params }),
  getById: (id) => api.get(`/risks/${id}`),
  create: (data) => api.post('/risks', data),
  update: (id, data) => api.put(`/risks/${id}`, data),
  delete: (id) => api.delete(`/risks/${id}`),
  getStats: () => api.get('/risks/stats'),
};

// Treatments API
export const treatmentsAPI = {
  getAll: (params) => api.get('/treatments', { params }),
  getById: (id) => api.get(`/treatments/${id}`),
  create: (data) => api.post('/treatments', data),
  update: (id, data) => api.put(`/treatments/${id}`, data),
  delete: (id) => api.delete(`/treatments/${id}`),
  getStats: () => api.get('/treatments/stats'),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

// Reports API
export const reportsAPI = {
  downloadPDF: () => {
    window.open(`${API_BASE_URL}/reports/pdf`, '_blank');
  },
  downloadExcel: () => {
    window.open(`${API_BASE_URL}/reports/excel`, '_blank');
  },
};

export default api;
