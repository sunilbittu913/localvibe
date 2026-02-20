/**
 * @localvibe/shared-types
 *
 * Shared TypeScript types and interfaces used across
 * all LocalVibe applications and services.
 */

// ============================================
// USER TYPES
// ============================================

/**
 * User roles supported by the platform.
 */
export type UserRole = 'normal_user' | 'business_user' | 'admin';

/**
 * JWT payload structure for access tokens.
 */
export interface JwtPayload {
  userId: number;
  uuid: string;
  email: string;
  role: UserRole;
}

/**
 * JWT payload structure for refresh tokens.
 */
export interface RefreshTokenPayload {
  userId: number;
  uuid: string;
  tokenVersion?: number;
}

// ============================================
// AUTH TYPES
// ============================================

/**
 * Registration request body.
 */
export interface RegisterRequestBody {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  role?: UserRole;
}

/**
 * Login request body.
 */
export interface LoginRequestBody {
  email: string;
  password: string;
}

/**
 * Refresh token request body.
 */
export interface RefreshTokenRequestBody {
  refreshToken: string;
}

/**
 * Auth response with tokens.
 */
export interface AuthResponse {
  user: {
    id: number;
    uuid: string;
    email: string;
    firstName: string;
    lastName: string | null;
    role: UserRole;
    phone: string | null;
    avatar: string | null;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

// ============================================
// BUSINESS TYPES
// ============================================

/**
 * Create business request body.
 */
export interface CreateBusinessRequestBody {
  name: string;
  categoryId: number;
  subcategoryId?: number;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: string;
  longitude?: string;
  openingTime?: string;
  closingTime?: string;
  workingDays?: string;
}

/**
 * Update business request body.
 */
export interface UpdateBusinessRequestBody extends Partial<CreateBusinessRequestBody> {}

/**
 * Business query filters.
 */
export interface BusinessQueryFilters {
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

// ============================================
// CATEGORY TYPES
// ============================================

/**
 * Create category request body.
 */
export interface CreateCategoryRequestBody {
  name: string;
  description?: string;
  icon?: string;
  sortOrder?: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

/**
 * Standard API success response.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * Paginated API response.
 */
export interface PaginatedResponse<T = unknown> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * API error response.
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
  stack?: string;
}

// ============================================
// UPDATE PROFILE TYPES
// ============================================

/**
 * Update user profile request body.
 */
export interface UpdateProfileRequestBody {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}
