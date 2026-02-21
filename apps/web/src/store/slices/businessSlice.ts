import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { businessService, BusinessFilters } from '../../services/businessService';

interface Business {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  addressLine1: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  latitude: string | null;
  longitude: string | null;
  logo: string | null;
  coverImage: string | null;
  openingTime: string | null;
  closingTime: string | null;
  workingDays: string | null;
  isActive: boolean;
  isVerified: boolean;
  averageRating: string;
  totalReviews: number;
  categoryId: number;
  subcategoryId: number | null;
  ownerId: number;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  subcategories: Array<{
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    sortOrder: number;
  }>;
}

interface BusinessState {
  businesses: Business[];
  currentBusiness: Business | null;
  categories: Category[];
  jobs: any[];
  offers: any[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: BusinessState = {
  businesses: [],
  currentBusiness: null,
  categories: [],
  jobs: [],
  offers: [],
  loading: false,
  error: null,
  pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
};

export const fetchBusinesses = createAsyncThunk('business/fetchAll', async (filters: BusinessFilters | undefined, { rejectWithValue }) => {
  try {
    const response = await businessService.list(filters);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch businesses');
  }
});

export const fetchBusinessById = createAsyncThunk('business/fetchById', async (id: string, { rejectWithValue }) => {
  try {
    const response = await businessService.getById(id);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch business');
  }
});

export const fetchCategories = createAsyncThunk('business/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await businessService.getCategories();
    return response.data.categories;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
  }
});

export const fetchJobs = createAsyncThunk('business/fetchJobs', async (filters: Record<string, unknown> | undefined, { rejectWithValue }) => {
  try {
    const response = await businessService.getJobs(filters);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
  }
});

export const fetchOffers = createAsyncThunk('business/fetchOffers', async (filters: Record<string, unknown> | undefined, { rejectWithValue }) => {
  try {
    const response = await businessService.getOffers(filters);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch offers');
  }
});

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    clearCurrentBusiness: (state) => { state.currentBusiness = null; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinesses.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBusinesses.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses = action.payload.data?.businesses || [];
        if (action.payload.pagination) state.pagination = action.payload.pagination;
      })
      .addCase(fetchBusinesses.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchBusinessById.pending, (state) => { state.loading = true; })
      .addCase(fetchBusinessById.fulfilled, (state, action) => { state.loading = false; state.currentBusiness = action.payload?.business || action.payload; })
      .addCase(fetchBusinessById.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload || []; })
      .addCase(fetchJobs.fulfilled, (state, action) => { state.jobs = action.payload?.jobs || action.payload || []; })
      .addCase(fetchOffers.fulfilled, (state, action) => { state.offers = action.payload?.offers || action.payload || []; });
  },
});

export const { clearCurrentBusiness, clearError } = businessSlice.actions;
export default businessSlice.reducer;
