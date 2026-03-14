/**
 * Calculează numărul de ani de activitate față de anul de înființare
 * @param foundingYear - Anul de înființare al asociației (default: 2020)
 * @returns Numărul de ani de activitate
 */
export const calculateYearsOfActivity = (foundingYear: number = 2020): number => {
  const currentYear = new Date().getFullYear();
  return currentYear - foundingYear;
};

/**
 * Returnează numărul de ani formatat cu "+"
 * @param foundingYear - Anul de înființare al asociației (default: 2020)
 * @returns String formatat (ex: "5+")
 */
export const getYearsOfActivityFormatted = (foundingYear: number = 2020): string => {
  const years = calculateYearsOfActivity(foundingYear);
  return `${years}+`;
};
