/**
 * Settings Page
 * User preferences, privacy, and account settings
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ProtectedRoute from '../components/ProtectedRoute';
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // Settings state
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
      // Load user data
      const token = loadAuthToken();
      const response = await fetch('/api/userData', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.data);
      }

      // Load preferences
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

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Save theme
      localStorage.setItem('theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
      
      // Save user prefs
      saveUserPrefs({ theme });
      
      // Save notification preferences
      saveNotificationPreferences(notifications);

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    if (!confirm('All your vows, reflections, and progress will be permanently deleted. Continue?')) {
      return;
    }

    try {
      const token = loadAuthToken();
      const response = await fetch('/api/deleteAccount', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        removeAuthToken();
        router.push('/');
      } else {
        alert('Failed to delete account');
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1C1F] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚙️</div>
          <p className="observation-text">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1C1F] bg-gradient-to-b from-[#0C1117] to-[#1A1C1F]">
      <Head>
        <title>Settings - VOW</title>
      </Head>

      {/* Header */}
      <nav className="corrective-bg border-b border-[#E3C27D]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-[#8E8A84] hover:text-[#F4F1ED]"
            >
              ← Back
            </button>
            <h1 className="text-lg font-medium text-[#F4F1ED]">Settings</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Account Section */}
        <section className="separation-card bg-[#1A1C1F] border border-[#E3C27D]/20 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold awareness-text mb-4">Account</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium observation-text mb-1">
                Email
              </label>
              <div className="text-sm awareness-text">{userData?.email}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium observation-text mb-1">
                Member Since
              </label>
              <div className="text-sm awareness-text">
                {new Date(userData?.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long'
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="separation-card bg-[#1A1C1F] border border-[#E3C27D]/20 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold awareness-text mb-4">Appearance</h2>
          
          <div>
            <label className="block text-sm font-medium observation-text mb-3">
              Theme
            </label>
            <div className="flex space-x-3">
              <ThemeOption
                value="light"
                icon="☀️"
                label="Light"
                selected={theme === 'light'}
                onClick={() => setTheme('light')}
              />
              <ThemeOption
                value="dark"
                icon="🌙"
                label="Dark"
                selected={theme === 'dark'}
                onClick={() => setTheme('dark')}
              />
            </div>
          </div>
        </section>

        {/* Notifications */}
        {isNotificationSupported() && (
          <section className="separation-card bg-[#1A1C1F] border border-[#E3C27D]/20 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold awareness-text mb-4">Notifications</h2>
            
            <div className="space-y-4">
              <ToggleSetting
                label="Enable Notifications"
                description="Receive reminders and updates"
                checked={notifications.enabled}
                onChange={(checked) => setNotifications({ ...notifications, enabled: checked })}
              />
              
              {notifications.enabled && (
                <>
                  <ToggleSetting
                    label="Morning Reminder"
                    description="Daily vow creation reminder"
                    checked={notifications.morning}
                    onChange={(checked) => setNotifications({ ...notifications, morning: checked })}
                  />
                  
                  <ToggleSetting
                    label="Evening Reflection"
                    description="End-of-day reflection reminder"
                    checked={notifications.evening}
                    onChange={(checked) => setNotifications({ ...notifications, evening: checked })}
                  />
                  
                  <ToggleSetting
                    label="Streak Reminders"
                    description="Protect your streak notifications"
                    checked={notifications.streak}
                    onChange={(checked) => setNotifications({ ...notifications, streak: checked })}
                  />
                  
                  <ToggleSetting
                    label="Achievements"
                    description="Badge and milestone notifications"
                    checked={notifications.achievements}
                    onChange={(checked) => setNotifications({ ...notifications, achievements: checked })}
                  />

                  <button
                    onClick={sendTestNotification}
                    className="text-sm font-medium"
                    style={{ color: '#C6A664' }}
                  >
                    Send Test Notification
                  </button>
                </>
              )}
            </div>
          </section>
        )}

        {/* Privacy */}
        <section className="separation-card bg-[#1A1C1F] border border-[#E3C27D]/20 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold awareness-text mb-4">Privacy</h2>
          
          <div className="space-y-4">
            <ToggleSetting
              label="Allow Analytics"
              description="Help improve VOW with anonymous usage data"
              checked={privacy.allowAnalytics}
              onChange={(checked) => setPrivacy({ ...privacy, allowAnalytics: checked })}
            />
          </div>
        </section>

        {/* Data & Export */}
        <section className="separation-card bg-[#1A1C1F] border border-[#E3C27D]/20 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold awareness-text mb-4">Data & Export</h2>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/api/export')}
              className="w-full text-left px-4 py-3 rounded-lg border-2 border-[#E3C27D]/20 hover:border-amber-400 transition-all"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📥</span>
                <div>
                  <div className="font-medium awareness-text">Export Data</div>
                  <div className="text-sm observation-text">Download your vows and reflections</div>
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="separation-card bg-[#1A1C1F] border border-[#E3C27D]/20 rounded-xl p-6 mb-6 border-2 border-red-200">
          <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
          
          <button
            onClick={handleDeleteAccount}
            className="w-full px-4 py-3 rounded-lg bg-red-50 border-2 border-red-200 hover:bg-red-100 transition-all"
          >
            <div className="text-left">
              <div className="font-medium text-red-600">Delete Account</div>
              <div className="text-sm text-red-500">Permanently delete your account and all data</div>
            </div>
          </button>
        </section>

        {/* Save Button */}
        <button
          onClick={saveSettings}
          disabled={saving}
          className="w-full py-4 rounded-lg font-medium text-[#F4F1ED] disabled:opacity-50"
          style={{ backgroundColor: '#C6A664' }}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

function ThemeOption({ value, icon, label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
        selected ? 'border-amber-400 bg-amber-50' : 'border-[#E3C27D]/20 hover:border-[#E3C27D]/30'
      }`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-sm font-medium awareness-text">{label}</div>
    </button>
  );
}

function ToggleSetting({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="font-medium awareness-text">{label}</div>
        <div className="text-sm observation-text">{description}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 rounded-full corrective-bg transition-transform ${
            checked ? 'transform translate-x-6' : ''
          }`}
        />
      </button>
    </div>
  );
}
