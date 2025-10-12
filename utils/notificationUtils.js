// Notification utility for VOW app
// Handles push notifications, local notifications, and in-app toasts

const logNotificationError = (error, context) => {
  console.error('[NOTIFICATION_ERROR]', {
    timestamp: new Date().toISOString(),
    context,
    message: error.message,
    stack: error.stack,
  });
};

// Check notification permission
export const checkNotificationPermission = () => {
  try {
    if (!('Notification' in window)) {
      return { supported: false, permission: 'denied' };
    }
    
    return {
      supported: true,
      permission: Notification.permission,
    };
  } catch (error) {
    logNotificationError(error, 'CHECK_PERMISSION');
    return { supported: false, permission: 'denied', error: error.message };
  }
};

// Request notification permission
export const requestNotificationPermission = async () => {
  try {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported in this browser');
    }

    if (Notification.permission === 'granted') {
      return { success: true, permission: 'granted' };
    }

    if (Notification.permission === 'denied') {
      return {
        success: false,
        permission: 'denied',
        message: 'Notifications are blocked. Please enable them in browser settings.',
      };
    }

    const permission = await Notification.requestPermission();
    
    return {
      success: permission === 'granted',
      permission,
      message: permission === 'granted' 
        ? 'Notifications enabled' 
        : 'Notifications permission denied',
    };
  } catch (error) {
    logNotificationError(error, 'REQUEST_PERMISSION');
    return {
      success: false,
      error: error.message,
    };
  }
};

// Send local notification
export const sendLocalNotification = (title, options = {}) => {
  try {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return { success: false, error: 'Not supported' };
    }

    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return { success: false, error: 'Permission not granted' };
    }

    const defaultOptions = {
      icon: '/logo.png',
      badge: '/logo.png',
      vibrate: [200, 100, 200],
      tag: 'vow-notification',
      requireInteraction: false,
      ...options,
    };

    const notification = new Notification(title, defaultOptions);

    // Handle notification click
    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      notification.close();
      
      if (options.onClick) {
        options.onClick();
      }
    };

    return { success: true, notification };
  } catch (error) {
    logNotificationError(error, 'SEND_LOCAL_NOTIFICATION');
    return { success: false, error: error.message };
  }
};

// Notification templates (aligned with VOW philosophy)
export const NotificationTemplates = {
  // Trial reminders
  trialDay1: {
    title: 'Day 1 of Becoming',
    body: 'You\'ve begun your vow. Remember who you said you\'d be.',
    icon: '/logo.png',
  },
  
  trialDay2: {
    title: 'The Gate of Awareness',
    body: 'You\'ve reached Day 2. Your transformation has already begun.',
    icon: '/logo.png',
  },
  
  trialEnding: {
    title: 'Crossing the Third Gate',
    body: 'You\'ve completed the first 48 hours. Most people stop here. Will you continue?',
    icon: '/logo.png',
    requireInteraction: true,
  },

  // Daily vow reminders
  dailyVow: (vowText) => ({
    title: 'Remember Your Vow',
    body: vowText,
    icon: '/logo.png',
  }),

  // Trigger-based anticipatory notifications
  anticipatory: (context) => ({
    title: 'A Moment of Awareness',
    body: `You tend to notice urges around ${context.time}. A 5-minute grounding may help tonight.`,
    icon: '/logo.png',
  }),

  // Milestone celebrations
  milestone: (days) => ({
    title: 'You Are Not Who You Were',
    body: `${days} days of remembrance. You are becoming your vow.`,
    icon: '/logo.png',
  }),

  // Failure reflection
  breakReflection: {
    title: 'This Is Not Failure',
    body: 'A moment to reflect, not to shame. What can you learn?',
    icon: '/logo.png',
  },

  // Embodiment reminders
  embodiment: {
    title: 'You Are Your Promise',
    body: 'The vow is not something you keep. It is something you are.',
    icon: '/logo.png',
  },
};

// Schedule notification based on user patterns
export const scheduleNotification = async (template, scheduledTime) => {
  try {
    // For web, we use setTimeout for scheduling
    // For mobile apps, use native push notification scheduling
    
    const now = Date.now();
    const delay = scheduledTime - now;

    if (delay <= 0) {
      return sendLocalNotification(template.title, template);
    }

    setTimeout(() => {
      sendLocalNotification(template.title, template);
    }, delay);

    return {
      success: true,
      scheduledFor: new Date(scheduledTime).toISOString(),
    };
  } catch (error) {
    logNotificationError(error, 'SCHEDULE_NOTIFICATION');
    return { success: false, error: error.message };
  }
};

// Send push notification via API (for server-side triggers)
export const sendPushNotification = async (userId, template) => {
  try {
    const response = await fetch('/api/notifications/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('vow_auth_token')}`,
      },
      body: JSON.stringify({
        userId,
        notification: template,
      }),
    });

    if (!response.ok) {
      throw new Error(`Push notification failed: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    logNotificationError(error, 'SEND_PUSH_NOTIFICATION');
    return { success: false, error: error.message };
  }
};

// In-app toast notification (for UI feedback)
export const showToast = (message, type = 'info', duration = 3000) => {
  try {
    // Dispatch custom event that toast component will listen to
    const event = new CustomEvent('vow-toast', {
      detail: { message, type, duration },
    });
    
    window.dispatchEvent(event);
    
    return { success: true };
  } catch (error) {
    logNotificationError(error, 'SHOW_TOAST');
    console.error('Toast notification failed:', error);
    return { success: false, error: error.message };
  }
};

// Register service worker for push notifications
export const registerServiceWorker = async () => {
  try {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service workers not supported');
    }

    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered:', registration);
    
    return { success: true, registration };
  } catch (error) {
    logNotificationError(error, 'REGISTER_SERVICE_WORKER');
    return { success: false, error: error.message };
  }
};

// Get push subscription
export const getPushSubscription = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    return { success: true, subscription };
  } catch (error) {
    logNotificationError(error, 'GET_PUSH_SUBSCRIPTION');
    return { success: false, error: error.message };
  }
};

// Subscribe to push notifications
export const subscribeToPush = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });

    // Send subscription to server
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('vow_auth_token')}`,
      },
      body: JSON.stringify(subscription),
    });

    return { success: true, subscription };
  } catch (error) {
    logNotificationError(error, 'SUBSCRIBE_TO_PUSH');
    return { success: false, error: error.message };
  }
};

// Unsubscribe from push notifications
export const unsubscribeFromPush = async () => {
  try {
    const { subscription } = await getPushSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      
      // Remove subscription from server
      await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('vow_auth_token')}`,
        },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });
    }

    return { success: true };
  } catch (error) {
    logNotificationError(error, 'UNSUBSCRIBE_FROM_PUSH');
    return { success: false, error: error.message };
  }
};
