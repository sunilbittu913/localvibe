import { migrate } from "drizzle-orm/mysql2/migrator";
import { db, poolConnection } from "../config/database";

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
    await poolConnection.end();
    process.exit(0);
  }
}

runMigrations();
