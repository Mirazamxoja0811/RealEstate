import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config';
import { tenantMiddleware } from './common/middleware/tenant.middleware';
import authRoutes from './modules/auth/auth.routes';
import healthRoutes from './modules/health/health.routes';
import propertiesRoutes from './modules/properties/properties.routes';
import clientsRoutes from './modules/clients/clients.routes';

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(
  cors({
    origin: true, // Allow Telegram Mini App webviews and web clients
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Tenant isolation middleware
app.use(tenantMiddleware);

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/clients', clientsRoutes);

// Base route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'RealEstate CRM & ERP API is running',
    version: '1.0.0',
    docs: '/api/health',
  });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(config.env === 'development' ? { stack: err.stack } : {}),
  });
});

const server = app.listen(config.port, () => {
  console.log(`🚀 RealEstate CRM Server is running on port ${config.port} in ${config.env} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export default app;
