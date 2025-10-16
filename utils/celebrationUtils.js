import confetti from 'canvas-confetti';

// Track first-time feature usage
const MILESTONE_KEYS = {
  FIRST_VOW: 'milestone_first_vow',
  FIRST_REFLECTION: 'milestone_first_reflection',
  FIRST_TRIGGER: 'milestone_first_trigger',
  FIRST_LOGIN: 'milestone_first_login',
  VOW_COMPLETED: 'milestone_vow_completed',
};

// Check if milestone already celebrated
export const hasCelebrated = (milestoneKey) => {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(milestoneKey) === 'true';
};

// Mark milestone as celebrated
export const markCelebrated = (milestoneKey) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(milestoneKey, 'true');
};

// Confetti celebration
export const celebrate = (options = {}) => {
  const defaults = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#D97706', '#F59E0B', '#FBBF24', '#FCD34D'],
  };

  confetti({
    ...defaults,
    ...options,
  });

  // Second burst for extra effect
  setTimeout(() => {
    confetti({
      ...defaults,
      ...options,
      particleCount: 50,
    });
  }, 250);
};

// Milestone celebration with message
export const celebrateMilestone = (milestoneKey, message) => {
  if (hasCelebrated(milestoneKey)) return null;

  celebrate();
  markCelebrated(milestoneKey);

  return message;
};

export { MILESTONE_KEYS };
