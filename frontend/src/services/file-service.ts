import { getBackendUrl } from '@/lib/backend-config';
import { getAuthHeaders } from '@/lib/auth-headers';

export const getFiles = async (path: string = '', signal?: AbortSignal) => {
  const backendUrl = getBackendUrl();
  const headers = await getAuthHeaders();
  const response = await fetch(`${backendUrl}/files?path=${encodeURIComponent(path)}`, { headers, signal });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Eroare la încărcarea fișierelor');
  }
  
  return response.json();
};

export const downloadFile = async (path: string) => {
  const backendUrl = getBackendUrl();
  const headers = await getAuthHeaders();
  const response = await fetch(`${backendUrl}/files/download?path=${encodeURIComponent(path)}`, { headers });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Eroare la descărcarea fișierului');
  }
  
  // Get filename from Content-Disposition header or path
  const contentDisposition = response.headers.get('Content-Disposition');
  let filename = path.split('/').pop() || 'download';
  
  if (contentDisposition) {
    const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
    if (matches && matches[1]) {
      filename = matches[1].replace(/['"]/g, '');
    }
  }
  
  // Download file
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const deleteFile = async (path: string) => {
  const backendUrl = getBackendUrl();
  const headers = await getAuthHeaders();
  const response = await fetch(`${backendUrl}/files?path=${encodeURIComponent(path)}`, {
    method: 'DELETE',
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Eroare la ștergerea fișierului');
  }
  
  return response.json();
};
