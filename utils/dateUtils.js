/**
 * Date Utilities
 * Client-side helper functions for date/time operations
 */

// Format date for display
export const formatDate = (date, format = 'long') => {
  if (!date) return '';

  try {
    const d = new Date(date);
    
    if (isNaN(d.getTime())) {
      return 'Invalid date';
    }

    const formats = {
      'short': { month: 'short', day: 'numeric' },
      'medium': { month: 'short', day: 'numeric', year: 'numeric' },
      'long': { month: 'long', day: 'numeric', year: 'numeric' },
      'full': { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
    };

    return d.toLocaleDateString('en-US', formats[format] || formats.medium);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

// Format time for display
export const formatTime = (date, format = '12h') => {
  if (!date) return '';

  try {
    const d = new Date(date);
    
    if (isNaN(d.getTime())) {
      return 'Invalid time';
    }

    const options = format === '24h' 
      ? { hour: '2-digit', minute: '2-digit', hour12: false }
      : { hour: 'numeric', minute: '2-digit', hour12: true };

    return d.toLocaleTimeString('en-US', options);
  } catch (error) {
    console.error('Time formatting error:', error);
    return '';
  }
};

// Format datetime for display
export const formatDateTime = (date, format = 'medium') => {
  if (!date) return '';

  const dateStr = formatDate(date, format);
  const timeStr = formatTime(date);

  return `${dateStr} at ${timeStr}`;
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (date) => {
  if (!date) return '';

  try {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
  } catch (error) {
    console.error('Relative time error:', error);
    return '';
  }
};

// Check if date is today
export const isToday = (date) => {
  if (!date) return false;

  try {
    const d = new Date(date);
    const today = new Date();

    return d.getDate() === today.getDate() &&
           d.getMonth() === today.getMonth() &&
           d.getFullYear() === today.getFullYear();
  } catch (error) {
    return false;
  }
};

// Check if date is yesterday
export const isYesterday = (date) => {
  if (!date) return false;

  try {
    const d = new Date(date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return d.getDate() === yesterday.getDate() &&
           d.getMonth() === yesterday.getMonth() &&
           d.getFullYear() === yesterday.getFullYear();
  } catch (error) {
    return false;
  }
};

// Get days between two dates
export const getDaysBetween = (startDate, endDate) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  } catch (error) {
    console.error('Days between error:', error);
    return 0;
  }
};

// Get start of day
export const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Get end of day
export const getEndOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

// Get start of week
export const getStartOfWeek = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

// Get end of week
export const getEndOfWeek = (date = new Date()) => {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
};

// Get start of month
export const getStartOfMonth = (date = new Date()) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

// Get end of month
export const getEndOfMonth = (date = new Date()) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
};

// Format ISO date string (YYYY-MM-DD)
export const formatISODate = (date = new Date()) => {
  try {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('ISO date formatting error:', error);
    return '';
  }
};

// Parse ISO date string
export const parseISODate = (dateString) => {
  try {
    return new Date(dateString);
  } catch (error) {
    console.error('ISO date parsing error:', error);
    return null;
  }
};

// Add days to date
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Subtract days from date
export const subtractDays = (date, days) => {
  return addDays(date, -days);
};

// Get day name
export const getDayName = (date, format = 'long') => {
  try {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { weekday: format });
  } catch (error) {
    return '';
  }
};

// Get month name
export const getMonthName = (date, format = 'long') => {
  try {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: format });
  } catch (error) {
    return '';
  }
};

// Check if date is in the future
export const isFuture = (date) => {
  try {
    return new Date(date) > new Date();
  } catch (error) {
    return false;
  }
};

// Check if date is in the past
export const isPast = (date) => {
  try {
    return new Date(date) < new Date();
  } catch (error) {
    return false;
  }
};

// Get time until date
export const getTimeUntil = (date) => {
  try {
    const target = new Date(date);
    const now = new Date();
    const diff = target - now;

    if (diff < 0) return 'Past';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  } catch (error) {
    return '';
  }
};

// Validate date
export const isValidDate = (date) => {
  try {
    const d = new Date(date);
    return !isNaN(d.getTime());
  } catch (error) {
    return false;
  }
};

// Export all functions
export default {
  formatDate,
  formatTime,
  formatDateTime,
  getRelativeTime,
  isToday,
  isYesterday,
  getDaysBetween,
  getStartOfDay,
  getEndOfDay,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
  formatISODate,
  parseISODate,
  addDays,
  subtractDays,
  getDayName,
  getMonthName,
  isFuture,
  isPast,
  getTimeUntil,
  isValidDate
};
