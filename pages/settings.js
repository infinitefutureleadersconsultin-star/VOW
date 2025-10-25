import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ProtectedRoute from '../components/ProtectedRoute';
import { useTranslation } from '../lib/translations';
import { loadAuthToken, removeAuthToken, saveUserPrefs, loadUserPrefs } from '../lib/storage';
import { 
  getNotificationPreferences, 
  saveNotificationPreferences,
  sendTestNotification,
  isNotificationSupported 
} from '../lib/notifications';

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}

function SettingsContent() {
  const router = useRouter();
  const { t, language, changeLanguage } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState({
    enabled: true,
    morning: true,
    evening: true,
    streak: true,
    achievements: true,
    schedule: {
      morning: { hour: 8, minute: 0 },
      evening: { hour: 20, minute: 0 }
    }
  });
  const [privacy, setPrivacy] = useState({
    shareProgress: false,
    allowAnalytics: true
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const token = loadAuthToken();
      const response = await fetch('/api/userData', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.data);
      }

      const prefs = loadUserPrefs();
      setTheme(prefs.theme || 'light');

      const notifPrefs = getNotificationPreferences();
      if (notifPrefs) {
        setNotifications(notifPrefs);
      }

    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      saveUserPrefs({ theme, language });
      saveNotificationPreferences(notifications);
      
      alert(t('common.success'));
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert(t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageChange = (newLang) => {
    changeLanguage(newLang);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{t('settings.title')} - VOW</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('settings.title')}</h1>
        </div>

        <div className="space-y-6">
          {/* Language Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{t('settings.language')}</h2>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="en">🇬🇧 English</option>
              <option value="es">🇪🇸 Español</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="hi">🇮🇳 हिन्दी</option>
              <option value="zh">🇨🇳 中文</option>
              <option value="pt">🇵🇹 Português</option>
            </select>
          </div>

          {/* Theme Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{t('settings.theme')}</h2>
            <div className="flex gap-4">
              <button
                onClick={() => handleThemeChange('light')}
                className={`px-6 py-3 rounded-lg border-2 ${
                  theme === 'light'
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-300'
                }`}
              >
                {t('dashboard.light_mode')}
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`px-6 py-3 rounded-lg border-2 ${
                  theme === 'dark'
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-300'
                }`}
              >
                {t('dashboard.dark_mode')}
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{t('settings.notifications')}</h2>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.enabled}
                  onChange={(e) => setNotifications({...notifications, enabled: e.target.checked})}
                  className="mr-3"
                />
                <span>Enable notifications</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.morning}
                  onChange={(e) => setNotifications({...notifications, morning: e.target.checked})}
                  className="mr-3"
                  disabled={!notifications.enabled}
                />
                <span>Morning reminders</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.evening}
                  onChange={(e) => setNotifications({...notifications, evening: e.target.checked})}
                  className="mr-3"
                  disabled={!notifications.enabled}
                />
                <span>Evening reflections</span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {saving ? t('common.loading') : t('settings.save_changes')}
          </button>
        </div>
      </div>
    </div>
  );
}
