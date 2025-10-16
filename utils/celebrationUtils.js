import confetti from 'canvas-confetti';

export const MILESTONE_KEYS = {
  FIRST_VOW: 'milestone_first_vow',
  FIRST_REFLECTION: 'milestone_first_reflection',
  FIRST_TRIGGER: 'milestone_first_trigger',
};

export const hasCelebrated = (key) => {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(key) === 'true';
};

export const markCelebrated = (key) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, 'true');
};

export const celebrate = () => {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#D97706', '#F59E0B', '#FBBF24'],
  });
  
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 },
    });
  }, 250);
};

export const celebrateMilestone = (key, message) => {
  if (hasCelebrated(key)) return null;
  celebrate();
  markCelebrated(key);
  return message;
};
