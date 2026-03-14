import { postJson } from '@/lib/api-client';

export interface MemberFormData {
  membershipType: 'individual' | 'family' | 'student';
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  cnp: string;
  occupation: string;
  motivation: string;
  agreeTerms: boolean;
}

export interface MemberResponse {
  success: boolean;
  message: string;
}

export const submitMemberApplication = async (
  data: MemberFormData
): Promise<MemberResponse> => {
  return postJson<MemberResponse>(
    '/member',
    data,
    'Eroare la trimiterea cererii',
  );
};
