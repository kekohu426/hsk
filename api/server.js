const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== Middleware ====================

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ==================== Routes ====================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API version endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'ChineseMaster API',
    version: '1.0.0',
    description: 'HSK Learning Platform with AI-powered content generation',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      words: '/api/words/*',
      articles: '/api/articles/*',
      learn: '/api/learn/*',
      user: '/api/user/*',
      admin: '/api/admin/*'
    }
  });
});

// ==================== Route Imports (will be created) ====================
// const authRoutes = require('./routes/auth');
// const wordRoutes = require('./routes/words');
// const articleRoutes = require('./routes/articles');
// const learnRoutes = require('./routes/learn');
// const userRoutes = require('./routes/user');
// const adminRoutes = require('./routes/admin');

// app.use('/api/auth', authRoutes);
// app.use('/api/words', wordRoutes);
// app.use('/api/articles', articleRoutes);
// app.use('/api/learn', learnRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/admin', adminRoutes);

// ==================== Error Handling ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: isDevelopment ? err.message : 'An error occurred',
    ...(isDevelopment && { stack: err.stack }),
    timestamp: new Date().toISOString()
  });
});

// ==================== Server Start ====================

app.listen(PORT, () => {
  console.log('\n🚀 ChineseMaster API Server Started\n');
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Port: ${PORT}`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/health\n`);
  console.log('📝 Available Routes:');
  console.log('   GET  /health          - Health check');
  console.log('   GET  /api             - API information');
  console.log('   POST /api/auth/*      - Authentication (coming soon)');
  console.log('   GET  /api/words/*     - Word endpoints (coming soon)');
  console.log('   GET  /api/articles/*  - Article endpoints (coming soon)');
  console.log('   POST /api/learn/*     - Learning endpoints (coming soon)');
  console.log('   GET  /api/user/*      - User endpoints (coming soon)');
  console.log('   GET  /api/admin/*     - Admin endpoints (coming soon)\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = app;
