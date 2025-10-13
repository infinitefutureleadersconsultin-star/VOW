// utils/subscriptionTiers.js
// Progressive loyalty pricing aligned with VOW Theory stages

export const TIERS = {
  FOUNDATION: 'foundation',
  DEEPENING: 'deepening',
  MASTERY: 'mastery',
};

export const calculateTier = (subscriptionStartDate) => {
  const startDate = new Date(subscriptionStartDate);
  const now = new Date();
  const monthsActive = Math.floor((now - startDate) / (1000 * 60 * 60 * 24 * 30));
  
  if (monthsActive >= 6) {
    return {
      tier: TIERS.MASTERY,
      stage: 'Stage 4: Law of Daily Remembrance',
      priceId: process.env.STRIPE_PRICE_ID_EXECUTIVE,
      price: 14.99,
      monthsActive,
    };
  } else if (monthsActive >= 3) {
    return {
      tier: TIERS.DEEPENING,
      stage: 'Stage 3: Conscious Recall Therapy',
      priceId: process.env.STRIPE_PRICE_ID_PREMIUM,
      price: 9.99,
      monthsActive,
    };
  } else {
    return {
      tier: TIERS.FOUNDATION,
      stage: 'Stages 1-2: Confrontation & Awareness',
      priceId: process.env.STRIPE_PRICE_ID_MONTHLY,
      price: 4.99,
      monthsActive,
    };
  }
};

export const FEATURES = {
  DAILY_VOW_COMMITMENT: [TIERS.FOUNDATION, TIERS.DEEPENING, TIERS.MASTERY],
  REALITY_FACING_REFLECTIONS: [TIERS.FOUNDATION, TIERS.DEEPENING, TIERS.MASTERY],
  CONSCIOUS_TRIGGER_LOGGING: [TIERS.FOUNDATION, TIERS.DEEPENING, TIERS.MASTERY],
  BASIC_AI_GUIDANCE: [TIERS.FOUNDATION, TIERS.DEEPENING, TIERS.MASTERY],
  
  TRIGGER_FINGERPRINTING: [TIERS.DEEPENING, TIERS.MASTERY],
  PATTERN_RECOGNITION: [TIERS.DEEPENING, TIERS.MASTERY],
  MEMORY_BEHAVIOR_LINKING: [TIERS.DEEPENING, TIERS.MASTERY],
  IDENTITY_ALIGNMENT_TRACKING: [TIERS.DEEPENING, TIERS.MASTERY],
  
  EMBODIMENT_TRACKING: [TIERS.MASTERY],
  LIFETIME_MILESTONES: [TIERS.MASTERY],
  VOW_INTEGRATION_COMPLETE: [TIERS.MASTERY],
  PRIORITY_SUPPORT: [TIERS.MASTERY],
};

export const hasAccess = (userTier, feature) => {
  const allowedTiers = FEATURES[feature];
  if (!allowedTiers) return false;
  return allowedTiers.includes(userTier);
};

export const getDaysUntilNextTier = (subscriptionStartDate, currentTier) => {
  const startDate = new Date(subscriptionStartDate);
  const now = new Date();
  const daysActive = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
  
  if (currentTier === TIERS.FOUNDATION) {
    return Math.max(0, 90 - daysActive);
  } else if (currentTier === TIERS.DEEPENING) {
    return Math.max(0, 180 - daysActive);
  }
  return 0;
};
