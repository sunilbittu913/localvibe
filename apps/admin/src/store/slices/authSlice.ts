import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../../services/adminService';

interface AdminUser {
  id: number;
  uuid: string;
  email: string;
  firstName: string;
  lastName: string | null;
  role: string;
}

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const storedUser = localStorage.getItem('admin_user');
const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!localStorage.getItem('admin_accessToken'),
  loading: false,
  error: null,
};

export const adminLogin = createAsyncThunk(
  'auth/adminLogin',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await adminService.login(email, password);
      const { user, tokens } = response.data;
      if (user.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }
      localStorage.setItem('admin_accessToken', tokens.accessToken);
      localStorage.setItem('admin_refreshToken', tokens.refreshToken);
      localStorage.setItem('admin_user', JSON.stringify(user));
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('admin_accessToken');
      localStorage.removeItem('admin_refreshToken');
      localStorage.removeItem('admin_user');
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(adminLogin.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; state.isAuthenticated = true; })
      .addCase(adminLogin.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
