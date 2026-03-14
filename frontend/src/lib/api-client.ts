/**
 * Shared API Client
 *
 * Centralizes fetch logic for all backend service calls so that
 * URL resolution, JSON parsing, and error handling are consistent.
 * Automatically fetches and attaches CSRF tokens for POST requests.
 */

import { getBackendUrl } from '@/lib/backend-config';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

/**
 * Cached CSRF token. Fetched once and reused for subsequent requests.
 * Cleared on 403 so it can be refreshed automatically.
 */
let csrfToken: string | null = null;

/**
 * Fetch a CSRF token from the backend.
 * The token is cached so only one request is made per session.
 */
async function getCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;

  const res = await fetch(`${getBackendUrl()}/csrf-token`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await res.json();
  csrfToken = data.csrfToken;
  return csrfToken as string;
}

/**
 * Send a JSON POST request to the backend.
 * Automatically includes a CSRF token in the request header.
 *
 * @param path  - API path (e.g. "/contact")
 * @param body  - Request payload (will be JSON-stringified)
 * @param fallbackError - Fallback message when the response contains no details
 * @returns Parsed JSON response
 */
export async function postJson<T = ApiResponse>(
  path: string,
  body: unknown,
  fallbackError = 'A aparut o eroare. Incearca din nou.',
): Promise<T> {
  const token = await getCsrfToken();

  const response = await fetch(`${getBackendUrl()}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': token,
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  // If CSRF token was rejected (403 or 500), clear cache and retry once
  if (response.status === 403 || response.status === 500) {
    const errorData = await response.json();
    if (errorData.error === 'invalid csrf token') {
      csrfToken = null;
      const freshToken = await getCsrfToken();
      const retryResponse = await fetch(`${getBackendUrl()}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': freshToken,
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      const retryData = await retryResponse.json();
      if (!retryResponse.ok) {
        throw new Error(retryData.error || retryData.message || fallbackError);
      }
      return retryData as T;
    }
    throw new Error(errorData.error || errorData.message || fallbackError);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || fallbackError);
  }

  return data as T;
}
