/**
 * Date utilities for consistent date handling across the app
 * All dates are handled in IST (Indian Standard Time)
 */

/**
 * Get current date in IST
 */
export const getCurrentISTDate = (): Date => {
  const now = new Date();
  // Create a new date with IST timezone
  const istDate = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
  return istDate;
};

/**
 * Get today's date in IST as YYYY-MM-DD format
 */
export const getTodayIST = (): string => {
  const now = new Date();
  // Use toLocaleDateString with IST timezone to get correct date
  return now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // en-CA gives YYYY-MM-DD format
};

/**
 * Get current IST date as a formatted string
 */
export const getCurrentISTString = (): string => {
  const now = new Date();
  return now.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Get IST date for a specific date string
 */
export const getISTDateFromString = (dateString: string): Date => {
  const date = new Date(dateString);
  return new Date(date.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
};

/**
 * Format date for display in IST
 */
export const formatDateIST = (date: Date, format: 'short' | 'long' | 'date-only' = 'short'): string => {
  switch (format) {
    case 'date-only':
      return date.toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    case 'long':
      return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    case 'short':
    default:
      return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
  }
};

/**
 * Get day name in IST
 */
export const getDayNameIST = (date?: Date): string => {
  const targetDate = date || new Date();
  return targetDate.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long'
  });
};

/**
 * Get month name in IST
 */
export const getMonthNameIST = (date?: Date): string => {
  const targetDate = date || new Date();
  return targetDate.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    month: 'long'
  });
};

/**
 * Get short month name in IST
 */
export const getShortMonthNameIST = (date?: Date): string => {
  const targetDate = date || new Date();
  return targetDate.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    month: 'short'
  });
};

/**
 * Get day number in IST
 */
export const getDayNumberIST = (date?: Date): number => {
  const targetDate = date || new Date();
  const istDateString = targetDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  return parseInt(istDateString.split('-')[2], 10);
};

/**
 * Check if a date is today in IST
 */
export const isTodayIST = (date: Date): boolean => {
  const today = getTodayIST();
  const dateString = date.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  return today === dateString;
};

/**
 * Get timestamp in IST
 */
export const getISTTimestamp = (): string => {
  const now = new Date();
  // Return a simple IST timestamp string
  const istDate = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const istTime = now.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  return `${istDate}T${istTime}+05:30`;
};