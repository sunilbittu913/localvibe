import { Response } from "express";
import { ApiResponse, PaginatedResponse } from "../types";

/**
 * Generate a URL-friendly slug from a string.
 * Converts to lowercase, replaces spaces and special characters with hyphens.
 *
 * @param text - The text to convert to a slug
 * @returns URL-friendly slug string
 *
 * @example
 * generateSlug("My Business Name") // "my-business-name"
 * generateSlug("Café & Restaurant") // "caf-restaurant"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generate a unique slug by appending a random suffix.
 * Useful for ensuring slug uniqueness in the database.
 *
 * @param text - The text to convert to a slug
 * @returns Unique slug string
 */
export function generateUniqueSlug(text: string): string {
  const baseSlug = generateSlug(text);
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${suffix}`;
}

/**
 * Send a standardized success response.
 *
 * @param res - Express response object
 * @param statusCode - HTTP status code
 * @param message - Success message
 * @param data - Response data payload
 */
export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
): void {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
}

/**
 * Send a standardized paginated response.
 *
 * @param res - Express response object
 * @param message - Success message
 * @param data - Response data payload
 * @param pagination - Pagination metadata
 */
export function sendPaginated<T>(
  res: Response,
  message: string,
  data: T,
  pagination: { page: number; limit: number; total: number }
): void {
  const response: PaginatedResponse<T> = {
    success: true,
    message,
    data,
    pagination: {
      ...pagination,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  };
  res.status(200).json(response);
}

/**
 * Validate that an email address is properly formatted.
 *
 * @param email - Email address to validate
 * @returns True if the email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate that a phone number is properly formatted for India.
 * Accepts formats: +91XXXXXXXXXX, 91XXXXXXXXXX, XXXXXXXXXX
 *
 * @param phone - Phone number to validate
 * @returns True if the phone number is valid
 */
export function isValidIndianPhone(phone: string): boolean {
  const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ""));
}

/**
 * Sanitize a string by trimming whitespace and removing potentially dangerous characters.
 *
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/<[^>]*>/g, "");
}
