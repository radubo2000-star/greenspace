import { getBackendUrl } from '@/lib/backend-config';
import { getAuthHeaders } from '@/lib/auth-headers';
import type { TeamMember, TeamMemberFormData } from '@/types/team-member';

/**
 * JSON request helper for authenticated backend calls.
 * Admin team routes are already protected by Bearer-token auth (no CSRF needed).
 */
async function authenticatedRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const authHeaders = await getAuthHeaders();
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'A apărut o eroare.');
  }

  return data as T;
}

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const backendUrl = getBackendUrl();
    const data = await authenticatedRequest<{ success: boolean; team: TeamMember[] }>(
      `${backendUrl}/admin/team`,
      { method: 'GET' },
    );
    return data.team || [];
  } catch (error) {
    console.error('❌ Error fetching team members:', error);
    throw error;
  }
};

export const getActiveTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const backendUrl = getBackendUrl();
    const response = await fetch(`${backendUrl}/team`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'A apărut o eroare.');
    }

    return data.team || [];
  } catch (error) {
    console.error('❌ Error fetching active team members:', error);
    throw error;
  }
};

export const getTeamMemberById = async (id: string): Promise<TeamMember | null> => {
  try {
    const backendUrl = getBackendUrl();
    const data = await authenticatedRequest<{ success: boolean; team: TeamMember }>(
      `${backendUrl}/admin/team/${id}`,
      { method: 'GET' },
    );
    return data.team || null;
  } catch (error) {
    if (error instanceof Error && error.message.includes('găsit')) {
      return null;
    }
    console.error('❌ Error fetching team member:', error);
    throw error;
  }
};

export const addTeamMember = async (data: TeamMemberFormData): Promise<string> => {
  try {
    const backendUrl = getBackendUrl();
    const result = await authenticatedRequest<{ success: boolean; id: string }>(
      `${backendUrl}/admin/team`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    );

    console.log('✅ Team member added successfully:', result.id);
    return result.id;
  } catch (error) {
    console.error('❌ Error adding team member:', error);
    throw error;
  }
};

export const updateTeamMember = async (
  id: string,
  data: Partial<TeamMemberFormData>,
): Promise<void> => {
  try {
    const backendUrl = getBackendUrl();
    await authenticatedRequest(
      `${backendUrl}/admin/team/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    );

    console.log('✅ Team member updated successfully:', id);
  } catch (error) {
    console.error('❌ Error updating team member:', error);
    throw error;
  }
};

export const deleteTeamMember = async (id: string): Promise<void> => {
  try {
    const backendUrl = getBackendUrl();
    await authenticatedRequest(
      `${backendUrl}/admin/team/${id}`,
      { method: 'DELETE' },
    );

    console.log('✅ Team member deleted successfully:', id);
  } catch (error) {
    console.error('❌ Error deleting team member:', error);
    throw error;
  }
};

export const toggleTeamMemberStatus = async (id: string): Promise<void> => {
  try {
    const member = await getTeamMemberById(id);
    if (!member) {
      throw new Error('Team member not found');
    }

    await updateTeamMember(id, {
      isActive: !member.isActive,
    });

    console.log('✅ Team member status toggled:', id);
  } catch (error) {
    console.error('❌ Error toggling team member status:', error);
    throw error;
  }
};

export const reorderTeamMembers = async (memberIds: string[]): Promise<void> => {
  try {
    await Promise.all(memberIds.map(async (id, index) => {
      await updateTeamMember(id, { order: index });
    }));
    console.log('✅ Team members reordered successfully');
  } catch (error) {
    console.error('❌ Error reordering team members:', error);
    throw error;
  }
};