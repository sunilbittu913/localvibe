/**
 * User Service Types
 *
 * Re-exports shared types and defines service-specific types.
 * Express-specific types (like AuthenticatedRequest) are kept here
 * since they depend on Express which is a backend-only dependency.
 */

import { Request } from 'express';

// Re-export all shared types for backward compatibility
export type {
  UserRole,
  JwtPayload,
  RefreshTokenPayload,
  RegisterRequestBody,
  LoginRequestBody,
  RefreshTokenRequestBody,
  AuthResponse,
  CreateBusinessRequestBody,
  UpdateBusinessRequestBody,
  BusinessQueryFilters,
  CreateCategoryRequestBody,
  ApiResponse,
  PaginatedResponse,
  ApiErrorResponse,
  UpdateProfileRequestBody,
} from '@localvibe/shared-types';

// Import types needed for local interfaces
import type { JwtPayload } from '@localvibe/shared-types';

/**
 * Extended Express Request with authenticated user data.
 * This is Express-specific and stays in the backend service.
 */
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
