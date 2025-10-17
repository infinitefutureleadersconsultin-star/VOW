// Check if user has access to features
export function checkUserAccess(userData) {
  if (!userData) {
    return {
      hasAccess: false,
      reason: 'NO_USER',
      message: 'Please log in to continue',
    };
  }

  const { subscriptionStatus, trialEndDate } = userData;

  // Active paid subscription - full access
  if (subscriptionStatus === 'active') {
    return {
      hasAccess: true,
      isPaid: true,
    };
  }

  // Trial - check if expired
  if (subscriptionStatus === 'trial') {
    const trialEnd = new Date(trialEndDate);
    const now = new Date();
    
    if (now < trialEnd) {
      // Trial still active
      const daysLeft = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
      return {
        hasAccess: true,
        isTrial: true,
        daysLeft,
        trialEndDate,
      };
    } else {
      // Trial expired
      return {
        hasAccess: false,
        reason: 'TRIAL_EXPIRED',
        message: 'Your 2-day trial has ended. Upgrade to continue your journey.',
      };
    }
  }

  // Cancelled subscription
  if (subscriptionStatus === 'cancelled') {
    return {
      hasAccess: false,
      reason: 'SUBSCRIPTION_CANCELLED',
      message: 'Your subscription was cancelled. Reactivate to continue.',
    };
  }

  // Unknown status - deny access
  return {
    hasAccess: false,
    reason: 'UNKNOWN_STATUS',
    message: 'Please contact support.',
  };
}

// Get days remaining in trial
export function getTrialDaysRemaining(trialEndDate) {
  if (!trialEndDate) return 0;
  
  const trialEnd = new Date(trialEndDate);
  const now = new Date();
  const daysLeft = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
  
  return Math.max(0, daysLeft);
}

// Check if trial is active
export function isTrialActive(userData) {
  if (!userData || userData.subscriptionStatus !== 'trial') return false;
  
  const daysLeft = getTrialDaysRemaining(userData.trialEndDate);
  return daysLeft > 0;
}

// Check if user needs to upgrade
export function needsUpgrade(userData) {
  const access = checkUserAccess(userData);
  return !access.hasAccess;
}
