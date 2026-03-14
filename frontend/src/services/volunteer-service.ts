import { postJson } from '@/lib/api-client';

export interface VolunteerFormData {
  name: string;
  email: string;
  phone: string;
  age: string;
  city: string;
  interests: string[];
  availability: string;
  experience: string;
  motivation: string;
}

export interface VolunteerResponse {
  success: boolean;
  message: string;
}

export const submitVolunteerApplication = async (
  data: VolunteerFormData
): Promise<VolunteerResponse> => {
  return postJson<VolunteerResponse>(
    '/volunteer',
    data,
    'Eroare la trimiterea aplicatiei',
  );
};
