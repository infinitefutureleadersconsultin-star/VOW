import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { api } from '../utils/apiClient';
import { showToast } from '../utils/notificationUtils';

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    nationality: '',
    language: ''
  });

  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
  const languageOptions = ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Other'];

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
      
      const response = await api.get('/userData?include=stats', {
        timeout: 10000
      });
      
      if (response?.data?.success) {
        const data = response.data.data;
        setUserData(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          gender: data.gender || '',
          nationality: data.nationality || '',
          language: data.language || 'English'
        });
      } else {
        throw new Error('Failed to load profile data');
      }
    } catch (error) {
      console.error('Load profile error:', error);
      
      if (error.code === 'UNAUTHORIZED') {
        localStorage.removeItem('vow_auth_token');
        localStorage.removeItem('vow_refresh_token');
        showToast('Session expired. Please log in again', 'error');
        router.push('/login');
      } else if (error.code === 'ECONNABORTED') {
        setError('Request timeout. Please check your connection.');
      } else if (error.response?.status === 404) {
        setError('Profile not found. Please contact support.');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to load your profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showToast('Name is required', 'error');
      return false;
    }
    
    if (formData.name.trim().length < 2) {
      showToast('Name must be at least 2 characters', 'error');
      return false;
    }
    
    if (formData.name.trim().length > 100) {
      showToast('Name is too long (max 100 characters)', 'error');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast('Please enter a valid email address', 'error');
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const updateData = {
        name: formData.name.trim(),
        gender: formData.gender || null,
        nationality: formData.nationality.trim() || null,
        language: formData.language
      };

      const response = await api.post('/userData', {
        action: 'update_profile',
        profile: updateData
      }, {
        timeout: 15000
      });

      if (response?.data?.success) {
        setUserData(prev => ({
          ...prev,
          ...updateData
        }));
        setIsEditing(false);
        showToast('Profile updated successfully!', 'success');
      } else {
        throw new Error(response?.data?.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      
      if (error.code === 'UNAUTHORIZED') {
        localStorage.removeItem('vow_auth_token');
        showToast('Session expired. Please log in again', 'error');
        router.push('/login');
      } else if (error.code === 'ECONNABORTED') {
        setError('Request timeout. Your changes may not have been saved.');
        showToast('Timeout. Please try again', 'error');
      } else if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.error || 'Invalid data. Please check your entries.';
        setError(errorMsg);
        showToast(errorMsg, 'error');
      } else if (error.response?.status === 409) {
        setError('Email already in use by another account.');
        showToast('Email already in use', 'error');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again in a moment.');
        showToast('Server error. Please try again', 'error');
      } else {
        const errorMessage = error.response?.data?.error || error.message || 'Failed to update profile';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userData.name || '',
      email: userData.email || '',
      gender: userData.gender || '',
      nationality: userData.nationality || '',
      language: userData.language || 'English'
    });
    setIsEditing(false);
    setError(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const getSubscriptionBadge = (status) => {
    const badges = {
      trial: { text: 'Trial', color: 'bg-amber-100 text-amber-700' },
      active: { text: 'Active', color: 'bg-green-100 text-green-700' },
      canceled: { text: 'Canceled', color: 'bg-gray-100 text-gray-700' },
      expired: { text: 'Expired', color: 'bg-red-100 text-red-700' }
    };
    
    return badges[status] || { text: 'Unknown', color: 'bg-gray-100 text-gray-700' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const badge = getSubscriptionBadge(userData?.subscriptionStatus);
  const stats = userData?.stats || {};

  return (
    <>
      <Head>
        <title>Profile - VOW</title>
        <meta name="description" content="Your VOW profile" />
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
              <h1 className="text-lg font-medium text-gray-900">Profile</h1>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-xl shadow-md p-8">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-light text-gray-900">Personal Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        className="text-gray-600 hover:text-gray-900 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          saving
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-amber-600 text-white hover:bg-amber-700'
                        }`}
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                        maxLength={100}
                      />
                    ) : (
                      <p className="text-gray-900">{userData?.name || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <p className="text-gray-900">{userData?.email || 'Not provided'}</p>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                      >
                        <option value="">Select...</option>
                        {genderOptions.map((option) => (
                          <option key={option} value={option.toLowerCase()}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-gray-900 capitalize">{userData?.gender || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Nationality */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nationality
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.nationality}
                        onChange={(e) => handleInputChange('nationality', e.target.value)}
                        placeholder="e.g., American, British, etc."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                        maxLength={50}
                      />
                    ) : (
                      <p className="text-gray-900">{userData?.nationality || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Language
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                      >
                        {languageOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-gray-900">{userData?.language || 'English'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Activity */}
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-light text-gray-900 mb-6">Account Activity</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Member Since</p>
                    <p className="text-gray-900 font-medium">{formatDate(userData?.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Last Login</p>
                    <p className="text-gray-900 font-medium">{formatDate(userData?.lastLogin)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email Verified</p>
                    <p className="text-gray-900 font-medium">
                      {userData?.emailVerified ? '✅ Yes' : '❌ No'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Data Consent</p>
                    <p className="text-gray-900 font-medium">
                      {userData?.consentData ? '✅ Given' : '❌ Not given'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Stats & Subscription */}
            <div className="space-y-6">
              {/* Subscription Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
                      {badge.text}
                    </span>
                  </div>
                  {userData?.subscriptionTier && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Plan</p>
                      <p className="text-gray-900 font-medium capitalize">{userData.subscriptionTier}</p>
                    </div>
                  )}
                  {userData?.trialEndDate && userData?.subscriptionStatus === 'trial' && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Trial Ends</p>
                      <p className="text-gray-900 font-medium">{formatDate(userData.trialEndDate)}</p>
                    </div>
                  )}
                  <button
                    onClick={() => router.push('/pricing')}
                    className="w-full mt-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    {userData?.subscriptionStatus === 'trial' ? 'Upgrade Plan' : 'Manage Subscription'}
                  </button>
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Journey</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Vows</span>
                    <span className="text-xl font-light text-gray-900">{stats.totalVows || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Streak</span>
                    <span className="text-xl font-light text-gray-900">{stats.currentStreak || 0} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Reflections</span>
                    <span className="text-xl font-light text-gray-900">{stats.totalReflections || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Alignment Score</span>
                    <span className="text-xl font-light text-gray-900">{stats.alignmentScore || 0}%</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push('/settings')}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    ⚙️ Settings
                  </button>
                  <button
                    onClick={() => router.push('/pricing')}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    💳 Billing
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to log out?')) {
                        localStorage.removeItem('vow_auth_token');
                        localStorage.removeItem('vow_refresh_token');
                        router.push('/login');
                      }
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    🚪 Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
