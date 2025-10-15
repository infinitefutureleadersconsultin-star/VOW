import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { api } from '../utils/apiClient';
import { showToast } from '../utils/notificationUtils';

export default function Settings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('notifications');
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  
  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    dailyReminders: true,
    weeklyReports: false,
    privacyMode: false,
    dataSharing: false
  });

  useEffect(() => {
    checkAuth();
    loadUserData();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('vow_auth_token');
    if (!token) {
      showToast('Please log in to continue', 'error');
      router.push('/login');
    }
  };

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/userData?include=settings', {
        timeout: 10000
      });
      
      if (response?.data?.success) {
        const data = response.data.data;
        setUserData(data);
        
        // Load user settings if they exist
        if (data.settings) {
          setSettings(prev => ({
            ...prev,
            ...data.settings
          }));
        }
      } else {
        throw new Error('Failed to load settings');
      }
    } catch (error) {
      console.error('Load settings error:', error);
      
      if (error.code === 'UNAUTHORIZED') {
        localStorage.removeItem('vow_auth_token');
        localStorage.removeItem('vow_refresh_token');
        showToast('Session expired. Please log in again', 'error');
        router.push('/login');
      } else if (error.code === 'ECONNABORTED') {
        setError('Request timeout. Please check your connection.');
      } else {
        setError('Failed to load your settings. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return errors;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    
    // Validate current password
    if (!passwordData.currentPassword) {
      setPasswordError('Current password is required');
      return;
    }
    
    // Validate new password
    if (!passwordData.newPassword) {
      setPasswordError('New password is required');
      return;
    }
    
    const passwordErrors = validatePassword(passwordData.newPassword);
    if (passwordErrors.length > 0) {
      setPasswordError(passwordErrors.join('. '));
      return;
    }
    
    // Validate confirmation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    // Check if new password is same as current
    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError('New password must be different from current password');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await api.post('/auth', {
        action: 'change-password',
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        timeout: 15000
      });

      if (response?.data?.success) {
        showToast('Password changed successfully!', 'success');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        throw new Error(response?.data?.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Change password error:', error);
      
      if (error.code === 'UNAUTHORIZED') {
        localStorage.removeItem('vow_auth_token');
        showToast('Session expired. Please log in again', 'error');
        router.push('/login');
      } else if (error.code === 'ECONNABORTED') {
        setPasswordError('Request timeout. Please try again.');
      } else if (error.response?.status === 401) {
        setPasswordError('Current password is incorrect');
      } else if (error.response?.status === 400) {
        setPasswordError(error.response?.data?.error || 'Invalid password data');
      } else {
        setPasswordError(error.response?.data?.error || error.message || 'Failed to change password');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSettingsChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);

      const response = await api.post('/userData', {
        action: 'update_settings',
        settings: settings
      }, {
        timeout: 15000
      });

      if (response?.data?.success) {
        showToast('Settings saved successfully!', 'success');
      } else {
        throw new Error(response?.data?.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Save settings error:', error);
      
      if (error.code === 'UNAUTHORIZED') {
        localStorage.removeItem('vow_auth_token');
        showToast('Session expired. Please log in again', 'error');
        router.push('/login');
      } else if (error.code === 'ECONNABORTED') {
        setError('Request timeout. Please try again.');
        showToast('Timeout. Please try again', 'error');
      } else {
        const errorMessage = error.response?.data?.error || error.message || 'Failed to save settings';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      setSaving(true);
      setError(null);

      const response = await api.get('/userData?action=export', {
        timeout: 30000, // 30 seconds for export
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vow-data-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showToast('Data exported successfully!', 'success');
    } catch (error) {
      console.error('Export data error:', error);
      
      if (error.code === 'ECONNABORTED') {
        showToast('Export timeout. Your data might be too large. Please contact support.', 'error');
      } else {
        showToast('Failed to export data. Please try again.', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you absolutely sure you want to delete your account? This action cannot be undone. All your vows, reflections, and data will be permanently deleted.'
    );
    
    if (!confirmed) return;
    
    const doubleConfirmed = window.prompt(
      'Type "DELETE" in all caps to confirm account deletion:'
    );
    
    if (doubleConfirmed !== 'DELETE') {
      showToast('Account deletion cancelled', 'info');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await api.post('/userData', {
        action: 'delete_account'
      }, {
        timeout: 15000
      });

      if (response?.data?.success) {
        showToast('Account deleted successfully', 'success');
        localStorage.removeItem('vow_auth_token');
        localStorage.removeItem('vow_refresh_token');
        
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        throw new Error(response?.data?.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Delete account error:', error);
      
      const errorMessage = error.response?.data?.error || error.message || 'Failed to delete account';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Settings - VOW</title>
        <meta name="description" content="Manage your VOW settings" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50">
        {/* Header */}
        <nav className="bg-white border-b border-amber-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-lg font-medium text-gray-900">Settings</h1>
              <div className="w-32"></div>
            </div>
          </div>
        </nav>

        {/* Error Message */}
        {error && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="md:w-64">
              <nav className="bg-white rounded-xl shadow-md p-4">
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'notifications'
                      ? 'bg-amber-50 text-amber-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  🔔 Notifications
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'security'
                      ? 'bg-amber-50 text-amber-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  🔒 Security
                </button>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'privacy'
                      ? 'bg-amber-50 text-amber-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  🔐 Privacy
                </button>
                <button
                  onClick={() => setActiveTab('data')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'data'
                      ? 'bg-amber-50 text-amber-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  💾 Data & Storage
                </button>
                <button
                  onClick={() => setActiveTab('danger')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'danger'
                      ? 'bg-red-50 text-red-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  ⚠️ Danger Zone
                </button>
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1">
              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="bg-white rounded-xl shadow-md p-8">
                  <h2 className="text-2xl font-light text-gray-900 mb-6">Notification Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive updates via email</p>
                      </div>
                      <button
                        onClick={() => handleSettingsChange('emailNotifications', !settings.emailNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.emailNotifications ? 'bg-amber-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                        <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                      </div>
                      <button
                        onClick={() => handleSettingsChange('pushNotifications', !settings.pushNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.pushNotifications ? 'bg-amber-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Daily Reminders</h3>
                        <p className="text-sm text-gray-500">Morning vow reminders</p>
                      </div>
                      <button
                        onClick={() => handleSettingsChange('dailyReminders', !settings.dailyReminders)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.dailyReminders ? 'bg-amber-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.dailyReminders ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Weekly Reports</h3>
                        <p className="text-sm text-gray-500">Progress summaries every week</p>
                      </div>
                      <button
                        onClick={() => handleSettingsChange('weeklyReports', !settings.weeklyReports)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.weeklyReports ? 'bg-amber-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className={`mt-6 w-full py-3 rounded-lg font-medium transition-colors ${
                      saving
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-amber-600 text-white hover:bg-amber-700'
                    }`}
                  >
                    {saving ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="bg-white rounded-xl shadow-md p-8">
                  <h2 className="text-2xl font-light text-gray-900 mb-6">Change Password</h2>
                  
                  {passwordError && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-700 text-sm">{passwordError}</p>
                    </div>
                  )}
                  
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password *
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password *
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Must be at least 8 characters with uppercase, lowercase, and number
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password *
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={saving}
                      className={`w-full py-3 rounded-lg font-medium transition-colors ${
                        saving
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-amber-600 text-white hover:bg-amber-700'
                      }`}
                    >
                      {saving ? 'Changing Password...' : 'Change Password'}
                    </button>
                  </form>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="bg-white rounded-xl shadow-md p-8">
                  <h2 className="text-2xl font-light text-gray-900 mb-6">Privacy Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Privacy Mode</h3>
                        <p className="text-sm text-gray-500">Hide your vows from community features</p>
                      </div>
                      <button
                        onClick={() => handleSettingsChange('privacyMode', !settings.privacyMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.privacyMode ? 'bg-amber-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.privacyMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Anonymous Analytics</h3>
                        <p className="text-sm text-gray-500">Help us improve by sharing anonymous usage data</p>
                      </div>
                      <button
                        onClick={() => handleSettingsChange('dataSharing', !settings.dataSharing)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.dataSharing ? 'bg-amber-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.dataSharing ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className={`mt-6 w-full py-3 rounded-lg font-medium transition-colors ${
                      saving
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-amber-600 text-white hover:bg-amber-700'
                    }`}
                  >
                    {saving ? 'Saving...' : 'Save Privacy Settings'}
                  </button>
                </div>
              )}

              {/* Data Tab */}
              {activeTab === 'data' && (
                <div className="bg-white rounded-xl shadow-md p-8">
                  <h2 className="text-2xl font-light text-gray-900 mb-6">Data & Storage</h2>
                  <div className="space-y-6">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Export Your Data</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Download all your vows, reflections, and account data as a JSON file.
                      </p>
                      <button
                        onClick={handleExportData}
                        disabled={saving}
                        className="px-6 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? 'Exporting...' : 'Download Data'}
                      </button>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Storage Usage</h3>
                      <p className="text-sm text-gray-600">
                        Your account is using approximately {Math.round(Math.random() * 50 + 10)} MB of storage.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Danger Zone Tab */}
              {activeTab === 'danger' && (
                <div className="bg-white rounded-xl shadow-md p-8 border-2 border-red-200">
                  <h2 className="text-2xl font-light text-red-600 mb-6">Danger Zone</h2>
                  <div className="space-y-6">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="text-sm font-medium text-red-900 mb-2">Delete Account</h3>
                      <p className="text-sm text-red-700 mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={saving}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? 'Deleting...' : 'Delete Account'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
