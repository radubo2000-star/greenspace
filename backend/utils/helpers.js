// ============================================
// HELPER FUNCTIONS
// ============================================
// Reusable utility functions

const fs = require('fs');
const path = require('path');
const config = require('../config');
const transporter = require('../config/nodemailer');

/**
 * @typedef {Object} SaveResult
 * @property {string} filename
 * @property {string} filepath
 */

/**
 * @typedef {Object} EmailResult
 * @property {boolean} saved
 * @property {boolean} sent
 */

// ============================================
// MYSQL FORM COLLECTIONS
// ============================================
// The "forms/*" collections are stored in MySQL tables:
// dedicated tables (see sql/schema.sql). Mapping a collection name to a
// table + row<->record converters keeps the call sites unchanged.

const db = require('../config/database');

const COLLECTION_TABLES = {
  'forms/contacts': 'contacts',
  'forms/volunteers': 'volunteers',
  'forms/members': 'members',
  'forms/partnerships': 'partnerships',
  'forms/donations': 'donations',
};

/**
 * Convert a DATETIME column string ('YYYY-MM-DD HH:MM:SS') to a sortable
 * ISO string. Safe across JS engines (no Safari parsing trap).
 * @param {string|null|Date} value
 * @returns {string}
 */
function toIsoString(value) {
  if (!value) return new Date().toISOString();
  if (value instanceof Date) return value.toISOString();
  const str = String(value);
  return new Date(str.replace(' ', 'T') + 'Z').toISOString();
}

/** Parse JSON column value (mysql2 auto-parses JSON, but could be a string). */
function parseJson(value) {
  if (value === null || value === undefined) return [];
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }
  return value;
}

function rowToRecord(collection, row) {
  const base = {
    id: String(row.id),
    timestamp: toIsoString(row.created_at),
  };
  switch (collection) {
    case 'forms/contacts':
      return { ...base, name: row.name, email: row.email, subject: row.subject, message: row.message };
    case 'forms/volunteers':
      return {
        ...base,
        name: row.name,
        email: row.email,
        phone: row.phone,
        age: row.age,
        city: row.city,
        interests: parseJson(row.interests),
        availability: row.availability,
        experience: row.experience,
        motivation: row.motivation,
      };
    case 'forms/members':
      return {
        ...base,
        membershipType: row.membership_type,
        name: row.name,
        email: row.email,
        phone: row.phone,
        address: row.address,
        city: row.city,
        cnp: row.cnp,
        occupation: row.occupation,
        motivation: row.motivation,
      };
    case 'forms/partnerships':
      return {
        ...base,
        partnershipType: row.partnership_type,
        companyName: row.company_name,
        contactPerson: row.contact_person,
        position: row.position,
        email: row.email,
        phone: row.phone,
        website: row.website,
        industry: row.industry,
        employees: row.employees,
        interests: parseJson(row.interests),
        budget: row.budget,
        description: row.description,
        goals: row.goals,
      };
    case 'forms/donations':
      return {
        ...base,
        amount: row.amount,
        isRecurring: !!row.is_recurring,
        paymentMethod: row.payment_method,
        name: row.name,
        email: row.email,
        phone: row.phone,
        message: row.message,
        status: row.status,
      };
    default:
      return { ...base, ...row };
  }
}

/**
 * Read all records from a MySQL collection, newest first.
 * @param {string} collection - Collection path (e.g. 'forms/contacts')
 * @returns {Promise<Array<Object>>}
 */
async function readData(collection, _fallbackFolder) {
  const table = COLLECTION_TABLES[collection];
  if (!table) {
    throw new Error(`Unknown form collection: ${collection}`);
  }
  const rows = await db.query(`SELECT * FROM ${table} ORDER BY id DESC`);
  return rows.map(row => rowToRecord(collection, row));
}

/**
 * Map a form payload (camelCase keys) to MySQL column names, converting
 * array values to JSON where the table uses a JSON column.
 * @param {string} collection
 * @param {Object} data
 * @returns {Object}
 */
function toColumnValues(collection, data) {
  const values = { ...data };
  delete values.timestamp;
  delete values.id;

  // Generic camelCase -> snake_case for the remaining scalar fields.
  const snake = {};
  for (const [key, value] of Object.entries(values)) {
    const column = key
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase();
    snake[column] = value;
  }

  // JSON columns (interests arrays) must be serialized.
  if (collection === 'forms/volunteers' && Array.isArray(snake.interests)) {
    snake.interests = JSON.stringify(snake.interests);
  }
  if (collection === 'forms/partnerships' && Array.isArray(snake.interests)) {
    snake.interests = JSON.stringify(snake.interests);
  }

  return snake;
}

/**
 * Save a record to the MySQL collection. Accepts camelCase keys plus an
 * optional ISO `timestamp` (ignored — created_at is set by the database).
 * @param {string} collection - Collection path (e.g. 'forms/contacts')
 * @param {string} _fallbackFolder - Kept for signature compatibility
 * @param {string} _fallbackPrefix - Kept for signature compatibility
 * @param {Object} data - Data to save
 * @returns {Promise<SaveResult>}
 */
async function saveData(collection, _fallbackFolder, _fallbackPrefix, data) {
  const table = COLLECTION_TABLES[collection];
  if (!table) {
    throw new Error(`Unknown form collection: ${collection}`);
  }

  const values = toColumnValues(collection, data);
  const columns = Object.keys(values);
  const params = Object.values(values);

  const [result] = await db.getPool().execute(
    `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
    params
  );

  return { id: String(result.insertId), filename: '', filepath: '' };
}

/**
 * Read all JSON files from a folder (legacy reader, kept for compatibility).
 * @param {string} folderPath - Path to the folder
 * @returns {Array<Object>} Array of parsed JSON objects, sorted by timestamp (newest first)
 */
function readJsonFiles(folderPath) {
  if (!fs.existsSync(folderPath)) {
    return [];
  }

  const files = fs.readdirSync(folderPath);
  const jsonFiles = files.filter(file => file.endsWith('.json'));

  return jsonFiles.map(file => {
    const filePath = path.join(folderPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/**
 * Save data to JSON file (legacy filesystem helper).
 * @param {string} folder - Folder path
 * @param {string} prefix - Filename prefix
 * @param {Object} data - Data to save
 * @returns {SaveResult} Object with filename and filepath
 */
function saveToJsonFile(folder, prefix, data) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  const timestamp = Date.now();
  const filename = `${prefix}_${timestamp}.json`;
  const filepath = path.join(folder, filename);

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));

  return { filename, filepath };
}

/**
 * Send email (with fallback to file storage if SMTP not configured)
 * @param {Object} mailOptions - Nodemailer mail options
 * @param {string} fallbackFolder - Folder to save to if email fails
 * @param {string} fallbackPrefix - Filename prefix for fallback
 * @param {Object} fallbackData - Data to save if email fails
 * @returns {Promise<EmailResult>} Object with saved and sent flags
 */
async function sendEmailOrSave(mailOptions, fallbackFolder, fallbackPrefix, fallbackData) {
  if (!config.isEmailConfigured()) {
    console.log(`📧 Email not configured, saving to file: ${fallbackPrefix}`);
    saveToJsonFile(fallbackFolder, fallbackPrefix, fallbackData);
    return { saved: true, sent: false };
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully: ${mailOptions.subject}`);
    return { saved: false, sent: true };
  } catch (error) {
    console.error('❌ Email error:', error);
    throw error;
  }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = {
  readJsonFiles,
  saveToJsonFile,
  saveData,
  readData,
  sendEmailOrSave,
  isValidEmail
};