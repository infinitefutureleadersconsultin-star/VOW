/**
 * Date Utility Functions
 * Helper functions for date manipulation and formatting
 */

/**
 * Format date for display
 */
export function formatDate(dateInput, format = 'long') {
  if (!dateInput) return '';
  
  const date = new Date(dateInput);
  
  if (isNaN(date.getTime())) {
    return '';
  }

  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    
    case 'medium':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    
    case 'long':
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    
    case 'time':
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      });
    
    case 'datetime':
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    
    case 'iso':
      return date.toISOString();
    
    default:
      return date.toLocaleDateString();
  }
}

/**
 * Check if date is today
 */
export function isToday(dateInput) {
  if (!dateInput) return false;
  
  const date = new Date(dateInput);
  const today = new Date();
  
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is yesterday
 */
export function isYesterday(dateInput) {
  if (!dateInput) return false;
  
  const date = new Date(dateInput);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Reset time to midnight for accurate day calculation
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Get days ago from now
 */
export function daysAgo(dateInput) {
  if (!dateInput) return 0;
  
  const date = new Date(dateInput);
  const now = new Date();
  
  return daysBetween(date, now);
}

/**
 * Format time ago (e.g., "2 hours ago")
 */
export function timeAgo(dateInput) {
  if (!dateInput) return '';
  
  const date = new Date(dateInput);
  const now = new Date();
  const diffMs = now - date;
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}

/**
 * Get start of day
 */
export function startOfDay(dateInput = new Date()) {
  const date = new Date(dateInput);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Get end of day
 */
export function endOfDay(dateInput = new Date()) {
  const date = new Date(dateInput);
  date.setHours(23, 59, 59, 999);
  return date;
}

/**
 * Get start of week (Sunday)
 */
export function startOfWeek(dateInput = new Date()) {
  const date = new Date(dateInput);
  const day = date.getDay();
  const diff = date.getDate() - day;
  
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  
  return date;
}

/**
 * Get end of week (Saturday)
 */
export function endOfWeek(dateInput = new Date()) {
  const date = new Date(dateInput);
  const day = date.getDay();
  const diff = date.getDate() + (6 - day);
  
  date.setDate(diff);
  date.setHours(23, 59, 59, 999);
  
  return date;
}

/**
 * Get start of month
 */
export function startOfMonth(dateInput = new Date()) {
  const date = new Date(dateInput);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Get end of month
 */
export function endOfMonth(dateInput = new Date()) {
  const date = new Date(dateInput);
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  date.setHours(23, 59, 59, 999);
  return date;
}

/**
 * Add days to date
 */
export function addDays(dateInput, days) {
  const date = new Date(dateInput);
  date.setDate(date.getDate() + days);
  return date;
}

/**
 * Subtract days from date
 */
export function subtractDays(dateInput, days) {
  return addDays(dateInput, -days);
}

/**
 * Check if date is in the past
 */
export function isPast(dateInput) {
  const date = new Date(dateInput);
  const now = new Date();
  return date < now;
}

/**
 * Check if date is in the future
 */
export function isFuture(dateInput) {
  const date = new Date(dateInput);
  const now = new Date();
  return date > now;
}

/**
 * Get date range for last N days
 */
export function getLastNDays(n) {
  const end = new Date();
  const start = subtractDays(end, n);
  
  return {
    start: startOfDay(start),
    end: endOfDay(end)
  };
}

/**
 * Get current week range
 */
export function getCurrentWeek() {
  return {
    start: startOfWeek(),
    end: endOfWeek()
  };
}

/**
 * Get current month range
 */
export function getCurrentMonth() {
  return {
    start: startOfMonth(),
    end: endOfMonth()
  };
}

/**
 * Calculate streak from array of dates
 */
export function calculateStreak(dates) {
  if (!dates || dates.length === 0) return 0;
  
  // Sort dates in descending order
  const sortedDates = dates
    .map(d => startOfDay(new Date(d)))
    .sort((a, b) => b - a);
  
  let streak = 0;
  const today = startOfDay(new Date());
  
  // Check if most recent date is today or yesterday
  const mostRecent = sortedDates[0];
  const daysDiff = daysBetween(mostRecent, today);
  
  if (daysDiff > 1) return 0; // Streak broken
  
  // Count consecutive days
  let expectedDate = startOfDay(mostRecent);
  
  for (const date of sortedDates) {
    const currentDate = startOfDay(date);
    
    if (currentDate.getTime() === expectedDate.getTime()) {
      streak++;
      expectedDate = subtractDays(expectedDate, 1);
    } else if (currentDate < expectedDate) {
      // Gap found, streak ends
      break;
    }
  }
  
  return streak;
}

/**
 * Get dates in range
 */
export function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);
  
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

/**
 * Group dates by day
 */
export function groupByDay(items, dateField = 'createdAt') {
  const grouped = {};
  
  items.forEach(item => {
    const date = startOfDay(new Date(item[dateField]));
    const key = date.toISOString().split('T')[0];
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    
    grouped[key].push(item);
  });
  
  return grouped;
}

/**
 * Get week number
 */
export function getWeekNumber(dateInput = new Date()) {
  const date = new Date(dateInput);
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - firstDay) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + firstDay.getDay() + 1) / 7);
}

/**
 * Format duration (e.g., "2 weeks", "30 days")
 */
export function formatDuration(days) {
  if (days === 0) return 'today';
  if (days === 1) return '1 day';
  if (days < 7) return `${days} days`;
  if (days < 14) return '1 week';
  if (days < 30) return `${Math.floor(days / 7)} weeks`;
  if (days < 60) return '1 month';
  if (days < 365) return `${Math.floor(days / 30)} months`;
  return `${Math.floor(days / 365)} years`;
}

/**
 * Parse date string safely
 */
export function parseDate(dateString) {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return null;
  }
  
  return date;
}

/**
 * Compare dates (returns -1, 0, or 1)
 */
export function compareDates(date1, date2) {
  const d1 = startOfDay(new Date(date1));
  const d2 = startOfDay(new Date(date2));
  
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

/**
 * Get relative date string (e.g., "Today", "Yesterday", "2 days ago")
 */
export function getRelativeDateString(dateInput) {
  if (isToday(dateInput)) return 'Today';
  if (isYesterday(dateInput)) return 'Yesterday';
  
  const days = daysAgo(dateInput);
  
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  
  return formatDate(dateInput, 'medium');
}

/**
 * Check if same day
 */
export function isSameDay(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}
