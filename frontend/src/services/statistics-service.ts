import {
  ref,
  get,
  set,
  push,
  remove,
} from 'firebase/database';
import { database } from '@/lib/firebase/config';
import { AnnualStatistics } from '../types/statistics';

const COLLECTION_PATH = 'statistics';

export const statisticsService = {
  // Get all statistics
  async getAll(): Promise<AnnualStatistics[]> {
    try {
      const statsRef = ref(database, COLLECTION_PATH);
      const snapshot = await get(statsRef);
      
      if (!snapshot.exists()) {
        return [];
      }
      
      const data = snapshot.val();
      const statistics: AnnualStatistics[] = [];
      
      // Convert object to array and sort by year descending
      Object.entries(data).forEach(([id, value]: [string, any]) => {
        statistics.push({
          id,
          ...value,
          createdAt: value.createdAt ? new Date(value.createdAt) : undefined,
          updatedAt: value.updatedAt ? new Date(value.updatedAt) : undefined,
        });
      });
      
      // Sort by year descending
      return statistics.sort((a, b) => b.year - a.year);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },

  // Get statistics by year
  async getByYear(year: number): Promise<AnnualStatistics | null> {
    try {
      const stats = await this.getAll();
      return stats.find(s => s.year === year) || null;
    } catch (error) {
      console.error('Error fetching statistics by year:', error);
      throw error;
    }
  },

  // Add new statistics
  async add(data: Omit<AnnualStatistics, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const statsRef = ref(database, COLLECTION_PATH);
      const newStatRef = push(statsRef);
      
      const docData = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await set(newStatRef, docData);
      
      const id = newStatRef.key;
      
      return id!;
    } catch (error) {
      console.error('Error adding statistics:', error);
      throw error;
    }
  },

  // Update statistics
  async update(id: string, data: Partial<AnnualStatistics>): Promise<void> {
    try {
      const statRef = ref(database, `${COLLECTION_PATH}/${id}`);
      
      // First, get existing data
      const snapshot = await get(statRef);
      if (!snapshot.exists()) {
        throw new Error(`Statistics with ID ${id} not found`);
      }
      
      const existingData = snapshot.val();
      
      // Merge existing data with new data
      const updateData = {
        ...existingData,
        ...data,
        updatedAt: new Date().toISOString(),
        // Preserve createdAt from existing data
        createdAt: existingData.createdAt,
      };
      
      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });
      
      // Use set to replace the entire document with merged data
      await set(statRef, updateData);
    } catch (error) {
      console.error('Error updating statistics:', error);
      throw error;
    }
  },

  // Delete statistics
  async delete(id: string): Promise<void> {
    try {
      const statRef = ref(database, `${COLLECTION_PATH}/${id}`);
      await remove(statRef);
    } catch (error) {
      console.error('Error deleting statistics:', error);
      throw error;
    }
  },
};
