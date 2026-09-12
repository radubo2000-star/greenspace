import { getBackendUrl } from '@/lib/backend-config';

/**
 * Detectează tipul de URL și șterge fișierul corespunzător.
 * Fișierele sunt servite de
 * backend-ul local (/data/uploads/...), singurul caz care necesită ștergere.
 */
export const deleteFileFromUrl = async (url: string): Promise<void> => {
  if (!url) return;

  try {
    // URL local servit de backend
    const backendUrl = getBackendUrl();
    if (url.includes('/data/uploads/') || url.includes(backendUrl)) {
      await deleteFromBackendStorage(url);
      return;
    }

    // URL extern (YouTube, Unsplash, etc.) — nu trebuie șters
    console.log('External URL, no deletion needed:', url);
  } catch (error) {
    console.error('Error deleting file from URL:', url, error);
    // Nu aruncăm eroare pentru a nu bloca ștergerea înregistrării din baza de date
  }
};

/**
 * Șterge fișier din backend local storage.
 */
const deleteFromBackendStorage = async (url: string): Promise<void> => {
  try {
    const backendUrl = getBackendUrl();

    // Extrage path-ul relativ din URL
    // Format: http://localhost:5000/data/uploads/images/filename.jpg
    let path = '';

    if (url.includes('/data/uploads/images/')) {
      path = url.split('/data/uploads/images/')[1].split('?')[0];
      path = `uploads/${path}`;
    } else if (url.includes('/data/uploads/videos/')) {
      path = url.split('/data/uploads/videos/')[1].split('?')[0];
      path = `uploads/${path}`;
    } else if (url.includes('/uploads/')) {
      path = url.split('/uploads/')[1].split('?')[0];
      path = `uploads/${path}`;
    }

    if (!path) {
      console.warn('Could not extract path from backend URL:', url);
      return;
    }

    // Apelează API-ul backend pentru ștergere
    const response = await fetch(`${backendUrl}/files?path=${encodeURIComponent(path)}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      console.log('✅ Deleted from backend storage:', path);
    } else {
      const error = await response.json();
      console.warn('Failed to delete from backend storage:', error);
    }
  } catch (error) {
    console.error('Error deleting from backend storage:', error);
  }
};

/**
 * Șterge multiple fișiere din URL-uri.
 */
export const deleteMultipleFilesFromUrls = async (urls: string[]): Promise<void> => {
  const deletePromises = urls.filter(url => url).map(url => deleteFileFromUrl(url));
  await Promise.allSettled(deletePromises);
};