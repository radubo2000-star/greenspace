import { database } from '@/lib/firebase/config';
import { ref, get, set, push, remove, update } from 'firebase/database';
import type { TeamMember, TeamMemberFormData } from '@/types/team-member';

const TEAM_PATH = 'team';

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const teamRef = ref(database, TEAM_PATH);
    const snapshot = await get(teamRef);

    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val();
    const members = Object.entries(data).map(([id, member]) => ({
      id,
      ...(member as Omit<TeamMember, 'id'>),
    }));

    return members.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } catch (error) {
    console.error('❌ Error fetching team members:', error);
    throw error;
  }
};

export const getActiveTeamMembers = async (): Promise<TeamMember[]> => {
  const allMembers = await getTeamMembers();
  return allMembers.filter(member => member.isActive);
};

export const getTeamMemberById = async (id: string): Promise<TeamMember | null> => {
  try {
    const memberRef = ref(database, `${TEAM_PATH}/${id}`);
    const snapshot = await get(memberRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id,
      ...snapshot.val(),
    } as TeamMember;
  } catch (error) {
    console.error('❌ Error fetching team member:', error);
    throw error;
  }
};

export const addTeamMember = async (data: TeamMemberFormData): Promise<string> => {
  try {
    const teamRef = ref(database, TEAM_PATH);
    const newMemberRef = push(teamRef);

    const member: Omit<TeamMember, 'id'> = {
      ...data,
      createdAt: new Date().toISOString(),
    };

    await set(newMemberRef, member);

    console.log('✅ Team member added successfully:', newMemberRef.key);
    return newMemberRef.key!;
  } catch (error) {
    console.error('❌ Error adding team member:', error);
    throw error;
  }
};

export const updateTeamMember = async (
  id: string,
  data: Partial<TeamMemberFormData>
): Promise<void> => {
  try {
    const memberRef = ref(database, `${TEAM_PATH}/${id}`);

    const snapshot = await get(memberRef);
    if (!snapshot.exists()) {
      throw new Error('Team member not found');
    }

    const existingData = snapshot.val();

    const updatedData = {
      ...existingData,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    Object.keys(updatedData).forEach(key => {
      if (updatedData[key] === undefined) {
        delete updatedData[key];
      }
    });

    await set(memberRef, updatedData);

    console.log('✅ Team member updated successfully:', id);
  } catch (error) {
    console.error('❌ Error updating team member:', error);
    throw error;
  }
};

export const deleteTeamMember = async (id: string): Promise<void> => {
  try {
    const memberRef = ref(database, `${TEAM_PATH}/${id}`);
    await remove(memberRef);

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
    const updates: Record<string, any> = {};

    memberIds.forEach((id, index) => {
      updates[`${TEAM_PATH}/${id}/order`] = index;
    });

    const dbRef = ref(database);
    await update(dbRef, updates);

    console.log('✅ Team members reordered successfully');
  } catch (error) {
    console.error('❌ Error reordering team members:', error);
    throw error;
  }
};