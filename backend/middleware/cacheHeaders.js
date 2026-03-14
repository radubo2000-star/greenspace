// ============================================
// CACHE HEADERS MIDDLEWARE
// ============================================
// Adds ETag support and Cache-Control headers to GET responses.

const crypto = require('crypto');

/**
 * Middleware that adds Cache-Control and ETag headers to responses.
 * @param {number} maxAge - Cache duration in seconds (default: 300 = 5 min)
 * @returns {import('express').RequestHandler}
 */
function cacheHeaders(maxAge = 300) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Store the original json method
    const originalJson = res.json.bind(res);

    res.json = (body) => {
      // Generate ETag from response body
      const content = JSON.stringify(body);
      const etag = '"' + crypto.createHash('md5').update(content).digest('hex') + '"';

      res.setHeader('ETag', etag);
      res.setHeader('Cache-Control', `public, max-age=${maxAge}`);

      // Check If-None-Match header
      const ifNoneMatch = req.headers['if-none-match'];
      if (ifNoneMatch === etag) {
        return res.status(304).end();
      }

      return originalJson(body);
    };

    next();
  };
}

/**
 * No-cache middleware — explicitly disables caching for sensitive endpoints.
 * @returns {import('express').RequestHandler}
 */
function noCache(req, res, next) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  next();
}

module.exports = { cacheHeaders, noCache };
