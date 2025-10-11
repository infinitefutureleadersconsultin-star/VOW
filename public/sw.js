// public/sw.js
// Service Worker for Push Notifications & Progressive Web App Features
// Handles background notifications, offline caching, and notification actions

const CACHE_NAME = 'vow-app-v1';
const STATIC_CACHE = [
  '/',
  '/login',
  '/signup',
  '/dashboard',
  '/styles/globals.css',
];

// ============================================
// SERVICE WORKER INSTALLATION
// ============================================

self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching static assets');
        return cache.addAll(STATIC_CACHE);
      })
      .then(() => {
        console.log('[ServiceWorker] Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[ServiceWorker] Installation failed:', error);
      })
  );
});

// ============================================
// SERVICE WORKER ACTIVATION
// ============================================

self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[ServiceWorker] Activation complete');
        return self.clients.claim();
      })
  );
});

// ============================================
// FETCH HANDLER (Network-First Strategy)
// ============================================

self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response before caching
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });
        
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Return offline page or default response
            return new Response(
              '<html><body><h1>Offline</h1><p>VOW requires an internet connection.</p></body></html>',
              { headers: { 'Content-Type': 'text/html' } }
            );
          });
      })
  );
});

// ============================================
// PUSH NOTIFICATION HANDLER
// ============================================

self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push notification received');
  
  let notificationData = {
    title: 'VOW Reminder',
    body: 'Remember who you said you\'d be.',
    icon: '/logo.png',
    badge: '/badge.png',
    tag: 'vow-reminder',
    requireInteraction: false,
    data: {
      url: '/dashboard',
      timestamp: Date.now(),
    },
  };

  // Parse push data if available
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = {
        ...notificationData,
        ...pushData,
      };
    } catch (error) {
      console.error('[ServiceWorker] Failed to parse push data:', error);
    }
  }

  // Customize notification based on type
  if (notificationData.type) {
    notificationData = customizeNotification(notificationData);
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      data: notificationData.data,
      actions: notificationData.actions || [],
      vibrate: notificationData.vibrate || [200, 100, 200],
    })
  );
});

// ============================================
// NOTIFICATION CUSTOMIZATION
// ============================================

function customizeNotification(data) {
  const customizations = {
    // Anticipatory trigger notifications
    trigger_alert: {
      title: '🌊 Gentle Reminder',
      body: data.body || 'You tend to notice urges around this time. Take a breath.',
      icon: '/icons/wave.png',
      requireInteraction: true,
      actions: [
        { action: 'acknowledge', title: 'I\'m aware', icon: '/icons/check.png' },
        { action: 'log', title: 'Log urge', icon: '/icons/pen.png' },
      ],
      data: {
        ...data.data,
        type: 'trigger_alert',
      },
    },

    // Daily vow reminder
    daily_vow: {
      title: '📿 Daily Remembrance',
      body: data.body || 'Your vow is waiting. Take a moment to honor it.',
      icon: '/icons/lotus.png',
      actions: [
        { action: 'read_vow', title: 'Read my vow', icon: '/icons/book.png' },
        { action: 'dismiss', title: 'Later', icon: '/icons/clock.png' },
      ],
      data: {
        ...data.data,
        type: 'daily_vow',
        url: '/dashboard?action=read_vow',
      },
    },

    // Milestone celebration
    milestone: {
      title: '🎉 Milestone Reached',
      body: data.body || 'You\'ve honored your vow for [X] days. Keep remembering.',
      icon: '/icons/trophy.png',
      requireInteraction: true,
      actions: [
        { action: 'celebrate', title: 'View progress', icon: '/icons/chart.png' },
      ],
      data: {
        ...data.data,
        type: 'milestone',
        url: '/dashboard?action=view_progress',
      },
    },

    // Compassionate check-in after failure
    gentle_checkin: {
      title: '🤲 You\'re Not Alone',
      body: data.body || 'Slip-ups are part of the journey. Let\'s reflect together.',
      icon: '/icons/heart.png',
      requireInteraction: true,
      actions: [
        { action: 'reflect', title: 'Reflect', icon: '/icons/mirror.png' },
        { action: 'renew', title: 'Renew vow', icon: '/icons/refresh.png' },
      ],
      data: {
        ...data.data,
        type: 'gentle_checkin',
        url: '/dashboard?action=reflect',
      },
    },

    // Trial ending reminder
    trial_ending: {
      title: '⏰ Your Journey Continues',
      body: data.body || 'Day 2 of becoming. Choose to continue tomorrow.',
      icon: '/icons/sunrise.png',
      requireInteraction: true,
      actions: [
        { action: 'continue', title: 'Continue journey', icon: '/icons/forward.png' },
      ],
      data: {
        ...data.data,
        type: 'trial_ending',
        url: '/dashboard?action=subscribe',
      },
    },

    // Default generic notification
    default: {
      title: data.title || 'VOW',
      body: data.body || 'Remember your promise.',
      icon: data.icon || '/logo.png',
      data: data.data || { url: '/dashboard' },
    },
  };

  return customizations[data.type] || customizations.default;
}

// ============================================
// NOTIFICATION CLICK HANDLER
// ============================================

self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification clicked:', event.action);
  
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/dashboard';
  const actionParam = event.action ? `?action=${event.action}` : '';
  const fullUrl = new URL(urlToOpen + actionParam, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if a window is already open
        for (const client of clientList) {
          if (client.url === fullUrl && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window if none exists
        if (clients.openWindow) {
          return clients.openWindow(fullUrl);
        }
      })
      .then(() => {
        // Log analytics (send to backend)
        return fetch('/api/analytics/notification-interaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: event.action || 'open',
            type: event.notification.data?.type || 'unknown',
            timestamp: Date.now(),
          }),
        }).catch((error) => {
          console.error('[ServiceWorker] Analytics logging failed:', error);
        });
      })
  );
});

// ============================================
// NOTIFICATION CLOSE HANDLER
// ============================================

self.addEventListener('notificationclose', (event) => {
  console.log('[ServiceWorker] Notification closed:', event.notification.tag);
  
  // Log dismissal (optional analytics)
  event.waitUntil(
    fetch('/api/analytics/notification-dismissed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tag: event.notification.tag,
        type: event.notification.data?.type || 'unknown',
        timestamp: Date.now(),
      }),
    }).catch((error) => {
      console.error('[ServiceWorker] Dismissal logging failed:', error);
    })
  );
});

// ============================================
// BACKGROUND SYNC (Future Feature)
// ============================================

self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-trigger-logs') {
    event.waitUntil(syncTriggerLogs());
  }
  
  if (event.tag === 'sync-journal-entries') {
    event.waitUntil(syncJournalEntries());
  }
});

async function syncTriggerLogs() {
  try {
    // Get pending logs from IndexedDB
    const db = await openDB();
    const pendingLogs = await db.getAll('pendingTriggerLogs');
    
    // Send to backend
    for (const log of pendingLogs) {
      await fetch('/api/triggerLogging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
      
      // Remove from pending after successful sync
      await db.delete('pendingTriggerLogs', log.id);
    }
    
    console.log('[ServiceWorker] Trigger logs synced:', pendingLogs.length);
  } catch (error) {
    console.error('[ServiceWorker] Sync failed:', error);
    throw error; // Retry sync
  }
}

async function syncJournalEntries() {
  // Similar implementation for journal entries
  console.log('[ServiceWorker] Journal entries sync placeholder');
}

// ============================================
// HELPER: IndexedDB Access
// ============================================

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('VOWAppDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('pendingTriggerLogs')) {
        db.createObjectStore('pendingTriggerLogs', { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains('pendingJournalEntries')) {
        db.createObjectStore('pendingJournalEntries', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// ============================================
// MESSAGE HANDLER (for communication with app)
// ============================================

self.addEventListener('message', (event) => {
  console.log('[ServiceWorker] Message received:', event.data);
  
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data.action === 'clearCache') {
    event.waitUntil(
      caches.delete(CACHE_NAME)
        .then(() => {
          console.log('[ServiceWorker] Cache cleared');
          return caches.open(CACHE_NAME);
        })
        .then((cache) => {
          return cache.addAll(STATIC_CACHE);
        })
    );
  }
});

// ============================================
// CONSOLE BANNER
// ============================================

console.log(`
╔═══════════════════════════════════════╗
║   VOW Service Worker Active           ║
║   Version: 1.0.0                      ║
║   Features: Push, Cache, Sync         ║
╚═══════════════════════════════════════╝
`);
