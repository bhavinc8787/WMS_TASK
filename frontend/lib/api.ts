import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// Add token to requests
// apiClient.interceptors.request.use((config) => {
//   const token = Cookies.get('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// Handle token expiry
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       Cookies.remove('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export const authAPI = {
//   login: (email: string, password: string) =>
//     apiClient.post('/auth/login', { email, password }),
//   signup: (email: string, name: string, password: string) =>
//     apiClient.post('/auth/signup', { email, name, password }),
//   verifyToken: () => apiClient.get('/auth/verify'),
// };


export const warehouseAPI = {
  getAll: (page: number = 1, limit: number = 7) =>
    apiClient.get('/warehouses', { params: { page, limit } }),

  getById: (id: string) => apiClient.get(`/warehouses/${id}`),

  // Create warehouse with images (FormData)
  createWarehouse: (data: FormData) =>
    apiClient.post('/warehouses', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Update warehouse with images (FormData)
  updateWarehouse: (id: string, data: FormData) =>
    apiClient.put(`/warehouses/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteWarehouse: (id: string) => apiClient.delete(`/warehouses/${id}`),

  search: (
    query: string | { q?: string; state?: string; city?: string },
    page: number = 1,
    limit: number = 7
  ) => {
    const params: Record<string, any> =
      typeof query === 'string' ? { q: query } : { ...(query || {}) };

    Object.keys(params).forEach((key) => {
      if (params[key] === undefined || params[key]?.trim?.() === '') {
        delete params[key];
      }
    });

    return apiClient.get('/warehouses/search', { params: { ...params, page, limit } });
  },

  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/warehouses/${id}/status`, { status }),
};



export default apiClient;
