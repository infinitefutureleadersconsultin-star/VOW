/**
 * 10 Welcome Videos: 5 Languages × 2 Genders
 * Behavior personalization via TEXT (free)
 */

export const VIDEO_LIBRARY = {
  'en-male': '/videos/welcome/en-male.mp4',
  'en-female': '/videos/welcome/en-female.mp4',
  'es-male': '/videos/welcome/es-male.mp4',
  'es-female': '/videos/welcome/es-female.mp4',
  'hi-male': '/videos/welcome/hi-male.mp4',
  'hi-female': '/videos/welcome/hi-female.mp4',
  'zh-male': '/videos/welcome/zh-male.mp4',
  'zh-female': '/videos/welcome/zh-female.mp4',
  'fr-male': '/videos/welcome/fr-male.mp4',
  'fr-female': '/videos/welcome/fr-female.mp4',
  'default': '/videos/welcome/en-male.mp4'
};

export function getWelcomeVideo(user) {
  const lang = user?.language || 'en';
  const gender = user?.gender === 'female' ? 'female' : 'male'; // non-binary defaults to male
  
  const key = `${lang}-${gender}`;
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
  const lastSeen = localStorage.getItem(`welcome_video_date_${userId}`);
  if (!lastSeen) return true;
  const daysSince = (Date.now() - new Date(lastSeen)) / (1000 * 60 * 60 * 24);
  return daysSince >= 7;
}
