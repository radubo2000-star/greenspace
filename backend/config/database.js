// ============================================
// MYSQL DATABASE CONFIGURATION
// ============================================
// Central MySQL connection pool for the Green Space backend.
// Uses mysql2 (promise wrapper). All auth/session queries go
// through this pool; future tables (forms, analytics, etc.) will too.

const mysql = require('mysql2/promise');
const config = require('./index');
const logger = require('../utils/logger');

let pool = null;

/**
 * Build (lazily) the connection pool from the env-driven config.
 * @returns {import('mysql2/promise').Pool}
 */
function getPool() {
  if (pool) return pool;

  const { host, port, user, password, database } = config.mysql;

  if (!host || !user || !password || !database) {
    throw new Error(
      'MySQL is not configured. Set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD and MYSQL_DATABASE.'
    );
  }

  pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    connectionLimit: 10,
    connectTimeout: 10000,
    waitForConnections: true,
    dateStrings: true,
  });

  pool.on('error', (err) => {
    logger.error('MySQL pool error:', err.message);
  });

  return pool;
}

/**
 * Run a parameterized query against MySQL.
 * @template T
 * @param {string} sql - SQL statement with `?` placeholders
 * @param {unknown[]} [params] - Query parameters
 * @returns {Promise<T>}
 */
async function query(sql, params = []) {
  const p = getPool();
  const [rows] = await p.query(sql, params);
  return rows;
}

/**
 * Check whether MySQL can be reached (used by health/logs).
 * @returns {Promise<boolean>}
 */
async function ping() {
  try {
    await getPool().query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

module.exports = { getPool, query, ping };