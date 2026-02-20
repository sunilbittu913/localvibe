/**
 * Custom application error class.
 * Extends the native Error class with HTTP status codes and operational flags.
 * Used throughout the application for consistent error handling.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: Array<{ field?: string; message: string }>;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    errors?: Array<{ field?: string; message: string }>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    // Maintain proper stack trace for debugging
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, AppError.prototype);
  }

  /**
   * Factory method for 400 Bad Request errors.
   */
  static badRequest(message: string, errors?: Array<{ field?: string; message: string }>): AppError {
    return new AppError(message, 400, true, errors);
  }

  /**
   * Factory method for 401 Unauthorized errors.
   */
  static unauthorized(message: string = "Unauthorized"): AppError {
    return new AppError(message, 401);
  }

  /**
   * Factory method for 403 Forbidden errors.
   */
  static forbidden(message: string = "Forbidden"): AppError {
    return new AppError(message, 403);
  }

  /**
   * Factory method for 404 Not Found errors.
   */
  static notFound(message: string = "Resource not found"): AppError {
    return new AppError(message, 404);
  }

  /**
   * Factory method for 409 Conflict errors.
   */
  static conflict(message: string): AppError {
    return new AppError(message, 409);
  }

  /**
   * Factory method for 500 Internal Server errors.
   */
  static internal(message: string = "Internal server error"): AppError {
    return new AppError(message, 500, false);
  }
}
