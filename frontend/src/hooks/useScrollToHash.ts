import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // Wait for DOM to be fully rendered
      const timeoutId = setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          // Force a reflow to ensure rendering is complete
          element.getBoundingClientRect();
          
          // Scroll to element
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 300); // Increased timeout for better reliability

      return () => clearTimeout(timeoutId);
    } else {
      // Scroll to top if no hash
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.hash]);
};
