// ============================================
// CORS CONFIGURATION
// ============================================

const config = require('./index');

/**
 * Check whether the given origin is allowed by CORS policy.
 * In development every origin is accepted; in production only
 * the explicitly listed origins pass.
 *
 * @param {string} origin - The request Origin header value
 * @returns {boolean}
 */
function isAllowedOrigin(origin) {
  if (!config.isProduction()) return true;

  const allowed = [
    config.frontendUrl,
    config.backendUrl,
    ...config.allowedOrigins,
  ];
  return allowed.includes(origin);
}

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-csrf-token'],
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = corsOptions;
module.exports.isAllowedOrigin = isAllowedOrigin;
