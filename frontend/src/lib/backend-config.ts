/**
 * Backend Configuration Helper
 * 
 * Provides centralized backend URL management for different environments:
 * - Production: Uses VITE_BACKEND_URL when VITE_NODE_ENV=production
 * - E2B Development: Auto-detects .e2b.app domains and constructs backend URL
 * - Production Domain: Auto-detects asociatiagreenspace.ro and uses API subdomain
 * - Local Development: Uses localhost with VITE_PORT (default: 5000)
 * 
 * Usage:
 * ```typescript
 * import { getBackendUrl } from '@/lib/backend-config';
 * 
 * const response = await fetch(`${getBackendUrl()}/upload`, {
 *   method: 'POST',
 *   body: formData
 * });
 * ```
 */

/**
 * Get the backend URL with automatic environment detection
 * Priority:
 * 1. Production mode with VITE_BACKEND_URL
 * 2. E2B environment detection
 * 3. Production domain detection
 * 4. Local development fallback
 */
export const getBackendUrl = (): string => {
  // Priority 1: Production mode with explicit backend URL
  if (import.meta.env.VITE_NODE_ENV === 'production' && import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }

  // Priority 2: E2B environment detection
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    // Check if we're in E2B environment
    if (hostname.includes('.e2b.app')) {
      const match = hostname.match(/(\d+)-(.+)\.e2b\.app/);
      if (match) {
        const [, , instanceId] = match;
        const port = import.meta.env.VITE_PORT || '5000';
        return `https://${port}-${instanceId}.e2b.app`;
      }
    }

    // Priority 3: Production domain detection
    if (hostname === 'asociatiagreenspace.ro' || hostname === 'www.asociatiagreenspace.ro') {
      return 'https://api.asociatiagreenspace.ro';
    }
  }

  // Priority 4: Use current origin when served over HTTPS (avoids mixed content)
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    return window.location.origin;
  }

  // Priority 5: Local development fallback
  const port = import.meta.env.VITE_PORT || '5000';
  return `http://localhost:${port}`;
};



/**
 * Check if backend is configured
 * @returns true if backend URL can be determined, false otherwise
 */
export const isBackendConfigured = (): boolean => {
  // Backend is always configured now with auto-detection
  return true;
};

/**
 * Get backend configuration info (for debugging)
 * @returns Object with backend configuration details
 */
export const getBackendInfo = () => {
  const backendUrl = getBackendUrl();
  const isE2B = typeof window !== 'undefined' && window.location.hostname.includes('.e2b.app');
  const isProduction = import.meta.env.VITE_NODE_ENV === 'production';
  
  return {
    url: backendUrl,
    configured: isBackendConfigured(),
    environment: import.meta.env.MODE,
    nodeEnv: import.meta.env.VITE_NODE_ENV,
    isE2B,
    isProduction,
    port: import.meta.env.VITE_PORT || '5000',
    endpoints: {
      upload: `${backendUrl}/upload`,
      list: `${backendUrl}/images/list`,
      images: `${backendUrl}/data/uploads/images/`,
    }
  };
};
