/**
 * Feature Access Control
 * Gates features based on subscription tier
 */

/**
 * Subscription tiers and their features
 */
export const TIERS = {
  trial: {
    name: 'Trial',
    days: 2,
    features: [
      'basic_vows',
      'daily_reflection',
      'trigger_logging',
      'basic_dashboard'
    ]
  },
  initiation: {
    name: 'Initiation',
    price: 4.99,
    features: [
      'unlimited_vows',
      'daily_reflection',
      'trigger_logging',
      'emotion_tracking',
      'basic_analytics',
      'streak_tracking'
    ]
  },
  reflection: {
    name: 'Reflection',
    price: 9.99,
    features: [
      'all_initiation',
      'ai_insights',
      'pattern_recognition',
      'advanced_analytics',
      'voice_journaling',
      'weekly_summaries'
    ]
  },
  liberation: {
    name: 'Liberation',
    price: 14.99,
    features: [
      'all_reflection',
      'ai_mentor',
      'community_access',
      'video_journaling',
      'export_data',
      'priority_support'
    ]
  }
};

/**
 * Feature definitions
 */
export const FEATURES = {
  // Basic features (Trial)
  basic_vows: { name: 'Create Vows', minTier: 'trial', limit: 3 },
  daily_reflection: { name: 'Daily Reflection', minTier: 'trial' },
  trigger_logging: { name: 'Log Triggers', minTier: 'trial', limit: 10 },
  basic_dashboard: { name: 'Dashboard', minTier: 'trial' },
  
  // Initiation features
  unlimited_vows: { name: 'Unlimited Vows', minTier: 'initiation' },
  emotion_tracking: { name: 'Emotion Tracking', minTier: 'initiation' },
  basic_analytics: { name: 'Basic Analytics', minTier: 'initiation' },
  streak_tracking: { name: 'Streak Tracking', minTier: 'initiation' },
  
  // Reflection features
  ai_insights: { name: 'AI Insights', minTier: 'reflection' },
  pattern_recognition: { name: 'Pattern Recognition', minTier: 'reflection' },
  advanced_analytics: { name: 'Advanced Analytics', minTier: 'reflection' },
  voice_journaling: { name: 'Voice Journaling', minTier: 'reflection' },
  weekly_summaries: { name: 'Weekly Summaries', minTier: 'reflection' },
  
  // Liberation features
  ai_mentor: { name: 'AI Mentor', minTier: 'liberation' },
  community_access: { name: 'Community Access', minTier: 'liberation' },
  video_journaling: { name: 'Video Journaling', minTier: 'liberation' },
  export_data: { name: 'Export Data', minTier: 'liberation' },
  priority_support: { name: 'Priority Support', minTier: 'liberation' }
};

/**
 * Check if user has access to feature
 */
export function hasFeatureAccess(userTier, featureKey) {
  const feature = FEATURES[featureKey];
  if (!feature) return false;
  
  const tierOrder = ['trial', 'initiation', 'reflection', 'liberation'];
  const userTierIndex = tierOrder.indexOf(userTier);
  const requiredTierIndex = tierOrder.indexOf(feature.minTier);
  
  return userTierIndex >= requiredTierIndex;
}

/**
 * Check if user is on trial
 */
export function isOnTrial(userData) {
  return userData?.subscriptionTier === 'trial' || 
         userData?.subscriptionStatus === 'trial';
}

/**
 * Check if trial is expired
 */
export function isTrialExpired(userData) {
  if (!isOnTrial(userData)) return false;
  
  const createdAt = new Date(userData.createdAt);
  const now = new Date();
  const daysSinceCreation = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
  
  return daysSinceCreation > 2;
}

/**
 * Get days remaining in trial
 */
export function getTrialDaysRemaining(userData) {
  if (!isOnTrial(userData)) return 0;
  
  const createdAt = new Date(userData.createdAt);
  const now = new Date();
  const daysSinceCreation = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
  
  return Math.max(2 - daysSinceCreation, 0);
}

/**
 * Check if user has active subscription
 */
export function hasActiveSubscription(userData) {
  return userData?.subscriptionStatus === 'active' &&
         userData?.subscriptionTier !== 'trial';
}

/**
 * Get user's current tier
 */
export function getUserTier(userData) {
  if (!userData) return 'trial';
  
  if (isTrialExpired(userData) && !hasActiveSubscription(userData)) {
    return null; // Expired, needs upgrade
  }
  
  return userData.subscriptionTier || 'trial';
}

/**
 * Get features available to user
 */
export function getAvailableFeatures(userData) {
  const tier = getUserTier(userData);
  if (!tier) return [];
  
  return Object.keys(FEATURES).filter(key => 
    hasFeatureAccess(tier, key)
  );
}

/**
 * Get locked features for user
 */
export function getLockedFeatures(userData) {
  const tier = getUserTier(userData);
  if (!tier) return Object.keys(FEATURES);
  
  return Object.keys(FEATURES).filter(key => 
    !hasFeatureAccess(tier, key)
  );
}

/**
 * Get upgrade CTA message
 */
export function getUpgradeMessage(featureKey) {
  const feature = FEATURES[featureKey];
  if (!feature) return 'Upgrade to unlock this feature';
  
  const tierName = TIERS[feature.minTier]?.name;
  return `Upgrade to ${tierName} to unlock ${feature.name}`;
}

/**
 * Get feature usage limit
 */
export function getFeatureLimit(userTier, featureKey) {
  const feature = FEATURES[featureKey];
  if (!feature || !feature.limit) return null;
  
  if (!hasFeatureAccess(userTier, featureKey)) return 0;
  
  return feature.limit;
}

/**
 * Check if feature usage is within limit
 */
export function isWithinLimit(userTier, featureKey, currentUsage) {
  const limit = getFeatureLimit(userTier, featureKey);
  if (limit === null) return true; // No limit
  
  return currentUsage < limit;
}

/**
 * Get tier comparison
 */
export function getTierComparison(currentTier, targetTier) {
  const current = TIERS[currentTier];
  const target = TIERS[targetTier];
  
  if (!current || !target) return null;
  
  const newFeatures = target.features.filter(f => 
    !current.features.includes(f) && f !== 'all_initiation' && f !== 'all_reflection'
  );
  
  return {
    currentTier: current.name,
    targetTier: target.name,
    price: target.price,
    newFeatures: newFeatures.map(f => FEATURES[f]?.name).filter(Boolean)
  };
}

/**
 * Check if user needs upgrade prompt
 */
export function shouldShowUpgradePrompt(userData) {
  if (hasActiveSubscription(userData)) return false;
  if (isTrialExpired(userData)) return true;
  
  // Show on last day of trial
  const daysRemaining = getTrialDaysRemaining(userData);
  return daysRemaining <= 1;
}

/**
 * Get tier badge
 */
export function getTierBadge(tier) {
  const badges = {
    trial: { icon: '🌱', color: '#90EE90' },
    initiation: { icon: '🔑', color: '#C6A664' },
    reflection: { icon: '💎', color: '#4169E1' },
    liberation: { icon: '👑', color: '#FFD700' }
  };
  
  return badges[tier] || badges.trial;
}
