// ============================================
// LOGGER UTILITY
// ============================================
// Simple logger that gates verbose output behind NODE_ENV.
// In production only warnings and errors are emitted.
// In development all levels (including info/debug) are printed.

const config = require('../config');

/**
 * @typedef {'debug'|'info'|'warn'|'error'} LogLevel
 */

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };

const threshold = config.isProduction() ? LEVELS.warn : LEVELS.debug;

/**
 * Log a debug message (development only).
 * @param  {...any} args
 */
function debug(...args) {
  if (threshold <= LEVELS.debug) {
    console.log(...args);
  }
}

/**
 * Log an informational message (development only).
 * @param  {...any} args
 */
function info(...args) {
  if (threshold <= LEVELS.info) {
    console.log(...args);
  }
}

/**
 * Log a warning (always).
 * @param  {...any} args
 */
function warn(...args) {
  console.warn(...args);
}

/**
 * Log an error (always).
 * @param  {...any} args
 */
function error(...args) {
  console.error(...args);
}

module.exports = { debug, info, warn, error };
