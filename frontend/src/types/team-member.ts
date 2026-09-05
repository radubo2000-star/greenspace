export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  image: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type TeamMemberFormData = Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>;