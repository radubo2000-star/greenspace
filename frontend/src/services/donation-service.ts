import { postJson } from '@/lib/api-client';

export interface DonationData {
  amount: string;
  isRecurring: boolean;
  paymentMethod: 'card' | 'bank';
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

export interface DonationResponse {
  success: boolean;
  message: string;
}

export const submitDonation = async (
  data: DonationData
): Promise<DonationResponse> => {
  return postJson<DonationResponse>(
    '/donation',
    data,
    'Eroare la trimiterea donatiei',
  );
};
