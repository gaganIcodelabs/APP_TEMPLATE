/**
 * Time utility functions for availability scheduling
 */

export interface TimeOption {
  label: string;
  value: string;
}

/**
 * Generate time options from 12:00 AM to 11:00 PM 
 */
export const generateTimeOptions = (includeNextDay: boolean = true): TimeOption[] => {
  const times: TimeOption[] = [];
  for (let hour = 0; hour < 24; hour++) {
    const hourStr = hour.toString().padStart(2, '0');
    const value = `${hourStr}:00`;
    const label = formatTimeDisplay(value);
    times.push({ label, value });
  }
  
  if (includeNextDay) {
    times.push({ label: '12:00 AM', value: '24:00' });
  }
  
  return times;
};

/**
 * Format time for display (e.g., "09:00" -> "9:00 AM")
 */
export const formatTimeDisplay = (time: string): string => {
  if (!time) return 'Start';
  if (time === '24:00') return '12:00 AM';
  
  const [hourStr] = time.split(':');
  const hour = parseInt(hourStr, 10);
  
  if (hour === 0) return '12:00 AM';
  if (hour === 12) return '12:00 PM';
  if (hour < 12) return `${hour}:00 AM`;
  return `${hour - 12}:00 PM`;
};

/**
 * Get filtered time options after a given start time
 */
export const getTimeOptionsAfter = (
  startTime: string,
  allOptions: TimeOption[]
): TimeOption[] => {
  if (!startTime) {
    return allOptions;
  }
  
  const startIndex = allOptions.findIndex(opt => opt.value === startTime);
  return allOptions.slice(startIndex + 1);
};
