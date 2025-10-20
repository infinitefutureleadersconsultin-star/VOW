/**
 * Streak Recovery & Grace Period System
 * Prevents streak loss from single missed days
 */

/**
 * Grace period settings by tier
 */
export const GRACE_PERIODS = {
  trial: 0,        // No grace for trial users
  initiation: 1,   // 1 day grace
  reflection: 2,   // 2 days grace
  liberation: 3    // 3 days grace
};

/**
 * Recovery token costs (in XP)
 */
export const RECOVERY_COSTS = {
  1: 100,  // First recovery: 100 XP
  2: 250,  // Second recovery: 250 XP
  3: 500,  // Third recovery: 500 XP
  4: 1000  // Fourth+ recovery: 1000 XP
};

/**
 * Check if user has grace period available
 */
export function hasGracePeriod(userData, missedDays) {
  const tier = userData.subscriptionTier || 'trial';
  const graceDays = GRACE_PERIODS[tier] || 0;
  
  return missedDays <= graceDays;
}

/**
 * Calculate streak with grace
 */
export function calculateStreakWithGrace(dates, userData) {
  if (!dates || dates.length === 0) return { streak: 0, graceUsed: 0 };
  
  const sortedDates = dates
    .map(d => new Date(d).toDateString())
    .sort((a, b) => new Date(b) - new Date(a));
  
  const tier = userData.subscriptionTier || 'trial';
  const maxGrace = GRACE_PERIODS[tier] || 0;
  
  let streak = 0;
  let graceUsed = 0;
  let currentDate = new Date();
  let consecutiveMisses = 0;
  
  for (let i = 0; i < 365; i++) {
    const dateStr = currentDate.toDateString();
    
    if (sortedDates.includes(dateStr)) {
      streak++;
      consecutiveMisses = 0;
    } else {
      consecutiveMisses++;
      
      if (consecutiveMisses <= maxGrace && graceUsed < maxGrace) {
        graceUsed++;
      } else {
        break; // Streak broken
      }
    }
    
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return { streak, graceUsed };
}

/**
 * Check if streak can be recovered
 */
export function canRecoverStreak(userData, daysMissed) {
  const tier = userData.subscriptionTier || 'trial';
  
  // Can't recover if more than 3 days missed
  if (daysMissed > 3) return false;
  
  // Trial users can't recover
  if (tier === 'trial') return false;
  
  // Check if user has recovery tokens available
  const tokensUsed = userData.recoveryTokensUsed || 0;
  const maxTokens = tier === 'liberation' ? 5 : 3;
  
  return tokensUsed < maxTokens;
}

/**
 * Get recovery cost
 */
export function getRecoveryCost(userData) {
  const tokensUsed = (userData.recoveryTokensUsed || 0) + 1;
  return RECOVERY_COSTS[tokensUsed] || RECOVERY_COSTS[4];
}

/**
 * Recover streak
 */
export function recoverStreak(userData, currentStreak) {
  const cost = getRecoveryCost(userData);
  const userXP = userData.totalXP || 0;
  
  if (userXP < cost) {
    return {
      success: false,
      error: 'Not enough XP',
      cost,
      currentXP: userXP
    };
  }
  
  return {
    success: true,
    newStreak: currentStreak,
    xpSpent: cost,
    newXP: userXP - cost,
    tokensUsed: (userData.recoveryTokensUsed || 0) + 1
  };
}

/**
 * Get grace period status
 */
export function getGraceStatus(userData, lastActivityDate) {
  const tier = userData.subscriptionTier || 'trial';
  const maxGrace = GRACE_PERIODS[tier] || 0;
  
  if (maxGrace === 0) {
    return {
      hasGrace: false,
      daysRemaining: 0,
      message: 'Upgrade to unlock grace periods'
    };
  }
  
  const lastActivity = new Date(lastActivityDate);
  const now = new Date();
  const daysSinceActivity = Math.floor((now - lastActivity) / (1000 * 60 * 60 * 24));
  const graceRemaining = Math.max(maxGrace - daysSinceActivity, 0);
  
  return {
    hasGrace: graceRemaining > 0,
    daysRemaining: graceRemaining,
    message: graceRemaining > 0 
      ? `${graceRemaining} grace ${graceRemaining === 1 ? 'day' : 'days'} remaining` 
      : 'Grace period expired'
  };
}

/**
 * Check if streak is at risk
 */
export function isStreakAtRisk(userData, lastActivityDate) {
  const lastActivity = new Date(lastActivityDate);
  const now = new Date();
  const hoursSinceActivity = (now - lastActivity) / (1000 * 60 * 60);
  
  // At risk if no activity for 18+ hours
  return hoursSinceActivity >= 18;
}

/**
 * Get streak protection notification
 */
export function getStreakProtectionMessage(userData, streak) {
  const tier = userData.subscriptionTier || 'trial';
  const graceDays = GRACE_PERIODS[tier] || 0;
  
  if (graceDays === 0) {
    return {
      title: 'Protect Your Streak',
      message: `Your ${streak}-day streak is valuable. Upgrade to unlock grace periods.`,
      action: 'Upgrade Now'
    };
  }
  
  return {
    title: 'Grace Period Active',
    message: `You have ${graceDays} ${graceDays === 1 ? 'day' : 'days'} of grace if you miss a day.`,
    action: null
  };
}

/**
 * Calculate streak value (for display)
 */
export function getStreakValue(streak) {
  if (streak >= 365) return { emoji: '🏆', label: 'Legendary', color: '#FFD700' };
  if (streak >= 90) return { emoji: '🔥', label: 'On Fire', color: '#FF4500' };
  if (streak >= 30) return { emoji: '⚡', label: 'Strong', color: '#FFA500' };
  if (streak >= 7) return { emoji: '✨', label: 'Building', color: '#C6A664' };
  return { emoji: '🌱', label: 'Starting', color: '#90EE90' };
}

/**
 * Get recovery tokens remaining
 */
export function getRecoveryTokensRemaining(userData) {
  const tier = userData.subscriptionTier || 'trial';
  const maxTokens = tier === 'liberation' ? 5 : 3;
  const used = userData.recoveryTokensUsed || 0;
  
  return Math.max(maxTokens - used, 0);
}

/**
 * Reset monthly recovery tokens
 */
export function shouldResetTokens(userData) {
  const lastReset = new Date(userData.lastTokenReset || userData.createdAt);
  const now = new Date();
  
  // Reset on 1st of each month
  return lastReset.getMonth() !== now.getMonth() || 
         lastReset.getFullYear() !== now.getFullYear();
}

/**
 * Get streak insights
 */
export function getStreakInsights(streak, graceDays) {
  const insights = [];
  
  if (streak === 0) {
    insights.push('Start your streak today by completing a reflection');
  }
  
  if (streak >= 7) {
    insights.push('You\'re building consistency - the foundation of change');
  }
  
  if (streak >= 30) {
    insights.push('30 days of remembrance - neural pathways are forming');
  }
  
  if (graceDays > 0 && streak > 7) {
    insights.push(`Your ${graceDays}-day grace period protects your progress`);
  }
  
  return insights;
}
