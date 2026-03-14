/**
 * Serviciu pentru gestionarea testimonialelor (afișate pe prima pagină)
 * Folosește Firebase Realtime Database
 */

import { database } from '@/lib/firebase/config';
import { ref, get, set, push, remove, update } from 'firebase/database';
import type { Testimonial, TestimonialFormData } from '@/types/testimonial';

const TESTIMONIALS_PATH = 'testimonials';

/**
 * Obține toate testimonialele
 */
export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const testimonialsRef = ref(database, TESTIMONIALS_PATH);
    const snapshot = await get(testimonialsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val();
    const testimonials = Object.entries(data).map(([id, testimonial]) => ({
      id,
      ...(testimonial as Omit<Testimonial, 'id'>),
    }));

    // Sortează după order, apoi după createdAt
    return testimonials.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } catch (error) {
    console.error('❌ Error fetching testimonials:', error);
    throw error;
  }
};

/**
 * Obține doar testimonialele active
 */
export const getActiveTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const allTestimonials = await getTestimonials();
    return allTestimonials.filter(t => t.isActive);
  } catch (error) {
    console.error('❌ Error fetching active testimonials:', error);
    throw error;
  }
};

/**
 * Obține un testimonial după ID
 */
export const getTestimonialById = async (id: string): Promise<Testimonial | null> => {
  try {
    const testimonialRef = ref(database, `${TESTIMONIALS_PATH}/${id}`);
    const snapshot = await get(testimonialRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id,
      ...snapshot.val(),
    } as Testimonial;
  } catch (error) {
    console.error('❌ Error fetching testimonial:', error);
    throw error;
  }
};

/**
 * Adaugă un testimonial nou
 */
export const addTestimonial = async (data: TestimonialFormData): Promise<string> => {
  try {
    const testimonialsRef = ref(database, TESTIMONIALS_PATH);
    const newTestimonialRef = push(testimonialsRef);

    const testimonial: Omit<Testimonial, 'id'> = {
      ...data,
      createdAt: new Date().toISOString(),
    };

    await set(newTestimonialRef, testimonial);

    console.log('✅ Testimonial added successfully:', newTestimonialRef.key);
    return newTestimonialRef.key!;
  } catch (error) {
    console.error('❌ Error adding testimonial:', error);
    throw error;
  }
};

/**
 * Actualizează un testimonial existent
 */
export const updateTestimonial = async (
  id: string,
  data: Partial<TestimonialFormData>
): Promise<void> => {
  try {
    const testimonialRef = ref(database, `${TESTIMONIALS_PATH}/${id}`);
    
    // Citește datele existente
    const snapshot = await get(testimonialRef);
    if (!snapshot.exists()) {
      throw new Error('Testimonial not found');
    }

    const existingData = snapshot.val();

    // Combină datele existente cu cele noi
    const updatedData = {
      ...existingData,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Elimină valorile undefined
    Object.keys(updatedData).forEach(key => {
      if (updatedData[key] === undefined) {
        delete updatedData[key];
      }
    });

    await set(testimonialRef, updatedData);

    console.log('✅ Testimonial updated successfully:', id);
  } catch (error) {
    console.error('❌ Error updating testimonial:', error);
    throw error;
  }
};

/**
 * Șterge un testimonial
 */
export const deleteTestimonial = async (id: string): Promise<void> => {
  try {
    const testimonialRef = ref(database, `${TESTIMONIALS_PATH}/${id}`);
    await remove(testimonialRef);

    console.log('✅ Testimonial deleted successfully:', id);
  } catch (error) {
    console.error('❌ Error deleting testimonial:', error);
    throw error;
  }
};

/**
 * Toggle status activ/inactiv
 */
export const toggleTestimonialStatus = async (id: string): Promise<void> => {
  try {
    const testimonial = await getTestimonialById(id);
    if (!testimonial) {
      throw new Error('Testimonial not found');
    }

    await updateTestimonial(id, {
      isActive: !testimonial.isActive,
    });

    console.log('✅ Testimonial status toggled:', id);
  } catch (error) {
    console.error('❌ Error toggling testimonial status:', error);
    throw error;
  }
};

/**
 * Reordonează testimonialele
 */
export const reorderTestimonials = async (testimonialIds: string[]): Promise<void> => {
  try {
    const updates: Record<string, any> = {};

    testimonialIds.forEach((id, index) => {
      updates[`${TESTIMONIALS_PATH}/${id}/order`] = index;
    });

    const dbRef = ref(database);
    await update(dbRef, updates);

    console.log('✅ Testimonials reordered successfully');
  } catch (error) {
    console.error('❌ Error reordering testimonials:', error);
    throw error;
  }
};
