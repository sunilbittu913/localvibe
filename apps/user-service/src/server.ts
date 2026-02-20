import { createApp } from './app';
import { env } from './config/env';
import { testDatabaseConnection, closeDatabaseConnection } from './config/database';

/**
 * LocalVibe User Service
 *
 * Microservice responsible for user registration, authentication,
 * profile management, and JWT token handling.
 *
 * Entry point for the service. Initializes the Express server,
 * tests the database connection, and starts listening for requests.
 */
async function startServer(): Promise<void> {
  try {
    // Create the Express application
    const app = createApp();

    // Test database connectivity
    console.log('🔄 Testing database connection...');
    await testDatabaseConnection();

    // Start the HTTP server
    app.listen(env.PORT, () => {
      console.log(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║   👤 LocalVibe User Service                     ║
║                                                  ║
║   Environment : ${env.NODE_ENV.padEnd(30)}  ║
║   Port        : ${String(env.PORT).padEnd(30)}  ║
║   API Prefix  : ${env.API_PREFIX.padEnd(30)}  ║
║   Health      : http://localhost:${env.PORT}${env.API_PREFIX}/health  ║
║                                                  ║
╚══════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start User Service:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error) => {
  console.error('❌ Unhandled Rejection:', reason.message);
  console.error(reason.stack);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error(error.stack);
  process.exit(1);
});

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  await closeDatabaseConnection();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  await closeDatabaseConnection();
  process.exit(0);
});

// Start the server
startServer();
