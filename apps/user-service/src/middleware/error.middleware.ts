import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { ApiErrorResponse } from "../types";
import { env } from "../config/env";

/**
 * Global Error Handling Middleware
 * Catches all errors thrown in route handlers and middleware,
 * and sends a standardized JSON error response.
 *
 * Must be registered as the last middleware in the Express app.
 */
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Default error values
  let statusCode = 500;
  let message = "Internal server error";
  let errors: Array<{ field?: string; message: string }> | undefined;

  // Handle known operational errors (AppError instances)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }

  // Handle Zod validation errors
  if (err.name === "ZodError") {
    statusCode = 400;
    message = "Validation failed";
    const zodError = err as any;
    errors = zodError.errors?.map((e: any) => ({
      field: e.path?.join("."),
      message: e.message,
    }));
  }

  // Handle MySQL duplicate entry errors
  if ((err as any).code === "ER_DUP_ENTRY") {
    statusCode = 409;
    message = "A record with this information already exists.";
  }

  // Handle JSON parse errors
  if (err instanceof SyntaxError && "body" in err) {
    statusCode = 400;
    message = "Invalid JSON in request body.";
  }

  // Log error for debugging (in development, log full stack)
  if (!env.isProduction) {
    console.error(`[ERROR] ${statusCode} - ${message}`);
    console.error(err.stack);
  } else {
    // In production, only log server errors
    if (statusCode >= 500) {
      console.error(`[ERROR] ${statusCode} - ${message}`, err.stack);
    }
  }

  // Build the error response
  const errorResponse: ApiErrorResponse = {
    success: false,
    message,
    errors,
  };

  // Include stack trace in development mode only
  if (!env.isProduction) {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found Handler
 * Catches requests to undefined routes and returns a 404 error.
 * Must be registered after all route definitions.
 */
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(AppError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};
