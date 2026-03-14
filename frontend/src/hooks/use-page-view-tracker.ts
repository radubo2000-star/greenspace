import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getBackendUrl } from '@/lib/backend-config';

// Module-level state survives React StrictMode unmount/remount cycles,
// guaranteeing we never fire duplicate tracking requests for the same path.
let _lastPath: string | null = null;
let _lastTime = 0;
const DEBOUNCE_MS = 2000;

export const usePageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const now = Date.now();

    // Skip if the same path was already tracked within the debounce window.
    // This prevents duplicates from StrictMode double-mount AND rapid navigations.
    if (_lastPath === location.pathname && now - _lastTime < DEBOUNCE_MS) {
      return;
    }
    _lastPath = location.pathname;
    _lastTime = now;

    const controller = new AbortController();

    const trackPageView = async () => {
      try {
        const backendUrl = getBackendUrl();
        
        // Get page title from document or use pathname
        const pageTitle = document.title || location.pathname;
        
        await fetch(`${backendUrl}/analytics/page-view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: location.pathname,
            title: pageTitle,
            timestamp: new Date().toISOString(),
            referrer: document.referrer || null,
            userAgent: navigator.userAgent,
          }),
          signal: controller.signal,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return; // Request was cancelled by cleanup — not an error
        }
        // Silent fail - don't disrupt user experience
        console.debug('Page view tracking failed:', error);
      }
    };

    trackPageView();

    return () => {
      controller.abort();
    };
  }, [location.pathname]);
};
