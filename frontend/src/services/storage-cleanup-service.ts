import { ref as storageRef, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase/config';
import { getBackendUrl } from '@/lib/backend-config';
import { getAuthHeaders } from '@/lib/auth-headers';

/**
 * Detectează tipul de URL și șterge fișierul corespunzător
 */
export const deleteFileFromUrl = async (url: string): Promise<void> => {
  if (!url) return;

  try {
    // 1. Verifică dacă este Firebase Storage URL
    if (url.includes('firebasestorage.googleapis.com') || url.includes('firebase')) {
      await deleteFromFirebaseStorage(url);
      return;
    }

    // 2. Verifică dacă este backend local URL
    const backendUrl = getBackendUrl();
    if (url.includes(backendUrl)) {
      await deleteFromBackendStorage(url);
      return;
    }

    // 3. URL extern (Unsplash, etc.) - nu trebuie șters
    console.log('External URL, no deletion needed:', url);
  } catch (error) {
    console.error('Error deleting file from URL:', url, error);
    // Nu aruncăm eroare pentru a nu bloca ștergerea înregistrării din database
  }
};

/**
 * Șterge fișier din Firebase Storage
 */
const deleteFromFirebaseStorage = async (url: string): Promise<void> => {
  try {
    // Extrage path-ul din URL-ul Firebase Storage
    // Format: https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Fto%2Ffile?alt=media&token=...
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/o\/(.+)/);
    
    if (pathMatch && pathMatch[1]) {
      const encodedPath = pathMatch[1].split('?')[0];
      const path = decodeURIComponent(encodedPath);
      
      const fileRef = storageRef(storage, path);
      await deleteObject(fileRef);
      console.log('✅ Deleted from Firebase Storage:', path);
    }
  } catch (error) {
    // Ignoră eroarea dacă fișierul nu există
    const fbError = error as { code?: string };
    if (fbError.code === 'storage/object-not-found') {
      console.log('File not found in Firebase Storage (already deleted):', url);
    } else {
      console.error('Error deleting from Firebase Storage:', error);
    }
  }
};

/**
 * Șterge fișier din backend local storage
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
    } else if (url.includes('/uploads/')) {
      path = url.split('/uploads/')[1].split('?')[0];
      path = `uploads/${path}`;
    }
    
    if (!path) {
      console.warn('Could not extract path from backend URL:', url);
      return;
    }

    // Apelează API-ul backend pentru ștergere
    const headers = await getAuthHeaders();
    const response = await fetch(`${backendUrl}/files?path=${encodeURIComponent(path)}`, {
      method: 'DELETE',
      headers,
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
 * Șterge multiple fișiere din URL-uri
 */
export const deleteMultipleFilesFromUrls = async (urls: string[]): Promise<void> => {
  const deletePromises = urls.filter(url => url).map(url => deleteFileFromUrl(url));
  await Promise.allSettled(deletePromises);
};
