/**
 * Subscription Banner Component
 * Displays upgrade prompts and tier information
 */

import { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  TIERS, 
  getUserTier, 
  getTrialDaysRemaining, 
  isTrialExpired,
  hasActiveSubscription,
  getTierBadge 
} from '../lib/featureAccess';

export default function SubscriptionBanner({ userData, compact = false }) {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  
  const currentTier = getUserTier(userData);
  const isExpired = isTrialExpired(userData);
  const hasSubscription = hasActiveSubscription(userData);
  const trialDays = getTrialDaysRemaining(userData);
  
  // Don't show if dismissed or has active subscription
  if (dismissed || hasSubscription) return null;
  
  // Trial expired - show urgent message
  if (isExpired) {
    return (
      <div className="subscription-banner bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-4 rounded-lg mb-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">
              Trial Expired
            </h3>
            <p className="text-sm text-red-700 mt-1">
              Your free trial has ended. Upgrade to continue your healing journey.
            </p>
            <div className="mt-3 flex space-x-3">
              <button
                onClick={() => router.push('/pricing')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
              >
                View Plans
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Trial ending soon
  if (trialDays <= 1) {
    return (
      <div className="subscription-banner bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-500 p-4 rounded-lg mb-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl">⏰</span>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-amber-800">
              Trial Ending {trialDays === 0 ? 'Today' : 'Tomorrow'}
            </h3>
            <p className="text-sm text-amber-700 mt-1">
              Don't lose your progress. Upgrade now to continue your transformation.
            </p>
            <div className="mt-3 flex space-x-3">
              <button
                onClick={() => router.push('/pricing')}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
              >
                Upgrade Now
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="px-4 py-2 text-amber-700 text-sm font-medium hover:underline"
              >
                Remind Me Later
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Compact tier display
  if (compact) {
    const badge = getTierBadge(currentTier);
    return (
      <div className="subscription-compact flex items-center space-x-2 px-3 py-2 rounded-lg separation-card">
        <span className="text-xl">{badge.icon}</span>
        <span className="text-sm font-medium" style={{ color: badge.color }}>
          {TIERS[currentTier]?.name || 'Trial'}
        </span>
      </div>
    );
  }
  
  return null;
}

/**
 * Feature Locked Banner
 */
export function FeatureLockedBanner({ featureName, requiredTier, onUpgrade }) {
  const tierInfo = TIERS[requiredTier];
  const badge = getTierBadge(requiredTier);
  
  return (
    <div className="feature-locked-banner text-center p-8 rounded-xl separation-card">
      <div className="text-5xl mb-4">🔒</div>
      <h3 className="text-xl font-bold awareness-text mb-2">
        {featureName} is Locked
      </h3>
      <p className="observation-text mb-4">
        Upgrade to <span className="font-medium" style={{ color: badge.color }}>
          {tierInfo.name} {badge.icon}
        </span> to unlock this feature
      </p>
      <button
        onClick={onUpgrade}
        className="px-6 py-3 rounded-lg font-medium text-white"
        style={{ backgroundColor: badge.color }}
      >
        Upgrade to {tierInfo.name} - ${tierInfo.price}/mo
      </button>
    </div>
  );
}

/**
 * Tier Comparison Card
 */
export function TierCard({ tier, isCurrentTier = false, onSelect }) {
  const tierInfo = TIERS[tier];
  const badge = getTierBadge(tier);
  
  if (!tierInfo) return null;
  
  return (
    <div 
      className={`tier-card p-6 rounded-xl transition-all ${
        isCurrentTier ? 'ring-2' : 'separation-card'
      }`}
      style={{ 
        borderColor: isCurrentTier ? badge.color : 'transparent',
        borderWidth: isCurrentTier ? '2px' : '0'
      }}
    >
      <div className="text-center mb-4">
        <div className="text-4xl mb-2">{badge.icon}</div>
        <h3 className="text-xl font-bold awareness-text mb-1">
          {tierInfo.name}
        </h3>
        {tierInfo.price && (
          <div className="text-2xl font-bold" style={{ color: badge.color }}>
            ${tierInfo.price}
            <span className="text-sm observation-text">/month</span>
          </div>
        )}
      </div>
      
      <ul className="space-y-2 mb-6">
        {tierInfo.features.map((feature, index) => (
          <li key={index} className="flex items-start text-sm observation-text">
            <span className="mr-2">✓</span>
            <span>{formatFeatureName(feature)}</span>
          </li>
        ))}
      </ul>
      
      {!isCurrentTier && (
        <button
          onClick={() => onSelect(tier)}
          className="w-full py-3 rounded-lg font-medium transition-all"
          style={{ 
            backgroundColor: badge.color,
            color: 'white'
          }}
        >
          {tierInfo.price ? 'Upgrade' : 'Start Free Trial'}
        </button>
      )}
      
      {isCurrentTier && (
        <div className="text-center py-3 rounded-lg font-medium" 
             style={{ 
               backgroundColor: `${badge.color}20`,
               color: badge.color 
             }}>
          Current Plan
        </div>
      )}
    </div>
  );
}

/**
 * Trial Counter Widget
 */
export function TrialCounter({ userData }) {
  const trialDays = getTrialDaysRemaining(userData);
  
  if (!userData || trialDays <= 0 || hasActiveSubscription(userData)) {
    return null;
  }
  
  return (
    <div className="trial-counter inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800">
      <span className="text-sm">⏰</span>
      <span className="text-sm font-medium">
        {trialDays} {trialDays === 1 ? 'day' : 'days'} left in trial
      </span>
    </div>
  );
}

/**
 * Upgrade Success Modal
 */
export function UpgradeSuccessModal({ tier, onClose }) {
  const tierInfo = TIERS[tier];
  const badge = getTierBadge(tier);
  
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div 
        className="separation-card rounded-2xl p-8 text-center max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-6xl mb-4">{badge.icon}</div>
        <h2 className="text-2xl font-bold awareness-text mb-2">
          Welcome to {tierInfo.name}!
        </h2>
        <p className="observation-text mb-6">
          You now have access to all {tierInfo.name} features. Continue your transformation.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-3 rounded-lg font-medium text-white w-full"
          style={{ backgroundColor: badge.color }}
        >
          Start Exploring
        </button>
      </div>
    </div>
  );
}

/**
 * Helper function to format feature names
 */
function formatFeatureName(feature) {
  const names = {
    basic_vows: 'Up to 3 vows',
    unlimited_vows: 'Unlimited vows',
    daily_reflection: 'Daily reflections',
    trigger_logging: 'Trigger tracking',
    emotion_tracking: 'Emotion tracking',
    basic_analytics: 'Basic analytics',
    streak_tracking: 'Streak tracking',
    ai_insights: 'AI-powered insights',
    pattern_recognition: 'Pattern recognition',
    advanced_analytics: 'Advanced analytics',
    voice_journaling: 'Voice journaling',
    weekly_summaries: 'Weekly AI summaries',
    ai_mentor: 'AI mentor guidance',
    community_access: 'Community access',
    video_journaling: 'Video journaling',
    export_data: 'Export your data',
    priority_support: 'Priority support',
    all_initiation: 'All Initiation features',
    all_reflection: 'All Reflection features'
  };
  
  return names[feature] || feature.replace(/_/g, ' ');
}
