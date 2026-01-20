/**
 * Date formatting helper functions
 */

/**
 * Format date string for display (e.g., "2026-01-09" -> "Thu, Jan 9")
 */
export const formatDateDisplay = (dateString: string): string => {
  if (!dateString) return 'Select date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format ISO date string for display with time (e.g., "2026-01-09T16:00:00.000Z" -> "Jan 9, 2026, 4:00 PM")
 */
export const formatExceptionDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Check if two date strings represent the same date
 */
export const isSameDate = (date1: string, date2: string): boolean => {
  return date1 === date2;
};

/**
 * Compare two date strings (returns true if date1 is after date2)
 */
export const isDateAfter = (date1: string, date2: string): boolean => {
  return date1 > date2;
};
