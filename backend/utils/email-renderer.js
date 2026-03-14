// ============================================
// EMAIL TEMPLATE RENDERER
// ============================================
// Uses Handlebars for auto-escaped HTML email templates

const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '..', 'templates', 'emails');

// Cache compiled templates
const templateCache = {};

/**
 * Register custom Handlebars helpers
 */
Handlebars.registerHelper('nl2br', function (text) {
  if (!text) return '';
  // Handlebars.Utils.escapeExpression auto-escapes, then we replace newlines
  const escaped = Handlebars.Utils.escapeExpression(text);
  return new Handlebars.SafeString(escaped.replace(/\n/g, '<br>'));
});

Handlebars.registerHelper('ifEquals', function (a, b, options) {
  return a === b ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('ifExists', function (value, options) {
  return value ? options.fn(this) : options.inverse(this);
});

/**
 * Compile and cache a template
 * @param {string} templateName - Name of the template file (without .hbs extension)
 * @returns {HandlebarsTemplateDelegate} Compiled template function
 */
function getTemplate(templateName) {
  if (templateCache[templateName]) {
    return templateCache[templateName];
  }

  const templatePath = path.join(templatesDir, `${templateName}.hbs`);
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const compiled = Handlebars.compile(templateSource);

  templateCache[templateName] = compiled;
  return compiled;
}

/**
 * Render an email template with data
 * @param {string} templateName - Name of the template file (without .hbs extension)
 * @param {Object} data - Data to pass to the template
 * @returns {string} Rendered HTML string
 */
function renderEmail(templateName, data) {
  const template = getTemplate(templateName);
  return template(data);
}

module.exports = { renderEmail };
