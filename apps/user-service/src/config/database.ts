import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";
import { env } from "./env";

/**
 * PostgreSQL connection using postgres.js driver.
 * Uses a connection string built from environment variables,
 * or falls back to DATABASE_URL if provided.
 */
const connectionString =
  process.env.DATABASE_URL ||
  `postgres://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;

const queryClient = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

/**
 * Drizzle ORM instance configured with PostgreSQL and schema.
 * This is the primary database interface used throughout the application.
 */
export const db = drizzle(queryClient, {
  schema,
});

/**
 * Test the database connection.
 * Should be called during application startup to verify connectivity.
 */
export async function testDatabaseConnection(): Promise<void> {
  try {
    await queryClient`SELECT 1`;
    console.log("✅ Database connection established successfully");
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    throw error;
  }
}

/**
 * Close the database connection pool.
 * Should be called during graceful shutdown.
 */
export async function closeDatabaseConnection(): Promise<void> {
  await queryClient.end();
}

export { queryClient };
