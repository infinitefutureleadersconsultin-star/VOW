/**
 * Personalized Welcome Videos
 * Each video explains: Vow Theory, App Usage, The Journey
 * Pre-recorded by demographics - no API cost
 */

export const VIDEO_LIBRARY = {
  'en-male-white': '/videos/welcome/en-male-white-theory.mp4',
  'en-male-black': '/videos/welcome/en-male-black-theory.mp4',
  'en-male-hispanic': '/videos/welcome/en-male-hispanic-theory.mp4',
  'en-male-asian': '/videos/welcome/en-male-asian-theory.mp4',
  'en-female-white': '/videos/welcome/en-female-white-theory.mp4',
  'en-female-black': '/videos/welcome/en-female-black-theory.mp4',
  'en-female-hispanic': '/videos/welcome/en-female-hispanic-theory.mp4',
  'en-female-asian': '/videos/welcome/en-female-asian-theory.mp4',
  'en-nonbinary-default': '/videos/welcome/en-nonbinary-theory.mp4',
  'es-male-hispanic': '/videos/welcome/es-male-hispanic-theory.mp4',
  'es-female-hispanic': '/videos/welcome/es-female-hispanic-theory.mp4',
  'fr-male-white': '/videos/welcome/fr-male-white-theory.mp4',
  'fr-female-white': '/videos/welcome/fr-female-white-theory.mp4',
  'pt-male-white': '/videos/welcome/pt-male-white-theory.mp4',
  'pt-female-white': '/videos/welcome/pt-female-white-theory.mp4',
  'default': '/videos/welcome/en-neutral-theory.mp4'
};

export const VIDEO_SCRIPT_SUMMARY = `
VIDEO CONTENT (7-10 minutes):

1. INTRODUCTION (1 min)
   "Welcome. I'm here to guide you through The Vow Theory and show you how this app becomes your companion in remembering who you truly are."

2. THE VOW THEORY EXPLAINED (3 min)
   - The Daily Law of Remembrance
   - You are not your addiction/trauma - they coexisted with you
   - Separation through awareness, not force
   - The 3 Principles: Pacification, Confrontation, Integration

3. HOW TO USE THE APP (3 min)
   - Daily Vow: Your anchor of remembrance
   - Reflections: Move through the 3 stages
   - Trigger Logging: See patterns without judgment
   - Progress tracking: Witness your natural separation

4. YOUR JOURNEY (1 min)
   - No guarantees, but a powerful tool
   - Used correctly = witness transformation
   - Daily remembrance creates permanent change
   - You're not alone - we're here every day

5. CLOSING
   "Let's begin. Click below to create your first vow."
`;

export function getWelcomeVideo(user) {
  const gender = user.gender || 'male';
  const ethnicity = user.ethnicity || 'white';
  const language = user.language || 'en';
  
  const key = `${language}-${gender}-${ethnicity}`;
  return VIDEO_LIBRARY[key] || VIDEO_LIBRARY['default'];
}

export function hasSeenWelcomeVideo(userId) {
  return localStorage.getItem(`welcome_video_${userId}`) === 'seen';
}

export function markVideoAsSeen(userId) {
  localStorage.setItem(`welcome_video_${userId}`, 'seen');
  localStorage.setItem(`welcome_video_date_${userId}`, new Date().toISOString());
}

export function canReplayVideo(userId) {
  // Allow replay after 7 days
  const lastSeen = localStorage.getItem(`welcome_video_date_${userId}`);
  if (!lastSeen) return true;
  const daysSince = (Date.now() - new Date(lastSeen)) / (1000 * 60 * 60 * 24);
  return daysSince >= 7;
}
