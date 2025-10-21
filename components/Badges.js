/**
 * Achievement Badges Component
 * Display and track user achievements
 */

import { useState, useEffect } from 'react';

/**
 * Badge definitions
 */
const BADGES = {
  first_vow: {
    id: 'first_vow',
    name: 'First Vow',
    description: 'Created your first vow',
    icon: '🌱',
    tier: 'bronze',
    requirement: { type: 'vows_created', value: 1 }
  },
  vow_master: {
    id: 'vow_master',
    name: 'Vow Master',
    description: 'Created 10 vows',
    icon: '📜',
    tier: 'silver',
    requirement: { type: 'vows_created', value: 10 }
  },
  first_week: {
    id: 'first_week',
    name: 'Seven Days',
    description: '7-day streak',
    icon: '🔥',
    tier: 'bronze',
    requirement: { type: 'streak', value: 7 }
  },
  month_strong: {
    id: 'month_strong',
    name: 'Month Strong',
    description: '30-day streak',
    icon: '⚡',
    tier: 'silver',
    requirement: { type: 'streak', value: 30 }
  },
  quarter_master: {
    id: 'quarter_master',
    name: 'Quarter Master',
    description: '90-day streak',
    icon: '💎',
    tier: 'gold',
    requirement: { type: 'streak', value: 90 }
  },
  year_liberated: {
    id: 'year_liberated',
    name: 'Year Liberated',
    description: '365-day streak',
    icon: '👑',
    tier: 'platinum',
    requirement: { type: 'streak', value: 365 }
  },
  reflective: {
    id: 'reflective',
    name: 'Reflective',
    description: '30 reflections logged',
    icon: '📝',
    tier: 'bronze',
    requirement: { type: 'reflections', value: 30 }
  },
  deep_diver: {
    id: 'deep_diver',
    name: 'Deep Diver',
    description: '100 reflections logged',
    icon: '🌊',
    tier: 'silver',
    requirement: { type: 'reflections', value: 100 }
  },
  observer: {
    id: 'observer',
    name: 'Observer',
    description: '10 triggers logged',
    icon: '👁️',
    tier: 'bronze',
    requirement: { type: 'triggers', value: 10 }
  },
  pattern_seeker: {
    id: 'pattern_seeker',
    name: 'Pattern Seeker',
    description: '50 triggers logged',
    icon: '🔍',
    tier: 'silver',
    requirement: { type: 'triggers', value: 50 }
  },
  integrated: {
    id: 'integrated',
    name: 'Integrated',
    description: 'Completed first vow',
    icon: '✨',
    tier: 'gold',
    requirement: { type: 'completed_vows', value: 1 }
  },
  liberation_path: {
    id: 'liberation_path',
    name: 'Liberation Path',
    description: 'Completed 5 vows',
    icon: '🦋',
    tier: 'platinum',
    requirement: { type: 'completed_vows', value: 5 }
  }
};

/**
 * Tier colors
 */
const TIER_COLORS = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2'
};

/**
 * Check if badge is earned
 */
function isBadgeEarned(badge, stats) {
  const req = badge.requirement;
  
  switch (req.type) {
    case 'vows_created':
      return (stats.totalVows || 0) >= req.value;
    case 'streak':
      return (stats.currentStreak || 0) >= req.value || (stats.longestStreak || 0) >= req.value;
    case 'reflections':
      return (stats.totalReflections || 0) >= req.value;
    case 'triggers':
      return (stats.triggersLogged || 0) >= req.value;
    case 'completed_vows':
      return (stats.completedVows || 0) >= req.value;
    default:
      return false;
  }
}

/**
 * Main Badges Component
 */
export default function Badges({ stats = {}, compact = false }) {
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [lockedBadges, setLockedBadges] = useState([]);

  useEffect(() => {
    const earned = [];
    const locked = [];
    
    Object.values(BADGES).forEach(badge => {
      if (isBadgeEarned(badge, stats)) {
        earned.push(badge);
      } else {
        locked.push(badge);
      }
    });
    
    setEarnedBadges(earned);
    setLockedBadges(locked);
  }, [stats]);

  if (compact) {
    return (
      <div className="badges-compact flex items-center space-x-2">
        {earnedBadges.slice(0, 5).map(badge => (
          <div 
            key={badge.id}
            className="badge-icon text-2xl"
            title={badge.name}
          >
            {badge.icon}
          </div>
        ))}
        {earnedBadges.length > 5 && (
          <div className="text-sm observation-text">
            +{earnedBadges.length - 5} more
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="badges-display">
      {/* Earned Badges */}
      <div className="earned-section mb-6">
        <h3 className="text-lg font-medium awareness-text mb-3">
          Achievements ({earnedBadges.length}/{Object.keys(BADGES).length})
        </h3>
        
        {earnedBadges.length === 0 ? (
          <div className="text-center p-6 separation-card rounded-xl">
            <div className="text-4xl mb-2">🎯</div>
            <p className="observation-text">
              Complete actions to earn your first badge
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {earnedBadges.map(badge => (
              <BadgeCard key={badge.id} badge={badge} earned={true} />
            ))}
          </div>
        )}
      </div>

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div className="locked-section">
          <h3 className="text-lg font-medium observation-text mb-3">
            Locked Achievements
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {lockedBadges.map(badge => (
              <BadgeCard key={badge.id} badge={badge} earned={false} stats={stats} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Individual Badge Card
 */
function BadgeCard({ badge, earned, stats = {} }) {
  const tierColor = TIER_COLORS[badge.tier];
  const progress = getBadgeProgress(badge, stats);
  
  return (
    <div 
      className={`badge-card p-4 rounded-xl text-center transition-all ${
        earned ? 'separation-card' : 'opacity-50'
      }`}
      style={{
        borderTop: earned ? `3px solid ${tierColor}` : 'none'
      }}
    >
      <div 
        className={`text-4xl mb-2 ${earned ? '' : 'grayscale'}`}
        style={{ filter: earned ? 'none' : 'grayscale(100%)' }}
      >
        {earned ? badge.icon : '🔒'}
      </div>
      
      <div className="font-medium awareness-text text-sm mb-1">
        {badge.name}
      </div>
      
      <div className="text-xs observation-text mb-2">
        {badge.description}
      </div>
      
      {!earned && progress && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="h-full rounded-full transition-all"
              style={{
                width: `${progress.percentage}%`,
                backgroundColor: tierColor
              }}
            />
          </div>
          <div className="text-xs observation-text mt-1">
            {progress.current}/{progress.required}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Get progress towards badge
 */
function getBadgeProgress(badge, stats) {
  const req = badge.requirement;
  let current = 0;
  
  switch (req.type) {
    case 'vows_created':
      current = stats.totalVows || 0;
      break;
    case 'streak':
      current = Math.max(stats.currentStreak || 0, stats.longestStreak || 0);
      break;
    case 'reflections':
      current = stats.totalReflections || 0;
      break;
    case 'triggers':
      current = stats.triggersLogged || 0;
      break;
    case 'completed_vows':
      current = stats.completedVows || 0;
      break;
  }
  
  return {
    current: Math.min(current, req.value),
    required: req.value,
    percentage: Math.round((current / req.value) * 100)
  };
}

/**
 * Badge notification (for when earned)
 */
export function BadgeNotification({ badge, onClose }) {
  const tierColor = TIER_COLORS[badge.tier];
  
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div 
        className="separation-card bg-[#1A1C1F] border border-[#E3C27D]/20 rounded-2xl p-8 text-center max-w-sm animate-bounce"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-6xl mb-4">{badge.icon}</div>
        <h2 className="text-2xl font-bold awareness-text mb-2">
          Achievement Unlocked!
        </h2>
        <div 
          className="text-lg font-medium mb-2"
          style={{ color: tierColor }}
        >
          {badge.name}
        </div>
        <p className="observation-text mb-6">
          {badge.description}
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-lg font-medium"
          style={{ 
            backgroundColor: tierColor,
            color: 'white'
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

/**
 * Export badge definitions for use in other files
 */
export { BADGES, isBadgeEarned };
