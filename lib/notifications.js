/**
 * Notification system
 * Handles push notifications, reminders, and scheduling
 */

/**
 * Notification types
 */
export const NOTIFICATION_TYPES = {
  MORNING_VOW: 'morning_vow',
  EVENING_REFLECTION: 'evening_reflection',
  STREAK_REMINDER: 'streak_reminder',
  GRACE_EXPIRING: 'grace_expiring',
  ACHIEVEMENT: 'achievement',
  LEVEL_UP: 'level_up',
  COMMUNITY: 'community'
};

/**
 * Default notification schedule
 */
export const DEFAULT_SCHEDULE = {
  morning: { hour: 8, minute: 0 },   // 8:00 AM
  evening: { hour: 20, minute: 0 }   // 8:00 PM
};

/**
 * Check if browser supports notifications
 */
export function isNotificationSupported() {
  if (typeof window === 'undefined') return false;
  return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Get notification permission status
 */
export function getNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission() {
  if (!isNotificationSupported()) {
    return { granted: false, reason: 'unsupported' };
  }
  
  if (Notification.permission === 'granted') {
    return { granted: true };
  }
  
  if (Notification.permission === 'denied') {
    return { granted: false, reason: 'denied' };
  }
  
  try {
    const permission = await Notification.requestPermission();
    return { granted: permission === 'granted' };
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return { granted: false, reason: 'error', error };
  }
}

/**
 * Show browser notification
 */
export function showNotification(title, options = {}) {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null;
  }
  
  const defaultOptions = {
    icon: '/icon.svg',
    badge: '/icon.svg',
    vibrate: [200, 100, 200],
    requireInteraction: false,
    ...options
  };
  
  try {
    return new Notification(title, defaultOptions);
  } catch (error) {
    console.error('Failed to show notification:', error);
    return null;
  }
}

/**
 * Schedule morning vow reminder
 */
export function scheduleMorningReminder(schedule = DEFAULT_SCHEDULE.morning) {
  const now = new Date();
  const scheduledTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    schedule.hour,
    schedule.minute
  );
  
  // If time has passed today, schedule for tomorrow
  if (scheduledTime < now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }
  
  const msUntilScheduled = scheduledTime - now;
  
  return setTimeout(() => {
    showNotification('Time to Create Your Vow', {
      body: 'Start your day with intention. What will you remember today?',
      tag: 'morning_vow',
      data: { type: NOTIFICATION_TYPES.MORNING_VOW }
    });
  }, msUntilScheduled);
}

/**
 * Schedule evening reflection reminder
 */
export function scheduleEveningReminder(schedule = DEFAULT_SCHEDULE.evening) {
  const now = new Date();
  const scheduledTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    schedule.hour,
    schedule.minute
  );
  
  // If time has passed today, schedule for tomorrow
  if (scheduledTime < now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }
  
  const msUntilScheduled = scheduledTime - now;
  
  return setTimeout(() => {
    showNotification('Evening Reflection', {
      body: 'How did your vow guide you today? Take a moment to reflect.',
      tag: 'evening_reflection',
      data: { type: NOTIFICATION_TYPES.EVENING_REFLECTION }
    });
  }, msUntilScheduled);
}

/**
 * Show streak reminder (18 hours after last activity)
 */
export function scheduleStreakReminder(lastActivityDate) {
  const lastActivity = new Date(lastActivityDate);
  const reminderTime = new Date(lastActivity.getTime() + (18 * 60 * 60 * 1000));
  const now = new Date();
  
  if (reminderTime < now) return null; // Too late
  
  const msUntilReminder = reminderTime - now;
  
  return setTimeout(() => {
    showNotification('Protect Your Streak! 🔥', {
      body: 'Don\'t break your momentum. Log a quick reflection to keep your streak alive.',
      tag: 'streak_reminder',
      data: { type: NOTIFICATION_TYPES.STREAK_REMINDER }
    });
  }, msUntilReminder);
}

/**
 * Show grace period expiring notification
 */
export function notifyGraceExpiring(daysRemaining) {
  showNotification('Grace Period Ending', {
    body: `You have ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} of grace left. Complete a reflection to protect your streak.`,
    tag: 'grace_expiring',
    data: { type: NOTIFICATION_TYPES.GRACE_EXPIRING }
  });
}

/**
 * Show achievement notification
 */
export function notifyAchievement(achievement) {
  showNotification(`Achievement Unlocked! ${achievement.icon}`, {
    body: achievement.description,
    tag: 'achievement',
    data: { type: NOTIFICATION_TYPES.ACHIEVEMENT, achievement }
  });
}

/**
 * Show level up notification
 */
export function notifyLevelUp(level, title) {
  showNotification(`Level ${level} Reached! 🎉`, {
    body: `You are now: ${title}`,
    tag: 'level_up',
    data: { type: NOTIFICATION_TYPES.LEVEL_UP, level, title }
  });
}

/**
 * Get notification preferences from localStorage
 */
export function getNotificationPreferences() {
  if (typeof window === 'undefined') return null;
  
  const prefs = localStorage.getItem('notification_prefs');
  return prefs ? JSON.parse(prefs) : {
    enabled: true,
    morning: true,
    evening: true,
    streak: true,
    achievements: true,
    schedule: DEFAULT_SCHEDULE
  };
}

/**
 * Save notification preferences
 */
export function saveNotificationPreferences(prefs) {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.setItem('notification_prefs', JSON.stringify(prefs));
    return true;
  } catch (error) {
    console.error('Failed to save notification preferences:', error);
    return false;
  }
}

/**
 * Initialize notification system
 */
export async function initializeNotifications() {
  const prefs = getNotificationPreferences();
  
  if (!prefs.enabled) {
    return { initialized: false, reason: 'disabled_by_user' };
  }
  
  const permissionResult = await requestNotificationPermission();
  
  if (!permissionResult.granted) {
    return { initialized: false, reason: permissionResult.reason };
  }
  
  // Schedule recurring notifications
  const timers = {};
  
  if (prefs.morning) {
    timers.morning = scheduleMorningReminder(prefs.schedule.morning);
  }
  
  if (prefs.evening) {
    timers.evening = scheduleEveningReminder(prefs.schedule.evening);
  }
  
  return { initialized: true, timers };
}

/**
 * Clear all scheduled notifications
 */
export function clearAllNotifications(timers) {
  if (timers) {
    Object.values(timers).forEach(timer => clearTimeout(timer));
  }
}

/**
 * Test notification (for settings page)
 */
export async function sendTestNotification() {
  const permissionResult = await requestNotificationPermission();
  
  if (!permissionResult.granted) {
    return { success: false, error: 'Permission not granted' };
  }
  
  showNotification('Test Notification', {
    body: 'Notifications are working! You\'ll receive reminders based on your preferences.',
    tag: 'test'
  });
  
  return { success: true };
}

/**
 * Get time until next notification
 */
export function getNextNotificationTime(prefs = null) {
  const schedule = prefs?.schedule || DEFAULT_SCHEDULE;
  const now = new Date();
  
  const morning = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 
    schedule.morning.hour, schedule.morning.minute);
  const evening = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 
    schedule.evening.hour, schedule.evening.minute);
  
  // Adjust for tomorrow if time has passed
  if (morning < now) morning.setDate(morning.getDate() + 1);
  if (evening < now) evening.setDate(evening.getDate() + 1);
  
  const nextMorning = morning - now;
  const nextEvening = evening - now;
  
  return {
    morning: { time: morning.toISOString(), msUntil: nextMorning },
    evening: { time: evening.toISOString(), msUntil: nextEvening },
    next: nextMorning < nextEvening ? 'morning' : 'evening'
  };
}
