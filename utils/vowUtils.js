/**
 * Vow Utilities
 * Client-side helper functions for vow management
 */

// Validate vow statement
export const validateVowStatement = (statement) => {
  if (!statement || typeof statement !== 'string') {
    return { valid: false, error: 'Vow statement is required' };
  }

  const trimmed = statement.trim();

  if (trimmed.length < 10) {
    return { valid: false, error: 'Vow statement must be at least 10 characters' };
  }

  if (trimmed.length > 300) {
    return { valid: false, error: 'Vow statement must be less than 300 characters' };
  }

  return { valid: true, value: trimmed };
};

// Calculate vow completion percentage
export const calculateVowCompletion = (vow) => {
  if (!vow || !vow.duration || !vow.currentDay) {
    return 0;
  }

  const percentage = (vow.currentDay / vow.duration) * 100;
  return Math.min(Math.round(percentage), 100);
};

// Calculate days remaining in vow
export const calculateDaysRemaining = (vow) => {
  if (!vow || !vow.duration || !vow.currentDay) {
    return vow?.duration || 0;
  }

  return Math.max(vow.duration - vow.currentDay, 0);
};

// Check if vow is completed
export const isVowCompleted = (vow) => {
  if (!vow) return false;
  
  return vow.status === 'completed' || 
         (vow.currentDay >= vow.duration);
};

// Check if vow is active
export const isVowActive = (vow) => {
  if (!vow) return false;
  
  return vow.status === 'active' && !isVowCompleted(vow);
};

// Format vow category for display
export const formatVowCategory = (category) => {
  if (!category) return 'Unknown';

  const categoryMap = {
    'addiction': 'Addiction Recovery',
    'procrastination': 'Procrastination',
    'self_sabotage': 'Self-Sabotage',
    'emotional': 'Emotional Healing',
    'habit': 'Habit Building',
    'other': 'Other'
  };

  return categoryMap[category.toLowerCase()] || category;
};

// Get vow status color
export const getVowStatusColor = (vow) => {
  if (!vow) return 'gray';

  if (isVowCompleted(vow)) {
    return 'green';
  }

  if (vow.currentStreak >= 7) {
    return 'amber';
  }

  if (vow.currentStreak >= 3) {
    return 'blue';
  }

  return 'gray';
};

// Get vow status badge
export const getVowStatusBadge = (vow) => {
  if (!vow) return { text: 'Unknown', color: 'bg-gray-100 text-gray-700' };

  const statusMap = {
    'active': { text: 'Active', color: 'bg-blue-100 text-blue-700' },
    'completed': { text: 'Completed', color: 'bg-green-100 text-green-700' },
    'paused': { text: 'Paused', color: 'bg-yellow-100 text-yellow-700' },
    'abandoned': { text: 'Abandoned', color: 'bg-red-100 text-red-700' }
  };

  return statusMap[vow.status] || { text: vow.status, color: 'bg-gray-100 text-gray-700' };
};

// Calculate streak health (0-100)
export const calculateStreakHealth = (vow) => {
  if (!vow || !vow.currentStreak) return 0;

  const daysSinceStart = vow.currentDay || 1;
  const streakPercentage = (vow.currentStreak / daysSinceStart) * 100;

  return Math.min(Math.round(streakPercentage), 100);
};

// Check if user needs encouragement
export const needsEncouragement = (vow) => {
  if (!vow) return false;

  // No streak
  if (!vow.currentStreak || vow.currentStreak === 0) {
    return true;
  }

  // Streak broken recently
  if (vow.longestStreak > vow.currentStreak + 3) {
    return true;
  }

  return false;
};

// Get encouragement message
export const getEncouragementMessage = (vow) => {
  if (!vow) return 'Start your journey today!';

  if (!vow.currentStreak || vow.currentStreak === 0) {
    return 'Every journey begins with a single step. 🌱';
  }

  if (vow.currentStreak === 1) {
    return 'You\'ve taken the first step! Keep going. 💪';
  }

  if (vow.currentStreak >= 7 && vow.currentStreak < 14) {
    return 'One week strong! You\'re building momentum. 🔥';
  }

  if (vow.currentStreak >= 14 && vow.currentStreak < 30) {
    return 'Two weeks! This is becoming part of who you are. ✨';
  }

  if (vow.currentStreak >= 30) {
    return 'A full month! You\'re transforming. 🌟';
  }

  return 'You\'re doing great! Keep honoring your vow. 🙏';
};

// Sort vows by priority
export const sortVowsByPriority = (vows) => {
  if (!vows || !Array.isArray(vows)) return [];

  return [...vows].sort((a, b) => {
    // Active vows first
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (a.status !== 'active' && b.status === 'active') return 1;

    // Then by current streak (descending)
    if ((b.currentStreak || 0) !== (a.currentStreak || 0)) {
      return (b.currentStreak || 0) - (a.currentStreak || 0);
    }

    // Then by creation date (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

// Filter vows by status
export const filterVowsByStatus = (vows, status) => {
  if (!vows || !Array.isArray(vows)) return [];
  if (!status) return vows;

  return vows.filter(vow => vow.status === status);
};

// Get active vows
export const getActiveVows = (vows) => {
  return filterVowsByStatus(vows, 'active');
};

// Get completed vows
export const getCompletedVows = (vows) => {
  return filterVowsByStatus(vows, 'completed');
};

// Calculate total days committed across all vows
export const calculateTotalCommitment = (vows) => {
  if (!vows || !Array.isArray(vows)) return 0;

  return vows.reduce((total, vow) => {
    return total + (vow.currentDay || 0);
  }, 0);
};

// Get vow milestone
export const getVowMilestone = (vow) => {
  if (!vow || !vow.currentDay) return null;

  const milestones = [
    { day: 1, message: 'First day completed! 🎉', emoji: '🌱' },
    { day: 3, message: '3 days strong!', emoji: '💪' },
    { day: 7, message: 'One week milestone!', emoji: '🔥' },
    { day: 14, message: 'Two weeks of transformation!', emoji: '✨' },
    { day: 21, message: '21 days - habit forming!', emoji: '🌟' },
    { day: 30, message: 'One month completed!', emoji: '🎊' },
    { day: 60, message: 'Two months of dedication!', emoji: '🏆' },
    { day: 90, message: '90 days - incredible!', emoji: '👑' },
    { day: 180, message: 'Half a year of growth!', emoji: '🌈' },
    { day: 365, message: 'One full year! Legendary!', emoji: '🎆' }
  ];

  // Find the milestone that matches current day
  const milestone = milestones.find(m => m.day === vow.currentDay);
  
  return milestone || null;
};

// Generate vow summary
export const generateVowSummary = (vow) => {
  if (!vow) return 'No vow data';

  const completion = calculateVowCompletion(vow);
  const daysRemaining = calculateDaysRemaining(vow);
  const status = getVowStatusBadge(vow);

  return {
    title: vow.statement,
    category: formatVowCategory(vow.category),
    status: status.text,
    statusColor: status.color,
    completion: `${completion}%`,
    currentDay: vow.currentDay || 0,
    duration: vow.duration || 0,
    daysRemaining,
    streak: vow.currentStreak || 0,
    longestStreak: vow.longestStreak || 0,
    isCompleted: isVowCompleted(vow),
    isActive: isVowActive(vow)
  };
};

// Validate vow update data
export const validateVowUpdate = (updates) => {
  const errors = [];

  if (updates.statement !== undefined) {
    const validation = validateVowStatement(updates.statement);
    if (!validation.valid) {
      errors.push(validation.error);
    }
  }

  if (updates.status !== undefined) {
    const validStatuses = ['active', 'completed', 'paused', 'abandoned'];
    if (!validStatuses.includes(updates.status)) {
      errors.push('Invalid status');
    }
  }

  if (updates.currentDay !== undefined) {
    if (typeof updates.currentDay !== 'number' || updates.currentDay < 0) {
      errors.push('Invalid current day');
    }
  }

  if (updates.currentStreak !== undefined) {
    if (typeof updates.currentStreak !== 'number' || updates.currentStreak < 0) {
      errors.push('Invalid streak value');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Export all functions
export default {
  validateVowStatement,
  calculateVowCompletion,
  calculateDaysRemaining,
  isVowCompleted,
  isVowActive,
  formatVowCategory,
  getVowStatusColor,
  getVowStatusBadge,
  calculateStreakHealth,
  needsEncouragement,
  getEncouragementMessage,
  sortVowsByPriority,
  filterVowsByStatus,
  getActiveVows,
  getCompletedVows,
  calculateTotalCommitment,
  getVowMilestone,
  generateVowSummary,
  validateVowUpdate
};
