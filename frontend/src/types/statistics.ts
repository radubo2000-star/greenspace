export interface AnnualStatistics {
  id?: string;
  year: number;
  
  // Câmpuri Obligatorii
  volunteers: number; // Voluntari activi
  treesPlanted: number; // Copaci/puieți plantați (număr total)
  projects: number; // Proiecte finalizate
  events: number; // Evenimente organizate (total)
  plantingEvents?: number; // Evenimente de plantare (subset din events)
  
  // Câmpuri Opționale
  wasteCollected?: number; // Deșeuri colectate (kg)
  participants?: number; // Total participanți
  
  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
}

export interface StatisticsSummary {
  // Raw totals
  totalVolunteers: number;
  totalTreesPlanted: number;
  totalProjects: number;
  totalEvents: number;
  totalPlantingEvents: number;
  totalWasteCollected: number;
  totalParticipants: number;
  
  // Rounded values (for counter animations)
  roundedVolunteers: number;
  roundedTrees: number;
  roundedProjects: number;
  roundedEvents: number;
  roundedPlantingEvents: number;
  roundedWaste: number;
  roundedParticipants: number;
  
  // Formatted values with "+"
  volunteersDisplay: string;
  treesDisplay: string;
  projectsDisplay: string;
  eventsDisplay: string;
  plantingEventsDisplay: string;
  wasteDisplay: string;
  participantsDisplay: string;
}
