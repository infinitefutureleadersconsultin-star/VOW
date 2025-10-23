/**
 * Check if user has access to premium features
 */
export function checkUserAccess(userData) {
  // 👑 ADMIN BYPASS - Full access to everything
  if (userData?.email === 'issiahmclean1999@gmail.com') {
    return {
      hasAccess: true,
      isAdmin: true,
      isPremium: true,
      tier: 'master',
      reason: 'admin',
    };
  }

  // Active paid subscription
  if (userData?.subscriptionStatus === 'active') {
    return {
      hasAccess: true,
      isPremium: true,
      tier: userData.subscriptionTier || 'seeker',
      reason: 'subscription',
    };
  }

  // Active trial
  if (userData?.trialStartDate) {
    const trialStart = new Date(userData.trialStartDate);
    const now = new Date();
    const daysSinceStart = Math.floor((now - trialStart) / (1000 * 60 * 60 * 24));
    const daysRemaining = 3 - daysSinceStart;

    if (daysRemaining > 0) {
      return {
        hasAccess: true,
        isPremium: false,
        tier: 'trial',
        daysRemaining,
        reason: 'trial',
      };
    }
  }

  // No access
  return {
    hasAccess: false,
    isPremium: false,
    tier: null,
    reason: 'no_subscription',
  };
}

export function canAccessFeature(userData, featureTier = 'seeker') {
  // Admin can access everything
  if (userData?.email === 'issiahmclean1999@gmail.com') {
    return true;
  }

  const access = checkUserAccess(userData);
  
  if (!access.hasAccess) return false;
  if (access.tier === 'trial') return true;
  
  const tierLevels = {
    seeker: 1,
    explorer: 2,
    master: 3,
  };
  
  return tierLevels[access.tier] >= tierLevels[featureTier];
}
