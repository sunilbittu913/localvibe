import { Response, NextFunction } from "express";
import { JwtService } from "../services/jwt.service";
import { AppError } from "../utils/AppError";
import { AuthenticatedRequest, UserRole } from "../types";

/**
 * Authentication Middleware
 * Verifies JWT access tokens from the Authorization header.
 * Attaches the decoded user data to the request object.
 *
 * Expected header format: Authorization: Bearer <token>
 */
export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw AppError.unauthorized("Access token is required. Please provide a valid Bearer token.");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw AppError.unauthorized("Invalid token format.");
    }

    // Verify and decode the token
    const decoded = JwtService.verifyAccessToken(token);

    // Attach user data to the request
    req.user = {
      userId: decoded.userId,
      uuid: decoded.uuid,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    // Handle specific JWT errors with user-friendly messages
    if (error.name === "TokenExpiredError") {
      next(AppError.unauthorized("Access token has expired. Please refresh your token."));
    } else if (error.name === "JsonWebTokenError") {
      next(AppError.unauthorized("Invalid access token. Please log in again."));
    } else if (error instanceof AppError) {
      next(error);
    } else {
      next(AppError.unauthorized("Authentication failed."));
    }
  }
};

/**
 * Role-Based Access Control (RBAC) Middleware
 * Restricts access to routes based on user roles.
 * Must be used after the authenticate middleware.
 *
 * @param allowedRoles - Array of roles that are permitted to access the route
 * @returns Express middleware function
 *
 * @example
 * // Only admins can access this route
 * router.post('/categories', authenticate, authorize(['admin']), createCategory);
 *
 * // Business users and admins can access this route
 * router.post('/businesses', authenticate, authorize(['business_user', 'admin']), createBusiness);
 */
export const authorize = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(AppError.unauthorized("Authentication required."));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(
        AppError.forbidden(
          `Access denied. This action requires one of the following roles: ${allowedRoles.join(", ")}.`
        )
      );
      return;
    }

    next();
  };
};

/**
 * Optional Authentication Middleware
 * Similar to authenticate, but does not throw an error if no token is provided.
 * Useful for routes that have different behavior for authenticated vs anonymous users.
 */
export const optionalAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token) {
        const decoded = JwtService.verifyAccessToken(token);
        req.user = {
          userId: decoded.userId,
          uuid: decoded.uuid,
          email: decoded.email,
          role: decoded.role,
        };
      }
    }

    next();
  } catch {
    // Token is invalid, but we don't throw an error for optional auth
    next();
  }
};
