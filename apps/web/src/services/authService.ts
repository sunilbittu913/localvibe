import api from './api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  role?: 'normal_user' | 'business_user';
}

export const authService = {
  login: async (payload: LoginPayload) => {
    const { data } = await api.post('/auth/login', payload);
    return data;
  },

  register: async (payload: RegisterPayload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },

  refreshToken: async (refreshToken: string) => {
    const { data } = await api.post('/auth/refresh-token', { refreshToken });
    return data;
  },

  getProfile: async () => {
    const { data } = await api.get('/users/me');
    return data;
  },

  updateProfile: async (payload: { firstName?: string; lastName?: string; phone?: string; avatar?: string }) => {
    const { data } = await api.put('/users/me', payload);
    return data;
  },
};
