// ============================================
// INPUT SANITIZATION
// ============================================
// Sanitizes user input to prevent XSS attacks

const xss = require('xss');

/**
 * Sanitize a single string value
 * @param {string} value - The string to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeString(value) {
  if (typeof value !== 'string') return value;
  return xss(value);
}

/**
 * Sanitize all string fields in an object (shallow)
 * @param {Object} obj - Object with string values to sanitize
 * @returns {Object} New object with sanitized string values
 */
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeString(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

/**
 * Express middleware that sanitizes req.body
 */
function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
}

// ============================================
// INPUT LENGTH LIMITS
// ============================================
// Maximum allowed lengths for common form fields.
// Prevents excessively large payloads from being stored or emailed.

const FIELD_LIMITS = {
  name: 200,
  email: 254,        // RFC 5321
  phone: 30,
  subject: 300,
  message: 5000,
  motivation: 5000,
  experience: 5000,
  description: 5000,
  goals: 5000,
  address: 500,
  city: 200,
  cnp: 20,
  occupation: 200,
  companyName: 300,
  contactPerson: 200,
  position: 200,
  website: 500,
  industry: 200,
  employees: 50,
  budget: 200,
  amount: 50,
  age: 10,
  availability: 200,
};

/**
 * Validate that no string field in the object exceeds its allowed length.
 * Returns null if all fields are within limits, or an error message string
 * describing the first field that exceeds its limit.
 * @param {Object} body - The request body to validate
 * @returns {string|null} Error message or null if valid
 */
function validateFieldLengths(body) {
  if (!body || typeof body !== 'object') return null;

  for (const [key, value] of Object.entries(body)) {
    if (typeof value !== 'string') continue;
    const limit = FIELD_LIMITS[key];
    if (limit && value.length > limit) {
      return `Câmpul "${key}" depășește limita maximă de ${limit} caractere.`;
    }
  }
  return null;
}

module.exports = { sanitizeString, sanitizeObject, sanitizeBody, validateFieldLengths };
