import { postJson } from '@/lib/api-client';

export interface PartnershipFormData {
  partnershipType: 'corporate' | 'ngo' | 'institution' | 'media';
  companyName: string;
  contactPerson: string;
  position: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  employees: string;
  interests: string[];
  budget: string;
  description: string;
  goals: string;
}

export interface PartnershipResponse {
  success: boolean;
  message: string;
}

export const submitPartnershipProposal = async (
  data: PartnershipFormData
): Promise<PartnershipResponse> => {
  return postJson<PartnershipResponse>(
    '/partnership',
    data,
    'Eroare la trimiterea propunerii',
  );
};
