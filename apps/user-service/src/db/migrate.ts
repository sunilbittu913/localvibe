import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, queryClient } from "../config/database";

/**
 * Database Migration Script
 *
 * Runs all pending Drizzle ORM migrations against the configured database.
 * Usage: npx tsx src/db/migrate.ts
 */
async function runMigrations(): Promise<void> {
  console.log("🔄 Running database migrations...");

  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Migrations completed successfully.");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await queryClient.end();
    process.exit(0);
  }
}

runMigrations();
