/**
 * Session-cookie based auth: protected backend routes (/admin/*, /files/*)
 * read the MySQL session cookie automatically; no Authorization header
 * is needed anymore. Kept for call-site compatibility (always empty).
 *
 * Relies on fetch(options) including `credentials: 'include'` so the
 * cookie is sent with each request.
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  return {};
}
