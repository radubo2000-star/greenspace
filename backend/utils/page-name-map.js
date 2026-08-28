// ============================================
// PAGE NAME MAP
// ============================================
// Maps URL paths to user-friendly page names matching
// the navigation menu labels used throughout the site.

const PAGE_NAME_MAP = {
  // Public pages (from site navigation menu - Header.tsx)
  '/': 'Acasă',
  '/despre': 'Despre Noi',
  '/proiecte': 'Proiecte',
  '/experiente': 'Experiențe',
  '/summer-camp': 'Summer Camp 2027',
  '/galerie': 'Galerie',
  '/raport-activitate': 'Raport Activitate',
  '/implica-te': 'Implică-te',
  '/contact': 'Contact',

  // Auth pages
  '/login': 'Login',
  '/signup': 'Înregistrare',

  // Legal pages
  '/termeni-si-conditii': 'Termeni și Condiții',
  '/politica-de-cookie-uri': 'Politica de Cookie-uri',

  // Admin pages (from admin dashboard menu - AdminDashboardPage.tsx)
  '/admin': 'Admin Dashboard',
  '/admin/annual-statistics': 'Statistici Anuale',
  '/admin/testimonials': 'Testimoniale',
  '/admin/statistics': 'Statistici Site',
  '/galerie/admin': 'Administrare Galerie',
  '/admin/media': 'Administrare Media',
  '/admin/files': 'Manager Fișiere',
  '/admin/data': 'Toate Datele',
  '/admin/docs': 'Documentație Internă',
  '/admin/analytics/page-views': 'Analiză Vizualizări',
};

/**
 * Resolve a friendly page name for a given URL path.
 * Falls back to the raw title or path when no mapping exists.
 *
 * @param {string} pagePath  - The URL pathname (e.g. "/despre")
 * @param {string} [rawTitle] - The original document.title captured at track time
 * @returns {string} Human-friendly page name
 */
function resolvePageName(pagePath, rawTitle) {
  if (PAGE_NAME_MAP[pagePath]) {
    return PAGE_NAME_MAP[pagePath];
  }
  // Fallback: use the raw title if available, otherwise the path itself
  return rawTitle || pagePath;
}

module.exports = { PAGE_NAME_MAP, resolvePageName };
