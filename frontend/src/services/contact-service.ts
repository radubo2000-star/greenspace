/**
 * Contact Service
 * Handles contact form submissions to backend
 */

import { postJson } from '@/lib/api-client';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Submit contact form to backend
 */
export const submitContactForm = async (
  formData: ContactFormData
): Promise<ContactResponse> => {
  return postJson<ContactResponse>(
    '/contact',
    formData,
    'A aparut o eroare la trimiterea mesajului',
  );
};
