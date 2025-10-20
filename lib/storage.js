/**
 * Storage utilities
 * Auto-save, local storage, and cloud sync
 */

const STORAGE_KEYS = {
  DRAFT_VOW: 'vow_draft',
  DRAFT_REFLECTION: 'reflection_draft',
  DRAFT_TRIGGER: 'trigger_draft',
  AUTH_TOKEN: 'vow_auth_token',
  USER_PREFS: 'vow_user_prefs',
  OFFLINE_QUEUE: 'vow_offline_queue',
  LAST_SYNC: 'vow_last_sync'
};

/**
 * Save to localStorage
 */
export function saveLocal(key, data) {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
}

/**
 * Load from localStorage
 */
export function loadLocal(key) {
  try {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

/**
 * Remove from localStorage
 */
export function removeLocal(key) {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
    return false;
  }
}

/**
 * Clear all app data
 */
export function clearAllLocal() {
  try {
    if (typeof window === 'undefined') return false;
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
    return false;
  }
}

/**
 * Auto-save draft vow
 */
export function saveDraftVow(vowData) {
  const draft = {
    ...vowData,
    savedAt: new Date().toISOString()
  };
  return saveLocal(STORAGE_KEYS.DRAFT_VOW, draft);
}

/**
 * Load draft vow
 */
export function loadDraftVow() {
  const draft = loadLocal(STORAGE_KEYS.DRAFT_VOW);
  if (!draft) return null;
  
  // Check if draft is less than 24 hours old
  const savedAt = new Date(draft.savedAt);
  const now = new Date();
  const hoursSince = (now - savedAt) / (1000 * 60 * 60);
  
  if (hoursSince > 24) {
    removeDraftVow();
    return null;
  }
  
  return draft;
}

/**
 * Remove draft vow
 */
export function removeDraftVow() {
  return removeLocal(STORAGE_KEYS.DRAFT_VOW);
}

/**
 * Auto-save draft reflection
 */
export function saveDraftReflection(reflectionData) {
  const draft = {
    ...reflectionData,
    savedAt: new Date().toISOString()
  };
  return saveLocal(STORAGE_KEYS.DRAFT_REFLECTION, draft);
}

/**
 * Load draft reflection
 */
export function loadDraftReflection() {
  return loadLocal(STORAGE_KEYS.DRAFT_REFLECTION);
}

/**
 * Remove draft reflection
 */
export function removeDraftReflection() {
  return removeLocal(STORAGE_KEYS.DRAFT_REFLECTION);
}

/**
 * Save auth token
 */
export function saveAuthToken(token) {
  return saveLocal(STORAGE_KEYS.AUTH_TOKEN, token);
}

/**
 * Load auth token
 */
export function loadAuthToken() {
  return loadLocal(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * Remove auth token
 */
export function removeAuthToken() {
  return removeLocal(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * Save user preferences
 */
export function saveUserPrefs(prefs) {
  return saveLocal(STORAGE_KEYS.USER_PREFS, prefs);
}

/**
 * Load user preferences
 */
export function loadUserPrefs() {
  const defaults = {
    theme: 'light',
    notifications: true,
    autoSave: true,
    soundEnabled: false
  };
  
  const saved = loadLocal(STORAGE_KEYS.USER_PREFS);
  return { ...defaults, ...saved };
}

/**
 * Queue action for offline sync
 */
export function queueOfflineAction(action) {
  const queue = loadLocal(STORAGE_KEYS.OFFLINE_QUEUE) || [];
  queue.push({
    ...action,
    queuedAt: new Date().toISOString()
  });
  return saveLocal(STORAGE_KEYS.OFFLINE_QUEUE, queue);
}

/**
 * Get offline queue
 */
export function getOfflineQueue() {
  return loadLocal(STORAGE_KEYS.OFFLINE_QUEUE) || [];
}

/**
 * Clear offline queue
 */
export function clearOfflineQueue() {
  return removeLocal(STORAGE_KEYS.OFFLINE_QUEUE);
}

/**
 * Save last sync timestamp
 */
export function saveLastSync() {
  return saveLocal(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
}

/**
 * Get last sync timestamp
 */
export function getLastSync() {
  return loadLocal(STORAGE_KEYS.LAST_SYNC);
}

/**
 * Check if online
 */
export function isOnline() {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
}

/**
 * Sync offline queue when online
 */
export async function syncOfflineQueue() {
  if (!isOnline()) return { success: false, error: 'Offline' };
  
  const queue = getOfflineQueue();
  if (queue.length === 0) return { success: true, synced: 0 };
  
  const results = [];
  
  for (const action of queue) {
    try {
      // Each action should have: type, endpoint, data
      const response = await fetch(action.endpoint, {
        method: action.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loadAuthToken()}`
        },
        body: JSON.stringify(action.data)
      });
      
      results.push({ success: response.ok, action });
    } catch (error) {
      results.push({ success: false, action, error: error.message });
    }
  }
  
  // Clear queue after sync attempt
  clearOfflineQueue();
  saveLastSync();
  
  const synced = results.filter(r => r.success).length;
  return { success: true, synced, total: queue.length, results };
}

/**
 * Get storage usage
 */
export function getStorageUsage() {
  if (typeof window === 'undefined') return null;
  
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  
  return {
    used: total,
    usedKB: (total / 1024).toFixed(2),
    usedMB: (total / (1024 * 1024)).toFixed(2)
  };
}

/**
 * Export all data as JSON
 */
export function exportAllData() {
  const data = {};
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    data[name] = loadLocal(key);
  });
  
  return {
    exportedAt: new Date().toISOString(),
    data
  };
}

/**
 * Import data from export
 */
export function importData(exportedData) {
  try {
    Object.entries(exportedData.data).forEach(([name, value]) => {
      const key = STORAGE_KEYS[name];
      if (key && value) {
        saveLocal(key, value);
      }
    });
    return true;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
}

/**
 * Check if storage is available
 */
export function isStorageAvailable() {
  try {
    if (typeof window === 'undefined') return false;
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}

export default STORAGE_KEYS;
