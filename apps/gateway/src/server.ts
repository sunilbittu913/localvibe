import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.GATEWAY_PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());

// ============================================
// SERVICE ROUTES (Proxy to microservices)
// ============================================

/**
 * Proxy /api/auth/* and /api/users/* to User Service
 */
app.use(
  '/api/auth',
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '/api/auth' },
  })
);

app.use(
  '/api/users',
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/api/users': '/api/users' },
  })
);

/**
 * Proxy /api/businesses/* and /api/categories/* to Business Service
 */
app.use(
  '/api/businesses',
  createProxyMiddleware({
    target: process.env.BUSINESS_SERVICE_URL || 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: { '^/api/businesses': '/api/businesses' },
  })
);

app.use(
  '/api/categories',
  createProxyMiddleware({
    target: process.env.BUSINESS_SERVICE_URL || 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: { '^/api/categories': '/api/categories' },
  })
);

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    service: 'api-gateway',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Welcome to LocalVibe API Gateway',
    version: '1.0.0',
    services: {
      'user-service': process.env.USER_SERVICE_URL || 'http://localhost:3001',
      'business-service': process.env.BUSINESS_SERVICE_URL || 'http://localhost:3002',
    },
  });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║   🚀 LocalVibe API Gateway                      ║
║   Port: ${String(PORT).padEnd(41)}║
║   Health: http://localhost:${PORT}/health           ║
║                                                  ║
╚══════════════════════════════════════════════════╝
  `);
});
