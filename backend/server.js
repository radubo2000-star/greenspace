// ============================================
// GREEN SPACE BACKEND SERVER
// ============================================
// Main server file - handles configuration and server startup
// All routes and logic are in separate modules
// ============================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// Import configuration
const config = require('./config');
const corsOptions = require('./config/cors');

// Import utilities
const { uploadFolder, videoUploadFolder, initializeFolders } = require('./utils/folders');

// Import routes
const routes = require('./routes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// ============================================
// EXPRESS APP SETUP
// ============================================

const app = express();

app.get('/', (req, res) => {
  res.json({ status: 'API running' });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/manifest.json', (req, res) => res.status(204).end());

// Security headers - allow cross-origin resource loading for static files
// (frontend and backend run on different ports/origins)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https://firebasestorage.googleapis.com', 'https://*.googleusercontent.com'],
      connectSrc: [
        "'self'",
        'https://firebasestorage.googleapis.com',
        'https://*.firebaseio.com',
        'https://*.googleapis.com',
        config.frontendUrl
      ],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
}));

// Cookie parser (required for CSRF double-submit cookie pattern)
app.use(cookieParser());

// ============================================
// STATIC FILE SERVING (before rate limiter so images/videos are not throttled)
// ============================================

app.use('/data/uploads/images', express.static(uploadFolder));
app.use('/data/uploads/videos', express.static(videoUploadFolder));

// Rate limiting is handled per-route in routes/index.js:
//   - formLimiter: 10 submissions / 15 min (forms)
//   - uploadLimiter: 20 uploads / 15 min (file uploads)
//   - adminAuth: protects admin and file routes
// No global limiter — it was causing 429 errors during development
// because React StrictMode doubles every API request.

// Parse JSON bodies with reasonable limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS - Enable preflight for all routes
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// Initialize data folders
initializeFolders();

// (Static files are served above, before any route middleware)

// ============================================
// MOUNT ROUTES
// ============================================

if (config.useApiPrefix) {
  app.use(config.apiPrefix, routes);
  console.log(`📍 API mounted at: ${config.apiPrefix}`);
} else {
  app.use('/', routes);
  console.log('📍 API mounted at: / (root)');
}

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found'
  });
});

// Error handler
app.use(errorHandler);

// ============================================
// SERVER START
// ============================================

if (config.isProduction()) {
  // Production with Passenger (cPanel)
  const prefix = config.useApiPrefix ? config.apiPrefix : '';
  
  console.log('');
  console.log('🚀 ====================================');
  console.log('🌱 Green Space Backend Server');
  console.log('🚀 ====================================');
  console.log('📡 Environment:', config.nodeEnv);
  console.log('🔗 Backend URL:', config.backendUrl);
  console.log('🌐 Frontend URL:', config.frontendUrl);
  console.log('📁 Upload folder:', uploadFolder);
  console.log('🎬 Video folder:', videoUploadFolder);
  console.log('📦 Max file size:', (config.maxVideoSize / 1024 / 1024).toFixed(0) + 'MB');
  console.log('📧 Email configured:', config.isEmailConfigured() ? '✅ Yes' : '❌ No');
  console.log('🔒 CORS origin:', config.frontendUrl);
  console.log('📍 API Prefix:', prefix || 'none');
  console.log('🚀 Passenger will handle server & HTTPS');
  console.log('🚀 ====================================');
  console.log('');
  
} else {
  // Development: Start server manually
  const http = require('http');
  const server = http.createServer({
    maxHeaderSize: 1024 * 1024 * 10,
    insecureHTTPParser: true
  }, app);

  server.timeout = 600000;
  server.maxHeadersCount = 10000;
  server.headersTimeout = 600000;
  server.requestTimeout = 600000;
  server.keepAliveTimeout = 600000;

  server.listen(config.port, () => {
    const baseUrl = `http://localhost:${config.port}`;
    const prefix = config.useApiPrefix ? config.apiPrefix : '';
    
    console.log('');
    console.log('🚀 ====================================');
    console.log('🌱 Green Space Backend Server (DEV)');
    console.log('🚀 ====================================');
    console.log('📡 Environment:', config.nodeEnv);
    console.log('🌐 Backend URL:', config.backendUrl);
    console.log('🔗 Frontend URL:', config.frontendUrl);
    console.log('🎯 Server running on port:', config.port);
    console.log('📁 Upload folder:', uploadFolder);
    console.log('🎬 Video folder:', videoUploadFolder);
    console.log('📦 Max file size:', (config.maxVideoSize / 1024 / 1024).toFixed(0) + 'MB');
    console.log('⏱️  Server timeout:', (server.timeout / 1000).toFixed(0) + 's');
    console.log('📧 Email configured:', config.isEmailConfigured() ? '✅ Yes' : '❌ No');
    console.log('🔒 CORS origin: *');
    console.log('📍 API Prefix:', prefix || 'none');
    console.log('');
    console.log('📤 Endpoints:');
    console.log('   GET    ' + baseUrl + prefix + '/health');
    console.log('   POST   ' + baseUrl + prefix + '/upload');
    console.log('   GET    ' + baseUrl + prefix + '/list');
    console.log('   POST   ' + baseUrl + prefix + '/contact');
    console.log('   POST   ' + baseUrl + prefix + '/volunteer');
    console.log('   POST   ' + baseUrl + prefix + '/member');
    console.log('   POST   ' + baseUrl + prefix + '/partnership');
    console.log('   POST   ' + baseUrl + prefix + '/donation');
    console.log('   GET    ' + baseUrl + prefix + '/admin/data');
    console.log('   GET    ' + baseUrl + prefix + '/admin/statistics');
    console.log('   POST   ' + baseUrl + prefix + '/analytics/page-view');
    console.log('   GET    ' + baseUrl + prefix + '/analytics/page-views');
    console.log('   GET    ' + baseUrl + prefix + '/files');
    console.log('🚀 ====================================');
    console.log('');
  });

  // Graceful shutdown — close the HTTP server before exiting so
  // in-flight requests can finish and resources are released cleanly.
  const shutdown = (signal) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('✅ Server closed. Goodbye!');
      process.exit(0);
    });
    // Force exit after 10 seconds if connections won't close
    setTimeout(() => {
      console.error('⚠️  Forcing exit after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

// Export app for Passenger
module.exports = app;
