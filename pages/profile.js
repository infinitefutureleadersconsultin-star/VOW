import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { api } from '../utils/apiClient';
import { showToast } from '../utils/notificationUtils';

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [renewing, setRenewing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    nationality: '',
    ethnicity: '',
    language: ''
  });

  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
  const nationalityOptions = ['US', 'UK', 'Canada', 'Mexico', 'Other'];
  const ethnicityOptions = [
    'Prefer not to say',
    'White/Caucasian',
    'Black/African American',
    'Hispanic/Latino',
    'Asian',
    'Native American/Indigenous',
    'Pacific Islander',
    'Middle Eastern/North African',
    'Mixed/Multiracial',
    'Other'
  ];
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
          ethnicity: data.ethnicity || '',
          language: data.language || 'English'
        });
      } else {
        throw new Error('Failed to load profile data');
      }
    } catch (error) {
      console.error('Load profile error:', error);
      
      if (error.code === 'UNAUTHORIZED') {
        localStorage.removeItem('vow_auth_token');
        showToast('Session expired. Please log in again', 'error');
        router.push('/login');
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
    
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError(null);

      const updateData = {
        name: formData.name.trim(),
        gender: formData.gender || null,
        nationality: formData.nationality || null,
        ethnicity: formData.ethnicity || null,
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
      showToast(error.message || 'Failed to update profile', 'error');
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
      ethnicity: userData.ethnicity || '',
      language: userData.language || 'English'
    });
    setIsEditing(false);
    setError(null);
  };

  const handleRenewSubscription = async () => {
    setRenewing(true);

    try {
      const response = await api.post('/subscription', {
        action: 'renew_subscription'
      }, {
        timeout: 15000
      });

      if (response?.data?.success) {
        showToast('Subscription renewed successfully!', 'success');
        loadUserData(); // Reload user data
      } else {
        throw new Error(response?.data?.error || 'Failed to renew subscription');
      }
    } catch (error) {
      console.error('Renew subscription error:', error);
      showToast(error.message || 'Failed to renew subscription', 'error');
    } finally {
      setRenewing(false);
    }
  };

  const getDaysRemaining = () => {
    if (!userData?.subscriptionEndDate) return 0;
    
    const endDate = new Date(userData.subscriptionEndDate);
    const now = new Date();
    const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    
    return Math.max(0, daysLeft);
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
      cancelled: { text: 'Cancelled', color: 'bg-gray-100 text-gray-700' },
      expired: { text: 'Expired', color: 'bg-red-100 text-red-700' }
    };
    
    return badges[status] || { text: 'Unknown', color: 'bg-gray-100 text-gray-700' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0C1117' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E3C27D] mx-auto mb-4"></div>
          <p className="text-[#8E8A84]">Loading profile...</p>
        </div>
      </div>
    );
  }

  const badge = getSubscriptionBadge(userData?.subscriptionStatus);
  const stats = userData?.stats || {};
  const daysRemaining = getDaysRemaining();
  const isCancelled = userData?.subscriptionStatus === 'cancelled';

  return (
    <>
      <Head>
        <title>Profile - VOW</title>
      </Head>

      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0C1117 0%, #1a1f2e 100%)' }}>
        {/* Header */}
        <nav className="glass-card border-b" style={{ borderColor: 'rgba(244, 241, 237, 0.08)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-[#8E8A84] hover:text-[#F4F1ED]"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-lg font-light text-[#F4F1ED]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Profile
              </h1>
              <div className="w-32"></div>
            </div>
          </div>
        </nav>

        {/* Error Message */}
        {error && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="p-4 rounded-xl" style={{ background: 'rgba(110, 59, 59, 0.2)', border: '1px solid rgba(110, 59, 59, 0.3)' }}>
              <p className="text-[#F4F1ED] text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Card */}
              <div className="glass-card rounded-2xl p-8">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-light text-[#F4F1ED]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Personal Information
                  </h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-[#E3C27D] hover:text-[#F0D9A8] font-medium"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-primary"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#C8C4BE] mb-2">
                      Name *
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="input-glass w-full px-4 py-2 rounded-xl"
                        maxLength={100}
                      />
                    ) : (
                      <p className="text-[#F4F1ED]">{userData?.name || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-[#C8C4BE] mb-2">
                      Email
                    </label>
                    <p className="text-[#F4F1ED]">{userData?.email || 'Not provided'}</p>
                    <p className="text-xs text-[#8E8A84] mt-1">Email cannot be changed</p>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-[#C8C4BE] mb-2">
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="input-glass w-full px-4 py-2 rounded-xl"
                      >
                        <option value="">Select...</option>
                        {genderOptions.map((option) => (
                          <option key={option} value={option.toLowerCase()}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-[#F4F1ED] capitalize">{userData?.gender || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Nationality */}
                  <div>
                    <label className="block text-sm font-medium text-[#C8C4BE] mb-2">
                      Nationality
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.nationality}
                        onChange={(e) => handleInputChange('nationality', e.target.value)}
                        className="input-glass w-full px-4 py-2 rounded-xl"
                      >
                        <option value="">Select...</option>
                        {nationalityOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-[#F4F1ED]">{userData?.nationality || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Ethnicity */}
                  <div>
                    <label className="block text-sm font-medium text-[#C8C4BE] mb-2">
                      Ethnicity <span className="text-[#8E8A84] text-xs">(Optional)</span>
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.ethnicity}
                        onChange={(e) => handleInputChange('ethnicity', e.target.value)}
                        className="input-glass w-full px-4 py-2 rounded-xl"
                      >
                        {ethnicityOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-[#F4F1ED]">{userData?.ethnicity || 'Not specified'}</p>
                    )}
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-[#C8C4BE] mb-2">
                      Preferred Language
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        className="input-glass w-full px-4 py-2 rounded-xl"
                      >
                        {languageOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-[#F4F1ED]">{userData?.language || 'English'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Activity */}
              <div className="glass-card rounded-2xl p-8">
                <h2 className="text-2xl font-light text-[#F4F1ED] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Account Activity
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#8E8A84] mb-1">Member Since</p>
                    <p className="text-[#F4F1ED] font-medium">{formatDate(userData?.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8E8A84] mb-1">Email Verified</p>
                    <p className="text-[#F4F1ED] font-medium">
                      {userData?.emailVerified ? '✓ Yes' : '✗ No'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8E8A84] mb-1">Data Consent</p>
                    <p className="text-[#F4F1ED] font-medium">
                      {userData?.consentData ? '✓ Given' : '✗ Not given'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8E8A84] mb-1">AI Consent</p>
                    <p className="text-[#F4F1ED] font-medium">
                      {userData?.consentAI ? '✓ Given' : '✗ Not given'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Column - Stats & Subscription */}
            <div className="space-y-6">
              {/* Subscription Card */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-medium text-[#F4F1ED] mb-4">Subscription</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-[#8E8A84] mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
                      {badge.text}
                    </span>
                  </div>

                  {userData?.subscriptionTier && (
                    <div>
                      <p className="text-sm text-[#8E8A84] mb-1">Plan</p>
                      <p className="text-[#F4F1ED] font-medium capitalize">{userData.subscriptionTier}</p>
                    </div>
                  )}

                  {/* Trial End Date */}
                  {userData?.trialEndDate && userData?.subscriptionStatus === 'trial' && (
                    <div>
                      <p className="text-sm text-[#8E8A84] mb-1">Trial Ends</p>
                      <p className="text-[#F4F1ED] font-medium">{formatDate(userData.trialEndDate)}</p>
                    </div>
                  )}

                  {/* Cancelled - Show Days Remaining */}
                  {isCancelled && daysRemaining > 0 && (
                    <div className="p-4 rounded-xl" style={{ background: 'rgba(227, 194, 125, 0.1)' }}>
                      <p className="text-[#E3C27D] font-medium mb-1">
                        {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
                      </p>
                      <p className="text-xs text-[#8E8A84]">
                        Access until {formatDate(userData.subscriptionEndDate)}
                      </p>
                    </div>
                  )}

                  {/* Renew Button for Cancelled Subscriptions */}
                  {isCancelled && daysRemaining > 0 ? (
                    <button
                      onClick={handleRenewSubscription}
                      disabled={renewing}
                      className="w-full mt-4 btn-primary disabled:opacity-50"
                    >
                      {renewing ? 'Processing...' : 'Renew Subscription'}
                    </button>
                  ) : isCancelled && daysRemaining === 0 ? (
                    <button
                      onClick={() => router.push('/pricing')}
                      className="w-full mt-4 btn-primary"
                    >
                      Reactivate Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push('/pricing')}
                      className="w-full mt-4 btn-primary"
                    >
                      {userData?.subscriptionStatus === 'trial' ? 'Upgrade Plan' : 'Manage Subscription'}
                    </button>
                  )}
                </div>
              </div>

              {/* Stats Card */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-medium text-[#F4F1ED] mb-4">Your Journey</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#8E8A84]">Total Vows</span>
                    <span className="text-xl font-light text-[#F4F1ED]" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {stats.totalVows || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#8E8A84]">Current Streak</span>
                    <span className="text-xl font-light text-[#F4F1ED]" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {stats.currentStreak || 0} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#8E8A84]">Reflections</span>
                    <span className="text-xl font-light text-[#F4F1ED]" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {stats.totalReflections || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#8E8A84]">Alignment Score</span>
                    <span className="text-xl font-light text-[#F4F1ED]" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {stats.alignmentScore || 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-medium text-[#F4F1ED] mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push('/settings')}
                    className="w-full text-left px-4 py-2 text-[#F4F1ED] hover:bg-[#1a1f2e]/50 rounded-lg transition-colors"
                  >
                    ⚙️ Settings
                  </button>
                  <button
                    onClick={() => router.push('/pricing')}
                    className="w-full text-left px-4 py-2 text-[#F4F1ED] hover:bg-[#1a1f2e]/50 rounded-lg transition-colors"
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
                    className="w-full text-left px-4 py-2 text-[#6E3B3B] hover:bg-[#6E3B3B]/10 rounded-lg transition-colors"
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
