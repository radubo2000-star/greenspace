import { useState, useEffect, useMemo } from 'react';
import { AnnualStatistics, StatisticsSummary } from '../types/statistics';
import { statisticsService } from '../services/statistics-service';

export const useStatistics = () => {
  const [statistics, setStatistics] = useState<AnnualStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const data = await statisticsService.getAll();
      setStatistics(data);
      setError(null);
    } catch (err) {
      setError('Eroare la încărcarea statisticilor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  // Calculate cumulative statistics (memoized to avoid recomputation on every render)
  const getSummary = useMemo((): StatisticsSummary => {
    // Pentru voluntari, folosim doar ultimul an (cei activi)
    // Pentru restul, facem suma pe toți anii
    const sortedStats = [...statistics].sort((a, b) => b.year - a.year);
    const latestYearVolunteers = sortedStats.length > 0 ? sortedStats[0].volunteers : 0;
    
    const totalTreesPlanted = statistics.reduce((sum, s) => sum + s.treesPlanted, 0);
    const totalProjects = statistics.reduce((sum, s) => sum + s.projects, 0);
    const totalEvents = statistics.reduce((sum, s) => sum + s.events, 0);
    const totalPlantingEvents = statistics.reduce((sum, s) => sum + (s.plantingEvents || 0), 0);
    const totalWasteCollected = statistics.reduce((sum, s) => sum + (s.wasteCollected || 0), 0);
    const totalParticipants = statistics.reduce((sum, s) => sum + (s.participants || 0), 0);

    // Helper function to round numbers
    const roundNumber = (num: number, roundTo: number = 100): number => {
      if (num === 0) return 0;
      return Math.ceil(num / roundTo) * roundTo;
    };

    // Helper function to format numbers with "+"
    const formatNumber = (num: number, roundTo: number = 100): string => {
      if (num === 0) return '0';
      const rounded = roundNumber(num, roundTo);
      return `${rounded.toLocaleString('ro-RO')}+`;
    };

    // Rounded values (for counter animations)
    const roundedVolunteers = roundNumber(latestYearVolunteers, 50);
    const roundedTrees = roundNumber(totalTreesPlanted, 1000);
    const roundedProjects = roundNumber(totalProjects, 10);
    const roundedEvents = roundNumber(totalEvents, 5);
    const roundedPlantingEvents = roundNumber(totalPlantingEvents, 5);
    const roundedWaste = roundNumber(totalWasteCollected, 100);
    const roundedParticipants = roundNumber(totalParticipants, 100);

    return {
      // Raw totals
      totalVolunteers: latestYearVolunteers, // Doar ultimul an
      totalTreesPlanted,
      totalProjects,
      totalEvents,
      totalPlantingEvents,
      totalWasteCollected,
      totalParticipants,
      
      // Rounded values (for counter animations)
      roundedVolunteers,
      roundedTrees,
      roundedProjects,
      roundedEvents,
      roundedPlantingEvents,
      roundedWaste,
      roundedParticipants,
      
      // Formatted displays (with "+")
      volunteersDisplay: formatNumber(latestYearVolunteers, 50), // Voluntari activi (ultimul an)
      treesDisplay: formatNumber(totalTreesPlanted, 1000), // Round to nearest 1000
      projectsDisplay: formatNumber(totalProjects, 10), // Round to nearest 10
      eventsDisplay: formatNumber(totalEvents, 5), // Round to nearest 5
      plantingEventsDisplay: formatNumber(totalPlantingEvents, 5), // Round to nearest 5
      wasteDisplay: formatNumber(totalWasteCollected, 100), // Round to nearest 100
      participantsDisplay: formatNumber(totalParticipants, 100), // Round to nearest 100
    };
  }, [statistics]);

  // Get statistics for specific year
  const getByYear = (year: number): AnnualStatistics | undefined => {
    return statistics.find(s => s.year === year);
  };

  // Get current year statistics
  const getCurrentYearStats = (): AnnualStatistics | undefined => {
    const currentYear = new Date().getFullYear();
    return getByYear(currentYear);
  };

  return {
    statistics,
    loading,
    error,
    getSummary,
    getByYear,
    getCurrentYearStats,
    refetch: fetchStatistics,
  };
};
