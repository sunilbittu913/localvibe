import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

/**
 * Drizzle Kit Configuration
 * Used for generating and running database migrations.
 */
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      `postgres://${process.env.DB_USER || "postgres"}:${process.env.DB_PASSWORD || ""}@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || "5432"}/${process.env.DB_NAME || "localvibe"}`,
  },
});
