/**
 * Rewards and Gamification System
 * XP, levels, and achievement tracking
 */

/**
 * XP values for different actions
 */
export const XP_VALUES = {
  create_vow: 50,
  daily_reflection: 25,
  log_trigger: 15,
  complete_week: 100,
  complete_month: 500,
  complete_vow: 1000,
  streak_milestone_7: 200,
  streak_milestone_30: 800,
  streak_milestone_90: 2500,
  first_integration: 150,
  share_insight: 30,
  help_community: 40
};

/**
 * Level thresholds
 */
export const LEVELS = [
  { level: 1, xpRequired: 0, title: 'Awakening' },
  { level: 2, xpRequired: 100, title: 'Observer' },
  { level: 3, xpRequired: 250, title: 'Seeker' },
  { level: 4, xpRequired: 500, title: 'Aware' },
  { level: 5, xpRequired: 1000, title: 'Integrated' },
  { level: 6, xpRequired: 2000, title: 'Remembering' },
  { level: 7, xpRequired: 3500, title: 'Grounded' },
  { level: 8, xpRequired: 5500, title: 'Aligned' },
  { level: 9, xpRequired: 8000, title: 'Transformed' },
  { level: 10, xpRequired: 12000, title: 'Liberated' }
];

/**
 * Calculate level from XP
 */
export function calculateLevel(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

/**
 * Get XP needed for next level
 */
export function getXPForNextLevel(currentXP) {
  const currentLevel = calculateLevel(currentXP);
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
  
  if (!nextLevel) return null; // Max level reached
  
  return {
    current: currentXP,
    required: nextLevel.xpRequired,
    remaining: nextLevel.xpRequired - currentXP,
    percentage: Math.round((currentXP / nextLevel.xpRequired) * 100)
  };
}

/**
 * Award XP for action
 */
export function awardXP(action, multiplier = 1) {
  const baseXP = XP_VALUES[action] || 0;
  return Math.round(baseXP * multiplier);
}

/**
 * Calculate streak bonus
 */
export function calculateStreakBonus(streak) {
  if (streak >= 90) return 3.0; // 300% bonus
  if (streak >= 30) return 2.0; // 200% bonus
  if (streak >= 7) return 1.5;  // 150% bonus
  return 1.0; // No bonus
}

/**
 * Get XP with streak bonus
 */
export function getXPWithStreak(action, streak) {
  const baseXP = XP_VALUES[action] || 0;
  const bonus = calculateStreakBonus(streak);
  return Math.round(baseXP * bonus);
}

/**
 * Check if level up occurred
 */
export function checkLevelUp(oldXP, newXP) {
  const oldLevel = calculateLevel(oldXP);
  const newLevel = calculateLevel(newXP);
  
  if (newLevel.level > oldLevel.level) {
    return {
      leveledUp: true,
      oldLevel: oldLevel.level,
      newLevel: newLevel.level,
      title: newLevel.title,
      reward: getLevelUpReward(newLevel.level)
    };
  }
  
  return { leveledUp: false };
}

/**
 * Get reward for leveling up
 */
export function getLevelUpReward(level) {
  const rewards = {
    2: { type: 'badge', name: 'First Steps', icon: '🌱' },
    3: { type: 'quote', name: 'Wisdom Unlocked', icon: '📜' },
    5: { type: 'badge', name: 'Integration Seeker', icon: '✨' },
    7: { type: 'theme', name: 'New Theme Unlocked', icon: '🎨' },
    10: { type: 'badge', name: 'Master of Remembrance', icon: '👑' }
  };
  
  return rewards[level] || { type: 'xp', name: 'XP Bonus', icon: '⭐' };
}

/**
 * Get achievement progress
 */
export function getAchievementProgress(userData, stats) {
  return {
    vows_created: {
      current: stats?.totalVows || 0,
      milestones: [1, 5, 10, 25, 50],
      title: 'Vow Creator'
    },
    reflections_logged: {
      current: stats?.totalReflections || 0,
      milestones: [7, 30, 90, 365],
      title: 'Daily Practitioner'
    },
    triggers_tracked: {
      current: stats?.triggersLogged || 0,
      milestones: [10, 50, 100, 250],
      title: 'Pattern Observer'
    },
    streak_days: {
      current: stats?.currentStreak || 0,
      milestones: [7, 30, 90, 365],
      title: 'Committed'
    }
  };
}

/**
 * Calculate daily XP cap
 */
export function getDailyXPCap(tier) {
  const caps = {
    trial: 100,
    initiation: 250,
    reflection: 500,
    liberation: 1000
  };
  
  return caps[tier] || caps.trial;
}

/**
 * Check if daily cap reached
 */
export function hasReachedDailyCap(userData, todayXP) {
  const cap = getDailyXPCap(userData.subscriptionTier);
  return todayXP >= cap;
}

/**
 * Get XP summary
 */
export function getXPSummary(userData, stats) {
  const totalXP = userData.totalXP || 0;
  const level = calculateLevel(totalXP);
  const nextLevel = getXPForNextLevel(totalXP);
  
  return {
    totalXP,
    level: level.level,
    title: level.title,
    nextLevel,
    todayXP: userData.todayXP || 0,
    dailyCap: getDailyXPCap(userData.subscriptionTier)
  };
}

/**
 * Format XP for display
 */
export function formatXP(xp) {
  if (xp >= 10000) return `${(xp / 1000).toFixed(1)}k`;
  return xp.toString();
}

/**
 * Get motivational message for XP gain
 */
export function getXPMessage(action, xpGained) {
  const messages = {
    create_vow: `+${xpGained} XP - Your vow is sealed`,
    daily_reflection: `+${xpGained} XP - Daily remembrance strengthens`,
    log_trigger: `+${xpGained} XP - Awareness is growth`,
    complete_week: `+${xpGained} XP - 7 days of commitment!`,
    complete_month: `+${xpGained} XP - 30 days strong!`,
    streak_milestone_7: `+${xpGained} XP - 7-day streak! 🔥`,
    streak_milestone_30: `+${xpGained} XP - 30-day streak! ⚡`,
    first_integration: `+${xpGained} XP - You're integrating`
  };
  
  return messages[action] || `+${xpGained} XP`;
}

/**
 * Get rank from level
 */
export function getRank(level) {
  if (level >= 10) return { name: 'Master', icon: '👑', color: '#FFD700' };
  if (level >= 7) return { name: 'Advanced', icon: '⭐', color: '#C0C0C0' };
  if (level >= 4) return { name: 'Intermediate', icon: '🌟', color: '#CD7F32' };
  return { name: 'Beginner', icon: '🌱', color: '#90EE90' };
}
