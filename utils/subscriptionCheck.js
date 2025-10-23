/**
 * Check if user has active subscription or valid trial
 */
export function checkSubscriptionStatus(userData) {
  // 👑 ADMIN BYPASS - Full access, no restrictions
  if (userData?.email === 'issiahmclean1999@gmail.com') {
    return {
      hasAccess: true,
      isAdmin: true,
      reason: 'admin',
      shouldRedirect: null,
    };
  }

  // Active subscription
  if (userData?.subscriptionStatus === 'active') {
    return {
      hasAccess: true,
      reason: 'subscription',
      tier: userData.subscriptionTier,
      shouldRedirect: null,
    };
  }

  // Trial check
  if (userData?.trialStartDate) {
    const trialStart = new Date(userData.trialStartDate);
    const now = new Date();
    const daysSinceStart = Math.floor((now - trialStart) / (1000 * 60 * 60 * 24));
    const trialDaysRemaining = 3 - daysSinceStart;

    if (trialDaysRemaining > 0) {
      return {
        hasAccess: true,
        reason: 'trial',
        daysRemaining: trialDaysRemaining,
        shouldRedirect: null,
      };
    }

    // Trial expired
    return {
      hasAccess: false,
      reason: 'trial_expired',
      shouldRedirect: '/pricing',
    };
  }

  // No trial, no subscription
  return {
    hasAccess: false,
    reason: 'no_access',
    shouldRedirect: '/pricing',
  };
}

export function getTrialDaysRemaining(userData) {
  if (userData?.email === 'issiahmclean1999@gmail.com') {
    return 999; // Admin never expires
  }

  if (!userData?.trialStartDate) return 0;
  
  const trialStart = new Date(userData.trialStartDate);
  const now = new Date();
  const daysSinceStart = Math.floor((now - trialStart) / (1000 * 60 * 60 * 24));
  return Math.max(0, 3 - daysSinceStart);
}
