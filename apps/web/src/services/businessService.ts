import api from './api';

export interface BusinessFilters {
  categoryId?: number;
  subcategoryId?: number;
  city?: string;
  state?: string;
  pincode?: string;
  isVerified?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const businessService = {
  list: async (filters?: BusinessFilters) => {
    const { data } = await api.get('/businesses', { params: filters });
    return data;
  },

  getById: async (id: string | number) => {
    const { data } = await api.get(`/businesses/${id}`);
    return data;
  },

  create: async (payload: Record<string, unknown>) => {
    const { data } = await api.post('/businesses', payload);
    return data;
  },

  update: async (id: string | number, payload: Record<string, unknown>) => {
    const { data } = await api.put(`/businesses/${id}`, payload);
    return data;
  },

  getCategories: async () => {
    const { data } = await api.get('/categories');
    return data;
  },

  getJobs: async (filters?: Record<string, unknown>) => {
    const { data } = await api.get('/jobs', { params: filters });
    return data;
  },

  getOffers: async (filters?: Record<string, unknown>) => {
    const { data } = await api.get('/offers', { params: filters });
    return data;
  },

  getReviews: async (businessId: string | number) => {
    const { data } = await api.get(`/businesses/${businessId}/reviews`);
    return data;
  },
};
