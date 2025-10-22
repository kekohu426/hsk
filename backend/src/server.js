import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import wordRoutes from './routes/words.js';
import wordEntryRoutes from './routes/wordEntry.js';
import publicWordsRoutes from './routes/publicWords.js';
import articleRoutes from './routes/articles.js';
import learnRoutes from './routes/learn.js';
import userRoutes from './routes/user.js';
import textRoutes from './routes/text.js';
import adminRoutes from './routes/admin.js';
import landingPageAdminRoutes from './routes/landingPages.js';
import landingPagePublicRoutes from './routes/publicLandingPages.js';
import { errorHandler } from './middleware/errorHandler.js';
import { 
  createRateLimiter, 
  securityHeaders, 
  sanitizeInput,
  requestLogger 
} from './middleware/security.js';

dotenv.config();

// Validate required environment variables (only in production)
const requiredEnvVars = ['JWT_SECRET'];
if (process.env.NODE_ENV === 'production') {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`❌ FATAL: ${envVar} environment variable is not set!`);
      process.exit(1);
    }
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy (for correct IP addresses behind proxy)
app.set('trust proxy', 1);

// Security headers
app.use(securityHeaders);

// Request logging (only in non-test environment)
if (process.env.NODE_ENV !== 'test') {
  app.use(requestLogger);
}

// CORS configuration - 允许所有来源和方法(开发环境)
app.use(cors({
  origin: function (origin, callback) {
    // 允许所有来源(开发环境)
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitizeInput);

// Rate limiting (only in production)
if (process.env.NODE_ENV === 'production') {
  app.use(createRateLimiter());
}

// Health check with detailed information
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
    }
  };

  // Check database connection
  try {
    const prisma = (await import('./utils/prisma.js')).default;
    await prisma.$queryRaw`SELECT 1`;
    health.database = 'connected';
  } catch (error) {
    health.database = 'disconnected';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/words', publicWordsRoutes);  // 用户端公开词条API
app.use('/api/admin/words', wordEntryRoutes);  // 词条管理路由（管理端）
app.use('/api/articles', articleRoutes);
app.use('/api/learn', learnRoutes);
app.use('/api/user', userRoutes);
app.use('/api/text', textRoutes);
app.use('/api/admin/landing-pages', landingPageAdminRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/landing-pages', landingPagePublicRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✅ Health check: http://localhost:${PORT}/health`);
  });
}

export default app;
