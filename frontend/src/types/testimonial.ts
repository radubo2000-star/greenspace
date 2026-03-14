/**
 * Tipuri pentru testimoniale (afișate pe prima pagină)
 */

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  quote: string;
  rating: number;
  order: number; // Pentru sortare
  isActive: boolean; // Pentru a ascunde/afișa testimoniale
  createdAt: string;
  updatedAt?: string;
}

export type TestimonialFormData = Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>;
