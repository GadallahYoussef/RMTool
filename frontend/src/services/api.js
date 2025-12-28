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
// Reports API
export const reportsAPI = {
  downloadPDF: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/pdf`, {
        responseType: 'blob',
      });

      const blob = new Blob([response. data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `risk_report_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF report.');
    }
  },

  downloadExcel: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/excel`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { 
        type: 'application/vnd. openxmlformats-officedocument.spreadsheetml. sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `risk_export_${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading Excel:', error);
      alert('Failed to download Excel file.');
    }
  },
};

export default api;
