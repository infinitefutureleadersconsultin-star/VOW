/**
 * Analytics system
 * Track user events and engagement metrics
 */

/**
 * Event types
 */
export const EVENTS = {
  // Authentication
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  
  // Vow events
  VOW_CREATED: 'vow_created',
  VOW_UPDATED: 'vow_updated',
  VOW_COMPLETED: 'vow_completed',
  VOW_BROKEN: 'vow_broken',
  
  // Reflection events
  REFLECTION_CREATED: 'reflection_created',
  REFLECTION_STAGE_CHANGED: 'reflection_stage_changed',
  
  // Trigger events
  TRIGGER_LOGGED: 'trigger_logged',
  
  // Engagement
  STREAK_MILESTONE: 'streak_milestone',
  LEVEL_UP: 'level_up',
  BADGE_EARNED: 'badge_earned',
  
  // Subscription
  TRIAL_STARTED: 'trial_started',
  TRIAL_ENDING: 'trial_ending',
  SUBSCRIPTION_STARTED: 'subscription_started',
  SUBSCRIPTION_UPGRADED: 'subscription_upgraded',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  
  // Feature usage
  FEATURE_ACCESSED: 'feature_accessed',
  FEATURE_LOCKED: 'feature_locked',
  
  // Navigation
  PAGE_VIEW: 'page_view',
  BUTTON_CLICK: 'button_click',
  
  // Errors
  ERROR_OCCURRED: 'error_occurred'
};

/**
 * Track event
 */
export function trackEvent(eventName, properties = {}) {
  try {
    const eventData = {
      event: eventName,
      timestamp: new Date().toISOString(),
      properties: {
        ...properties,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
        url: typeof window !== 'undefined' ? window.location.href : null,
        referrer: typeof document !== 'undefined' ? document.referrer : null
      }
    };
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', eventData);
    }
    
    // Send to analytics service (Google Analytics, Mixpanel, etc.)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, properties);
    }
    
    // Store in localStorage for offline tracking
    storeOfflineEvent(eventData);
    
    return true;
  } catch (error) {
    console.error('Failed to track event:', error);
    return false;
  }
}

/**
 * Store event offline for later sync
 */
function storeOfflineEvent(eventData) {
  try {
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem('analytics_queue');
    const queue = stored ? JSON.parse(stored) : [];
    
    queue.push(eventData);
    
    // Keep only last 100 events
    if (queue.length > 100) {
      queue.shift();
    }
    
    localStorage.setItem('analytics_queue', JSON.stringify(queue));
  } catch (error) {
    console.error('Failed to store offline event:', error);
  }
}

/**
 * Track page view
 */
export function trackPageView(pageName, properties = {}) {
  return trackEvent(EVENTS.PAGE_VIEW, {
    page: pageName,
    ...properties
  });
}

/**
 * Track button click
 */
export function trackButtonClick(buttonName, properties = {}) {
  return trackEvent(EVENTS.BUTTON_CLICK, {
    button: buttonName,
    ...properties
  });
}

/**
 * Track vow creation
 */
export function trackVowCreated(vow) {
  return trackEvent(EVENTS.VOW_CREATED, {
    category: vow.category,
    duration: vow.duration,
    hasWhyMatters: !!vow.whyMatters
  });
}

/**
 * Track reflection
 */
export function trackReflection(reflection) {
  return trackEvent(EVENTS.REFLECTION_CREATED, {
    stage: reflection.stage,
    emotion: reflection.emotion,
    wordCount: reflection.text?.split(' ').length || 0
  });
}

/**
 * Track trigger
 */
export function trackTrigger(trigger) {
  return trackEvent(EVENTS.TRIGGER_LOGGED, {
    hasDescription: !!trigger.description,
    intensity: trigger.intensity
  });
}

/**
 * Track streak milestone
 */
export function trackStreakMilestone(days) {
  return trackEvent(EVENTS.STREAK_MILESTONE, {
    days,
    milestone: getMilestone(days)
  });
}

/**
 * Track level up
 */
export function trackLevelUp(level, title) {
  return trackEvent(EVENTS.LEVEL_UP, {
    level,
    title
  });
}

/**
 * Track badge earned
 */
export function trackBadgeEarned(badge) {
  return trackEvent(EVENTS.BADGE_EARNED, {
    badgeId: badge.id,
    badgeName: badge.name,
    tier: badge.tier
  });
}

/**
 * Track subscription event
 */
export function trackSubscription(eventType, tier, properties = {}) {
  return trackEvent(eventType, {
    tier,
    ...properties
  });
}

/**
 * Track feature access
 */
export function trackFeatureAccess(featureName, hasAccess) {
  return trackEvent(
    hasAccess ? EVENTS.FEATURE_ACCESSED : EVENTS.FEATURE_LOCKED,
    {
      feature: featureName,
      hasAccess
    }
  );
}

/**
 * Track error
 */
export function trackError(error, context = {}) {
  return trackEvent(EVENTS.ERROR_OCCURRED, {
    errorMessage: error.message,
    errorStack: error.stack,
    ...context
  });
}

/**
 * Get milestone name
 */
function getMilestone(days) {
  if (days >= 365) return 'year';
  if (days >= 90) return 'quarter';
  if (days >= 30) return 'month';
  if (days >= 7) return 'week';
  return 'day';
}

/**
 * Initialize analytics
 */
export function initializeAnalytics(userId = null) {
  try {
    // Set user ID if provided
    if (userId && typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        user_id: userId
      });
    }
    
    // Track initial page view
    if (typeof window !== 'undefined') {
      trackPageView(window.location.pathname);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to initialize analytics:', error);
    return false;
  }
}

/**
 * Flush offline events
 */
export async function flushOfflineEvents() {
  try {
    if (typeof window === 'undefined') return { success: false };
    
    const stored = localStorage.getItem('analytics_queue');
    if (!stored) return { success: true, count: 0 };
    
    const queue = JSON.parse(stored);
    
    // Send to analytics endpoint
    if (queue.length > 0) {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: queue })
      });
      
      // Clear queue after successful send
      localStorage.removeItem('analytics_queue');
    }
    
    return { success: true, count: queue.length };
  } catch (error) {
    console.error('Failed to flush offline events:', error);
    return { success: false, error };
  }
}

/**
 * Get user engagement metrics
 */
export function getEngagementMetrics() {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('analytics_queue');
  const events = stored ? JSON.parse(stored) : [];
  
  const metrics = {
    totalEvents: events.length,
    eventTypes: {},
    lastActivity: events[events.length - 1]?.timestamp || null
  };
  
  events.forEach(event => {
    metrics.eventTypes[event.event] = (metrics.eventTypes[event.event] || 0) + 1;
  });
  
  return metrics;
}

/**
 * Track time on page
 */
export function trackTimeOnPage() {
  if (typeof window === 'undefined') return;
  
  const startTime = Date.now();
  
  const handleUnload = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000); // seconds
    trackEvent('time_on_page', {
      page: window.location.pathname,
      seconds: timeSpent
    });
  };
  
  window.addEventListener('beforeunload', handleUnload);
  
  return () => window.removeEventListener('beforeunload', handleUnload);
}

/**
 * Track scroll depth
 */
export function trackScrollDepth() {
  if (typeof window === 'undefined') return;
  
  let maxScroll = 0;
  
  const handleScroll = () => {
    const scrollPercentage = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    
    if (scrollPercentage > maxScroll) {
      maxScroll = scrollPercentage;
    }
  };
  
  const handleUnload = () => {
    trackEvent('scroll_depth', {
      page: window.location.pathname,
      maxDepth: maxScroll
    });
  };
  
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('beforeunload', handleUnload);
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('beforeunload', handleUnload);
  };
}

/**
 * Create conversion funnel tracker
 */
export function createFunnelTracker(funnelName, steps) {
  const completedSteps = new Set();
  
  return {
    trackStep: (stepName) => {
      if (!steps.includes(stepName)) return;
      
      completedSteps.add(stepName);
      
      trackEvent('funnel_step', {
        funnel: funnelName,
        step: stepName,
        stepNumber: steps.indexOf(stepName) + 1,
        totalSteps: steps.length
      });
    },
    
    trackComplete: () => {
      trackEvent('funnel_complete', {
        funnel: funnelName,
        stepsCompleted: completedSteps.size,
        totalSteps: steps.length
      });
    }
  };
}
