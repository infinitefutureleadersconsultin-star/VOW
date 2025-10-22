/**
 * Subscription Status Checker
 * Single source of truth for trial/subscription logic
 */

export function checkSubscriptionStatus(userData) {
  if (!userData) {
    return {
      hasAccess: false,
      status: 'no_user',
      message: 'User data not found',
      shouldRedirect: '/login'
    };
  }

  const now = new Date();
  const trialEnd = userData.trialEndDate ? new Date(userData.trialEndDate) : null;
  const subscriptionStatus = userData.subscriptionStatus || 'trial';

  // Active paid subscription
  if (subscriptionStatus === 'active') {
    return {
      hasAccess: true,
      status: 'active',
      message: 'Active subscription',
      shouldRedirect: null
    };
  }

  // Trial period (still active)
  if (trialEnd && now <= trialEnd) {
    return {
      hasAccess: true,
      status: 'active_trial',
      message: 'Free trial active',
      trialDaysLeft: Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24)),
      shouldRedirect: null
    };
  }

  // Trial expired, no subscription
  return {
    hasAccess: false,
    status: 'expired_trial',
    message: 'Your free trial has ended. Please upgrade to continue.',
    shouldRedirect: '/pricing'
  };
}

export function getUserAccessLevel(userData) {
  const check = checkSubscriptionStatus(userData);
  return check.hasAccess ? 'full' : 'none';
}
