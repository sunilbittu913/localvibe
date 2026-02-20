import rateLimit from "express-rate-limit";
import { env } from "../config/env";

/**
 * General API Rate Limiter
 * Limits the number of requests from a single IP address.
 * Default: 100 requests per 15-minute window.
 */
export const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Authentication Rate Limiter
 * Stricter rate limiting for authentication endpoints to prevent brute force attacks.
 * Default: 10 requests per 15-minute window.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
