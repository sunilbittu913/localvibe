import { z } from "zod";

/**
 * Zod validation schemas for request body validation.
 * These schemas ensure type safety and data integrity at the API boundary.
 */

// ============================================
// AUTH VALIDATORS
// ============================================

/**
 * Registration request validation schema.
 */
export const registerSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be less than 100 characters")
    .trim(),
  lastName: z
    .string()
    .max(100, "Last name must be less than 100 characters")
    .trim()
    .optional(),
  phone: z
    .string()
    .regex(/^(\+91|91)?[6-9]\d{9}$/, "Invalid Indian phone number")
    .optional(),
  role: z
    .enum(["normal_user", "business_user"])
    .optional()
    .default("normal_user"),
});

/**
 * Login request validation schema.
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Refresh token request validation schema.
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// ============================================
// USER VALIDATORS
// ============================================

/**
 * Update user profile validation schema.
 */
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be less than 100 characters")
    .trim()
    .optional(),
  lastName: z
    .string()
    .max(100, "Last name must be less than 100 characters")
    .trim()
    .optional(),
  phone: z
    .string()
    .regex(/^(\+91|91)?[6-9]\d{9}$/, "Invalid Indian phone number")
    .optional(),
  avatar: z
    .string()
    .url("Invalid avatar URL")
    .max(500, "Avatar URL must be less than 500 characters")
    .optional(),
});

// ============================================
// BUSINESS VALIDATORS
// ============================================

/**
 * Create business validation schema.
 */
export const createBusinessSchema = z.object({
  name: z
    .string()
    .min(1, "Business name is required")
    .max(200, "Business name must be less than 200 characters")
    .trim(),
  categoryId: z.number().int().positive("Category ID must be a positive integer"),
  subcategoryId: z.number().int().positive("Subcategory ID must be a positive integer").optional(),
  description: z.string().max(5000, "Description must be less than 5000 characters").optional(),
  phone: z.string().max(20, "Phone must be less than 20 characters").optional(),
  email: z.string().email("Invalid email address").max(255).optional(),
  website: z.string().url("Invalid website URL").max(500).optional(),
  addressLine1: z.string().max(255).optional(),
  addressLine2: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  pincode: z.string().max(10).optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  openingTime: z.string().max(10).optional(),
  closingTime: z.string().max(10).optional(),
  workingDays: z.string().max(100).optional(),
});

/**
 * Update business validation schema (all fields optional).
 */
export const updateBusinessSchema = createBusinessSchema.partial();

/**
 * Business query filters validation schema.
 */
export const businessQuerySchema = z.object({
  categoryId: z.coerce.number().int().positive().optional(),
  subcategoryId: z.coerce.number().int().positive().optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  pincode: z.string().max(10).optional(),
  isVerified: z.coerce.boolean().optional(),
  search: z.string().max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["name", "createdAt", "averageRating", "totalReviews"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// ============================================
// CATEGORY VALIDATORS
// ============================================

/**
 * Create category validation schema.
 */
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name must be less than 100 characters")
    .trim(),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  icon: z.string().max(255).optional(),
  sortOrder: z.number().int().min(0).default(0),
});
