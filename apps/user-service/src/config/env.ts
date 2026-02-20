import dotenv from "dotenv";
import path from "path";

/**
 * Load environment variables from .env file.
 * Must be called before accessing any env variables.
 */
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

/**
 * Application environment configuration.
 * All environment variables are validated and typed here.
 */
export const env = {
  // Server
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3000", 10),
  API_PREFIX: process.env.API_PREFIX || "/api",

  // Database
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: parseInt(process.env.DB_PORT || "3306", 10),
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_NAME: process.env.DB_NAME || "localvibe",

  // JWT
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "default_access_secret",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "default_refresh_secret",
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || "15m",
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || "7d",

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || "debug",

  /**
   * Check if the application is running in production mode.
   */
  get isProduction(): boolean {
    return this.NODE_ENV === "production";
  },

  /**
   * Check if the application is running in development mode.
   */
  get isDevelopment(): boolean {
    return this.NODE_ENV === "development";
  },
} as const;
