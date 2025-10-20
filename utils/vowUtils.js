/**
 * Vow utility functions
 * Handles vow creation, updates, and management
 */

import { getTodayDate, daysBetween, isToday } from './dateUtils';

/**
 * Create vow statement from identity and boundary
 */
export function createVowStatement(identityType, boundary) {
  return `I'm the type of person that ${identityType}; therefore, I will ${boundary}.`;
}

/**
 * Parse vow statement into components
 */
export function parseVowStatement(statement) {
  const regex = /I'm the type of person that (.+); therefore, I will (.+)\./i;
  const match = statement.match(regex);
  
  if (match) {
    return {
      identityType: match[1].trim(),
      boundary: match[2].trim()
    };
  }
  
  return null;
}

/**
 * Calculate vow progress
 */
export function calculateVowProgress(vow) {
  if (!vow) return 0;
  
  const { duration, currentDay } = vow;
  const progress = Math.min(Math.round((currentDay / duration) * 100), 100);
  
  return progress;
}

/**
 * Check if vow is active
 */
export function isVowActive(vow) {
  if (!vow) return false;
  return vow.status === 'active' && vow.currentDay < vow.duration;
}

/**
 * Check if vow is completed
 */
export function isVowCompleted(vow) {
  if (!vow) return false;
  return vow.status === 'completed' || vow.currentDay >= vow.duration;
}

/**
 * Get vow status display
 */
export function getVowStatusDisplay(vow) {
  if (!vow) return 'Unknown';
  
  if (isVowCompleted(vow)) return 'Completed';
  if (isVowActive(vow)) return `Day ${vow.currentDay}/${vow.duration}`;
  if (vow.status === 'paused') return 'Paused';
  if (vow.status === 'broken') return 'Broken';
  
  return 'Active';
}

/**
 * Get days remaining
 */
export function getDaysRemaining(vow) {
  if (!vow) return 0;
  return Math.max(vow.duration - vow.currentDay, 0);
}

/**
 * Check if vow can be updated today
 */
export function canUpdateToday(vow) {
  if (!vow || !vow.lastUpdated) return true;
  return !isToday(vow.lastUpdated);
}

/**
 * Get vow category icon
 */
export function getCategoryIcon(category) {
  const icons = {
    health: '💪',
    addiction: '🚫',
    relationship: '❤️',
    focus: '🎯',
    character: '⭐',
    custom: '📝',
    other: '🔷'
  };
  
  return icons[category] || icons.other;
}

/**
 * Get vow category label
 */
export function getCategoryLabel(category) {
  const labels = {
    health: 'Health',
    addiction: 'Breaking Addiction',
    relationship: 'Relationships',
    focus: 'Focus & Discipline',
    character: 'Character Building',
    custom: 'Custom',
    other: 'Other'
  };
  
  return labels[category] || 'Other';
}

/**
 * Validate vow data
 */
export function validateVowData(vow) {
  const errors = [];
  
  if (!vow.statement || vow.statement.length < 10) {
    errors.push('Vow statement must be at least 10 characters');
  }
  
  if (!vow.category) {
    errors.push('Category is required');
  }
  
  if (!vow.duration || vow.duration < 1 || vow.duration > 365) {
    errors.push('Duration must be between 1 and 365 days');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get vow achievement level
 */
export function getVowAchievementLevel(vow) {
  if (!vow) return null;
  
  const progress = calculateVowProgress(vow);
  
  if (progress >= 100) return { level: 'Master', icon: '👑', color: '#FFD700' };
  if (progress >= 75) return { level: 'Advanced', icon: '⭐', color: '#C0C0C0' };
  if (progress >= 50) return { level: 'Intermediate', icon: '🌟', color: '#CD7F32' };
  if (progress >= 25) return { level: 'Beginner', icon: '🌱', color: '#90EE90' };
  
  return { level: 'Starting', icon: '🌱', color: '#E0E0E0' };
}

/**
 * Sort vows by priority
 */
export function sortVowsByPriority(vows) {
  return [...vows].sort((a, b) => {
    // Active vows first
    if (isVowActive(a) && !isVowActive(b)) return -1;
    if (!isVowActive(a) && isVowActive(b)) return 1;
    
    // Then by creation date (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}

/**
 * Get vow duration label
 */
export function getDurationLabel(days) {
  if (days === 7) return '1 Week';
  if (days === 30) return '1 Month';
  if (days === 90) return '3 Months';
  if (days === 365) return '1 Year';
  return `${days} Days`;
}

/**
 * Calculate completion rate
 */
export function calculateCompletionRate(vows) {
  if (!vows || vows.length === 0) return 0;
  
  const completed = vows.filter(v => isVowCompleted(v)).length;
  return Math.round((completed / vows.length) * 100);
}
