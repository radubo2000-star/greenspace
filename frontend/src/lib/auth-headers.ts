import { auth } from '@/lib/firebase/config';

/**
 * Returns an object with the Authorization header containing the current
 * user's Firebase ID token. Use this for requests to protected backend
 * routes (/admin/*, /files/*).
 *
 * Returns an empty object when no user is signed in so callers can safely
 * spread it into a headers object without conditional checks.
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const user = auth.currentUser;
  if (!user) return {};

  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}
