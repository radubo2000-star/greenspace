// ============================================
// ANNUAL STATISTICS SERVICE (backend REST)
// ============================================
// Data now lives in
// MySQL (annual_statistics table) and is exposed through /api/statistics.

import { getBackendUrl } from '@/lib/backend-config';
import { AnnualStatistics } from '../types/statistics';

const BASE = '/statistics';

type StatisticsInput = Omit<AnnualStatistics, 'id' | 'createdAt' | 'updatedAt'>;

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${getBackendUrl()}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data as { error?: string }).error || 'Eroare la comunicarea cu serverul.');
  }
  return data as T;
}

function parseStatistic(raw: Partial<AnnualStatistics>): AnnualStatistics {
  return {
    id: raw.id,
    year: raw.year || 0,
    volunteers: raw.volunteers || 0,
    treesPlanted: raw.treesPlanted || 0,
    projects: raw.projects || 0,
    events: raw.events || 0,
    plantingEvents: raw.plantingEvents || 0,
    wasteCollected: raw.wasteCollected || 0,
    participants: raw.participants || 0,
    createdAt: raw.createdAt ? new Date(raw.createdAt) : undefined,
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : undefined,
  };
}

export const statisticsService = {
  // Get all statistics
  async getAll(): Promise<AnnualStatistics[]> {
    const data = await api<{ success: boolean; statistics: Partial<AnnualStatistics>[] }>(BASE);
    return (data.statistics || []).map(parseStatistic);
  },

  // Get statistics by year
  async getByYear(year: number): Promise<AnnualStatistics | null> {
    const stats = await this.getAll();
    return stats.find(s => s.year === year) || null;
  },

  // Add new statistics
  async add(data: StatisticsInput): Promise<string> {
    const result = await api<{ id: string }>(BASE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return result.id;
  },

  // Update statistics
  async update(id: string, data: Partial<AnnualStatistics>): Promise<void> {
    await api(`${BASE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete statistics
  async delete(id: string): Promise<void> {
    await api(`${BASE}/${id}`, { method: 'DELETE' });
  },
};