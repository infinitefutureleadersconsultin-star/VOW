import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { api } from '../utils/apiClient';
import { showToast } from '../utils/notificationUtils';

export default function CreateVow() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [vow, setVow] = useState({
    category: '',
    customCategory: '',
    statement: '',
    duration: 30,
    whyMatters: '',
    beforeIdentity: '',
    becomingIdentity: '',
    dailyReminder: true,
    accountability: 'solo'
  });

  const categories = [
    { name: 'Addiction Recovery', value: 'addiction', emoji: '🕊️' },
    { name: 'Procrastination', value: 'procrastination', emoji: '⚡' },
    { name: 'Self-Sabotage', value: 'self_sabotage', emoji: '🎯' },
    { name: 'Emotional Healing', value: 'emotional', emoji: '💚' },
    { name: 'Habit Building', value: 'habit', emoji: '🌱' },
    { name: 'Other', value: 'other', emoji: '💭' }
  ];

  const durations = [
    { label: '7 days', value: 7 },
    { label: '30 days', value: 30 },
    { label: '90 days', value: 90 },
    { label: '1 year', value: 365 }
  ];

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
      
      const response = await api.get('/userData', {
        timeout: 10000
      });
      
      if (response?.data?.success) {
        setUserData(response.data.data);
      } else {
        throw new Error('Failed to load user data');
      }
    } catch (error) {
      console.error('Load user data error:', error);
      
      if (error.code === 'UNAUTHORIZED') {
        localStorage.removeItem('vow_auth_token');
        showToast('Session expired. Please log in again', 'error');
        router.push('/login');
      } else if (error.code === 'ECONNABORTED') {
        setError('Request timeout. Please check your connection.');
      } else {
        setError('Failed to load your profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setVow(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (error) setError(null);
  };

  const validateStep = () => {
    if (step === 1) {
      if (!vow.category) {
        showToast('Please select a category', 'error');
        return false;
      }
      if (vow.category === 'other' && !vow.customCategory.trim()) {
        showToast('Please describe your vow category', 'error');
        return false;
      }
    }
    
    if (step === 2) {
      if (!vow.statement.trim()) {
        showToast('Please write your vow statement', 'error');
        return false;
      }
      if (vow.statement.length < 10) {
        showToast('Your vow should be at least 10 characters', 'error');
        return false;
      }
      if (!vow.whyMatters.trim()) {
        showToast('Please explain why this vow matters to you', 'error');
        return false;
      }
    }
    
    if (step === 3) {
      if (!vow.beforeIdentity.trim()) {
        showToast('Please describe who you were before', 'error');
        return false;
      }
      if (!vow.becomingIdentity.trim()) {
        showToast('Please describe who you are becoming', 'error');
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) {
      return;
    }
    
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const vowData = {
        category: vow.category === 'other' ? vow.customCategory : vow.category,
        statement: vow.statement.trim(),
        duration: vow.duration,
        whyMatters: vow.whyMatters.trim(),
        beforeIdentity: vow.beforeIdentity.trim(),
        becomingIdentity: vow.becomingIdentity.trim(),
        dailyReminder: vow.dailyReminder,
        accountability: vow.accountability,
        status: 'active',
        startDate: new Date().toISOString(),
        currentDay: 1,
        currentStreak: 0,
        createdAt: new Date().toISOString()
      };

      const response = await api.post('/userData', {
        action: 'create_vow',
        vow: vowData
      }, {
        timeout: 15000
      });

      if (response?.data?.success) {
        showToast('Your vow has been created! 🕊️', 'success');
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        throw new Error(response?.data?.error || 'Failed to create vow');
      }
    } catch (error) {
      console.error('Create vow error:', error);
      
      if (error.code === 'UNAUTHORIZED') {
        localStorage.removeItem('vow_auth_token');
        showToast('Session expired. Please log in again', 'error');
        router.push('/login');
      } else if (error.code === 'ECONNABORTED') {
        setError('Request timeout. Your vow may not have been saved. Please try again.');
        showToast('Timeout. Please try again', 'error');
      } else if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.error || 'Invalid data. Please check your entries.';
        setError(errorMsg);
        showToast(errorMsg, 'error');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again in a moment.');
        showToast('Server error. Please try again', 'error');
      } else {
        const errorMessage = error.response?.data?.error || error.message || 'Failed to create vow';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const progressPercent = (step / 4) * 100;

  return (
    <>
      <Head>
        <title>Create Your Vow - VOW</title>
        <meta name="description" content="Create your daily vow of remembrance" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50">
        {/* Header */}
        <nav className="bg-white border-b border-amber-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-900"
                disabled={submitting}
              >
                ← Back
              </button>
              <h1 className="text-lg font-medium text-gray-900">Create Your Vow</h1>
              <div className="w-16"></div>
            </div>
          </div>
        </nav>

        {/* Progress Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Step {step} of 4</span>
              <span className="text-sm text-gray-600">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-md p-8">
            {/* Step 1: Category */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-light text-gray-900 mb-2">
                  What area are you focusing on?
                </h2>
                <p className="text-gray-600 mb-6">
                  Choose the area where you want to reclaim your identity.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => handleInputChange('category', cat.value)}
                      className={`p-6 border-2 rounded-lg transition-all ${
                        vow.category === cat.value
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="text-4xl mb-2">{cat.emoji}</div>
                      <div className="text-sm font-medium text-gray-900">{cat.name}</div>
                    </button>
                  ))}
                </div>
                
                {vow.category === 'other' && (
                  <div className="mt-4">
                    <input
                      type="text"
                      value={vow.customCategory}
                      onChange={(e) => handleInputChange('customCategory', e.target.value)}
                      placeholder="Describe your focus area..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                      maxLength={50}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Vow Statement */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-light text-gray-900 mb-2">
                  Write your vow statement
                </h2>
                <p className="text-gray-600 mb-6">
                  This is your daily reminder of who you are becoming.
                </p>
                <textarea
                  value={vow.statement}
                  onChange={(e) => handleInputChange('statement', e.target.value)}
                  placeholder="I vow to remember..."
                  className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none mb-4"
                  maxLength={300}
                />
                <p className="text-sm text-gray-500 mb-6">
                  {vow.statement.length}/300 characters
                </p>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Why does this matter to you?
                </h3>
                <textarea
                  value={vow.whyMatters}
                  onChange={(e) => handleInputChange('whyMatters', e.target.value)}
                  placeholder="This matters because..."
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none"
                  maxLength={500}
                />
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {durations.map((duration) => (
                      <button
                        key={duration.value}
                        type="button"
                        onClick={() => handleInputChange('duration', duration.value)}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          vow.duration === duration.value
                            ? 'border-amber-600 bg-amber-50'
                            : 'border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        <div className="text-sm font-medium text-gray-900">{duration.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Identity Transformation */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-light text-gray-900 mb-2">
                  Map your transformation
                </h2>
                <p className="text-gray-600 mb-6">
                  Separate who you were from who you are becoming.
                </p>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Who I was (before)
                  </label>
                  <textarea
                    value={vow.beforeIdentity}
                    onChange={(e) => handleInputChange('beforeIdentity', e.target.value)}
                    placeholder="Before, I was someone who..."
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none"
                    maxLength={300}
                  />
                </div>
                
                <div className="flex justify-center my-4">
                  <div className="text-2xl text-amber-600">→</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Who I am becoming
                  </label>
                  <textarea
                    value={vow.becomingIdentity}
                    onChange={(e) => handleInputChange('becomingIdentity', e.target.value)}
                    placeholder="Now, I am becoming someone who..."
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none"
                    maxLength={300}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Preferences */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl font-light text-gray-900 mb-2">
                  Set your preferences
                </h2>
                <p className="text-gray-600 mb-6">
                  Customize how you'll be supported on this journey.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Daily Reminder</h3>
                      <p className="text-sm text-gray-500">Receive a morning reminder for your vow</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange('dailyReminder', !vow.dailyReminder)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        vow.dailyReminder ? 'bg-amber-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          vow.dailyReminder ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Accountability Level
                    </label>
                    <div className="space-y-2">
                      <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        vow.accountability === 'solo'
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}>
                        <input
                          type="radio"
                          name="accountability"
                          value="solo"
                          checked={vow.accountability === 'solo'}
                          onChange={(e) => handleInputChange('accountability', e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Solo Journey</div>
                          <div className="text-sm text-gray-500">Keep this vow private</div>
                        </div>
                      </label>
                      
                      <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        vow.accountability === 'partner'
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}>
                        <input
                          type="radio"
                          name="accountability"
                          value="partner"
                          checked={vow.accountability === 'partner'}
                          onChange={(e) => handleInputChange('accountability', e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Accountability Partner</div>
                          <div className="text-sm text-gray-500">Share with a trusted person (coming soon)</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                disabled={step === 1 || submitting}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  step === 1 || submitting
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={submitting}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  submitting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-amber-600 text-white hover:bg-amber-700'
                }`}
              >
                {submitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  step === 4 ? 'Create Vow' : 'Next'
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
