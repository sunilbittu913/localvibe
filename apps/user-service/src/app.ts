import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { apiRateLimiter } from "./middleware/rateLimit.middleware";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import apiRouter from "./routes";

/**
 * Create and configure the Express application.
 * Sets up all global middleware, routes, and error handlers.
 *
 * @returns Configured Express application instance
 */
export function createApp(): Application {
  const app = express();

  // ============================================
  // SECURITY MIDDLEWARE
  // ============================================

  /**
   * Helmet - Sets various HTTP security headers.
   * Protects against common web vulnerabilities like XSS, clickjacking, etc.
   */
  app.use(helmet());

  /**
   * CORS - Cross-Origin Resource Sharing configuration.
   * Allows requests from the configured frontend origin.
   */
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      credentials: true,
      maxAge: 86400, // Cache preflight requests for 24 hours
    })
  );

  // ============================================
  // PARSING MIDDLEWARE
  // ============================================

  /**
   * JSON body parser with a 10MB limit.
   * Parses incoming JSON request bodies.
   */
  app.use(express.json({ limit: "10mb" }));

  /**
   * URL-encoded body parser.
   * Parses incoming URL-encoded form data.
   */
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // ============================================
  // LOGGING MIDDLEWARE
  // ============================================

  /**
   * Morgan HTTP request logger.
   * Uses 'dev' format in development and 'combined' in production.
   */
  if (env.isDevelopment) {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined"));
  }

  // ============================================
  // RATE LIMITING
  // ============================================

  /**
   * Global API rate limiter.
   * Limits requests per IP to prevent abuse.
   */
  app.use(env.API_PREFIX, apiRateLimiter);

  // ============================================
  // API ROUTES
  // ============================================

  /**
   * Mount all API routes under the configured prefix (default: /api).
   */
  app.use(env.API_PREFIX, apiRouter);

  /**
   * Root endpoint - API information.
   */
  app.get("/", (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to LocalVibe API",
      version: "1.0.0",
      documentation: `${env.API_PREFIX}/health`,
    });
  });

  // ============================================
  // ERROR HANDLING
  // ============================================

  /**
   * 404 handler for undefined routes.
   * Must be placed after all route definitions.
   */
  app.use(notFoundHandler);

  /**
   * Global error handler.
   * Must be the last middleware registered.
   */
  app.use(errorHandler);

  return app;
}
