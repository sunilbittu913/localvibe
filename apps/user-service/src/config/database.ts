import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "./env";
import * as schema from "../db/schema";

/**
 * MySQL connection pool configuration.
 * Uses mysql2/promise for async operations with connection pooling.
 */
const poolConnection = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

/**
 * Drizzle ORM instance configured with MySQL pool and schema.
 * This is the primary database interface used throughout the application.
 */
export const db = drizzle(poolConnection, {
  schema,
  mode: "default",
});

/**
 * Test the database connection.
 * Should be called during application startup to verify connectivity.
 */
export async function testDatabaseConnection(): Promise<void> {
  try {
    const connection = await poolConnection.getConnection();
    console.log("✅ Database connection established successfully");
    connection.release();
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    throw error;
  }
}

export { poolConnection };
