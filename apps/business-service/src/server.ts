import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.BUSINESS_SERVICE_PORT || 3002;

// ============================================
// MIDDLEWARE
// ============================================
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    service: 'business-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ============================================
// ROUTES
// ============================================
// TODO: Import and mount business routes from migrated code
// TODO: Import and mount category routes from migrated code

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'LocalVibe Business Service',
    version: '1.0.0',
  });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║   🏢 LocalVibe Business Service                 ║
║   Port: ${String(PORT).padEnd(41)}║
║   Health: http://localhost:${PORT}/health           ║
║                                                  ║
╚══════════════════════════════════════════════════╝
  `);
});
