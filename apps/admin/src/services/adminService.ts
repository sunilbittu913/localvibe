import api from './api';

export const adminService = {
  // Auth
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  // Users
  getUsers: async (params?: Record<string, any>) => {
    const { data } = await api.get('/admin/users', { params });
    return data;
  },
  updateUser: async (id: number, payload: Record<string, any>) => {
    const { data } = await api.put(`/admin/users/${id}`, payload);
    return data;
  },
  toggleUserStatus: async (id: number) => {
    const { data } = await api.patch(`/admin/users/${id}/toggle-status`);
    return data;
  },

  // Businesses
  getBusinesses: async (params?: Record<string, any>) => {
    const { data } = await api.get('/businesses', { params });
    return data;
  },
  updateBusiness: async (id: number, payload: Record<string, any>) => {
    const { data } = await api.put(`/businesses/${id}`, payload);
    return data;
  },
  toggleBusinessStatus: async (id: number) => {
    const { data } = await api.patch(`/admin/businesses/${id}/toggle-status`);
    return data;
  },

  // Posts/Listings - Admin approval
  getPosts: async (params?: Record<string, any>) => {
    const { data } = await api.get('/admin/posts', { params });
    return data;
  },
  approvePost: async (id: number) => {
    const { data } = await api.patch(`/admin/posts/${id}/approve`);
    return data;
  },
  rejectPost: async (id: number, reason?: string) => {
    const { data } = await api.patch(`/admin/posts/${id}/reject`, { reason });
    return data;
  },

  // Categories
  getCategories: async () => {
    const { data } = await api.get('/categories');
    return data;
  },
  createCategory: async (payload: { name: string; description?: string; icon?: string; sortOrder?: number }) => {
    const { data } = await api.post('/categories', payload);
    return data;
  },
  updateCategory: async (id: number, payload: Record<string, any>) => {
    const { data } = await api.put(`/admin/categories/${id}`, payload);
    return data;
  },
  deleteCategory: async (id: number) => {
    const { data } = await api.delete(`/admin/categories/${id}`);
    return data;
  },

  // Dashboard stats
  getDashboardStats: async () => {
    const { data } = await api.get('/admin/dashboard/stats');
    return data;
  },

  // Content moderation
  getReports: async (params?: Record<string, any>) => {
    const { data } = await api.get('/admin/reports', { params });
    return data;
  },
  resolveReport: async (id: number, action: 'dismiss' | 'remove') => {
    const { data } = await api.patch(`/admin/reports/${id}`, { action });
    return data;
  },
};
