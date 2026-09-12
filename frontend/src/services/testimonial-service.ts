/**
 * Serviciu pentru gestionarea testimonialelor (afișate pe prima pagină)
 * Datele sunt stocate în MySQL prin backend (routes/testimonials.js).
 */

import { getBackendUrl } from '@/lib/backend-config';
import type { Testimonial, TestimonialFormData } from '@/types/testimonial';

const BASE = '/testimonials';

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${getBackendUrl()}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data as { error?: string }).error || 'Eroare la comunicarea cu serverul.');
  }
  return data as T;
}

function parseTestimonial(raw: Partial<Testimonial>): Testimonial {
  return {
    id: String(raw.id),
    name: raw.name || '',
    role: raw.role || '',
    image: raw.image || '',
    quote: raw.quote || '',
    rating: raw.rating ?? 5,
    order: raw.order ?? 0,
    isActive: raw.isActive ?? true,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string | undefined,
  };
}

/**
 * Obține toate testimonialele (admin; include inactive).
 */
export const getTestimonials = async (): Promise<Testimonial[]> => {
  const data = await api<{ success: boolean; testimonials: Partial<Testimonial>[] }>(
    `${BASE}/all`,
  );
  return (data.testimonials || []).map(parseTestimonial);
};

/**
 * Obține doar testimonialele active (public).
 */
export const getActiveTestimonials = async (): Promise<Testimonial[]> => {
  const data = await api<{ success: boolean; testimonials: Partial<Testimonial>[] }>(BASE);
  return (data.testimonials || []).map(parseTestimonial);
};

/**
 * Obține un testimonial după ID.
 */
export const getTestimonialById = async (id: string): Promise<Testimonial | null> => {
  const all = await getTestimonials();
  return all.find(t => t.id === id) || null;
};

/**
 * Adaugă un testimonial nou.
 */
export const addTestimonial = async (data: TestimonialFormData): Promise<string> => {
  const result = await api<{ id: string }>(BASE, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result.id;
};

/**
 * Actualizează un testimonial existent.
 */
export const updateTestimonial = async (
  id: string,
  data: Partial<TestimonialFormData>,
): Promise<void> => {
  await api(`${BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * Șterge un testimonial.
 */
export const deleteTestimonial = async (id: string): Promise<void> => {
  await api(`${BASE}/${id}`, { method: 'DELETE' });
};

/**
 * Toggle status activ/inactiv.
 */
export const toggleTestimonialStatus = async (id: string): Promise<void> => {
  const testimonial: Testimonial | null = await getTestimonialById(id);
  if (!testimonial) {
    throw new Error('Testimonial not found');
  }
  await updateTestimonial(id, { isActive: !testimonial.isActive });
};

/**
 * Reordonează testimonialele.
 */
export const reorderTestimonials = async (testimonialIds: string[]): Promise<void> => {
  const all = await getTestimonials();
  for (let i = 0; i < testimonialIds.length; i++) {
    const id = testimonialIds[i];
    const existing = all.find(t => t.id === id);
    if (existing) {
      await updateTestimonial(id, { ...existing, order: i });
    }
  }
};