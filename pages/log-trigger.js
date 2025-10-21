import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { api } from '../utils/apiClient';
import { showToast } from '../utils/notificationUtils';

export default function LogTrigger() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [trigger, setTrigger] = useState({
    type: '',
    intensity: 5,
    location: '',
    context: '',
    emotion: '',
    response: '',
    notes: ''
  });

  const triggerTypes = [
    { name: 'Stress', emoji: '😰', value: 'stress' },
    { name: 'Boredom', emoji: '😐', value: 'boredom' },
    { name: 'Loneliness', emoji: '😔', value: 'loneliness' },
    { name: 'Anger', emoji: '😠', value: 'anger' },
    { name: 'Anxiety', emoji: '😨', value: 'anxiety' },
    { name: 'Social', emoji: '👥', value: 'social' },
    { name: 'Environmental', emoji: '🌆', value: 'environmental' },
    { name: 'Other', emoji: '💭', value: 'other' }
  ];

  const emotions = [
    'Fear', 'Shame', 'Guilt', 'Sadness', 'Anger', 'Frustration', 
    'Overwhelmed', 'Helpless', 'Anxious', 'Restless', 'Empty', 'Other'
  ];

  const responses = [
    { label: 'I observed it without acting', value: 'observed' },
    { label: 'I delayed the urge for 5+ minutes', value: 'delayed' },
    { label: 'I distracted myself successfully', value: 'distracted' },
    { label: 'I used my vow to re-center', value: 'vow_centered' },
    { label: 'I gave in to the urge', value: 'acted_on' },
    { label: 'I\'m still experiencing it now', value: 'current' }
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
    setTrigger(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!trigger.type) {
      showToast('Please select a trigger type', 'error');
      return false;
    }
    
    if (!trigger.context.trim()) {
      showToast('Please describe what happened', 'error');
      return false;
    }
    
    if (trigger.context.length < 10) {
      showToast('Please provide more detail (at least 10 characters)', 'error');
      return false;
    }
    
    if (!trigger.emotion) {
      showToast('Please select an emotion', 'error');
      return false;
    }
    
    if (!trigger.response) {
      showToast('Please select how you responded', 'error');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const triggerData = {
        ...trigger,
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
        userId: userData?.id || null
      };

      const response = await api.post('/triggerLogging', {
        action: 'log',
        trigger: triggerData
      }, {
        timeout: 15000
      });

      if (response?.data?.success) {
        showToast('Trigger logged. You are not your urges. 🙏', 'success');
        
        // Reset form
        setTrigger({
          type: '',
          intensity: 5,
          location: '',
          context: '',
          emotion: '',
          response: '',
          notes: ''
        });
        
        // Redirect after a moment
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        throw new Error(response?.data?.error || 'Failed to log trigger');
      }
    } catch (error) {
      console.error('Submit trigger error:', error);
      
      if (error.code === 'UNAUTHORIZED') {
        localStorage.removeItem('vow_auth_token');
        showToast('Session expired. Please log in again', 'error');
        router.push('/login');
      } else if (error.code === 'ECONNABORTED') {
        setError('Request timeout. Your trigger may not have been saved. Please try again.');
        showToast('Timeout. Please try again', 'error');
      } else if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.error || 'Invalid data. Please check your entries.';
        setError(errorMsg);
        showToast(errorMsg, 'error');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again in a moment.');
        showToast('Server error. Please try again', 'error');
      } else {
        const errorMessage = error.response?.data?.error || error.message || 'Failed to log trigger';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0C1117] to-[#1A1C1F] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-[#8E8A84]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Log Trigger - VOW</title>
        <meta name="description" content="Log an urge without judgment" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-[#0C1117] to-[#1A1C1F]">
        {/* Header */}
        <nav className="corrective-bg border-b border-[#E3C27D]/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-[#8E8A84] hover:text-[#F4F1ED]"
              >
                ← Back
              </button>
              <h1 className="text-lg font-medium text-[#F4F1ED]">Log a Trigger</h1>
              <div className="w-16"></div>
            </div>
          </div>
        </nav>

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
          <div className="corrective-bg rounded-xl shadow-md p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-light text-[#F4F1ED] mb-2">
                Awareness without judgment
              </h2>
              <p className="text-[#8E8A84]">
                Logging your triggers helps you understand patterns. You are not your urges — you are the one observing them.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Trigger Type */}
              <div>
                <label className="block text-sm font-medium text-[#E8E6E3] mb-4">
                  What triggered you? *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {triggerTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange('type', type.value)}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        trigger.type === type.value
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-[#E3C27D]/20 hover:border-amber-300'
                      }`}
                    >
                      <div className="text-3xl mb-1">{type.emoji}</div>
                      <div className="text-xs font-medium text-[#F4F1ED]">{type.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity */}
              <div>
                <label className="block text-sm font-medium text-[#E8E6E3] mb-2">
                  Intensity (1-10) *
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={trigger.intensity}
                    onChange={(e) => handleInputChange('intensity', parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-2xl font-light text-[#F4F1ED] w-12 text-center">
                    {trigger.intensity}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#8E8A84] mt-1">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Intense</span>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-[#E8E6E3] mb-2">
                  Where were you?
                </label>
                <input
                  type="text"
                  value={trigger.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Home, work, social event..."
                  className="w-full text-[#F4F1ED] px-4 py-3 border border-[#E3C27D]/30 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  maxLength={100}
                />
              </div>

              {/* Context */}
              <div>
                <label className="block text-sm font-medium text-[#E8E6E3] mb-2">
                  What happened? *
                </label>
                <textarea
                  value={trigger.context}
                  onChange={(e) => handleInputChange('context', e.target.value)}
                  placeholder="I was triggered when..."
                  className="w-full text-[#F4F1ED] h-32 px-4 py-3 border border-[#E3C27D]/30 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none"
                  maxLength={500}
                  required
                />
                <p className="text-sm text-[#8E8A84] mt-1">
                  {trigger.context.length}/500 characters
                </p>
              </div>

              {/* Emotion */}
              <div>
                <label className="block text-sm font-medium text-[#E8E6E3] mb-2">
                  What emotion was beneath it? *
                </label>
                <select
                  value={trigger.emotion}
                  onChange={(e) => handleInputChange('emotion', e.target.value)}
                  className="w-full text-[#F4F1ED] px-4 py-3 border border-[#E3C27D]/30 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  required
                >
                  <option value="">Select an emotion...</option>
                  {emotions.map((emotion) => (
                    <option key={emotion} value={emotion.toLowerCase()}>
                      {emotion}
                    </option>
                  ))}
                </select>
              </div>

              {/* Response */}
              <div>
                <label className="block text-sm font-medium text-[#E8E6E3] mb-2">
                  How did you respond? *
                </label>
                <div className="space-y-2">
                  {responses.map((response) => (
                    <label
                      key={response.value}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        trigger.response === response.value
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-[#E3C27D]/20 hover:border-amber-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="response"
                        value={response.value}
                        checked={trigger.response === response.value}
                        onChange={(e) => handleInputChange('response', e.target.value)}
                        className="mr-3"
                      />
                      <span className="text-sm text-[#F4F1ED]">{response.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-[#E8E6E3] mb-2">
                  Additional notes (optional)
                </label>
                <textarea
                  value={trigger.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any other observations..."
                  className="w-full text-[#F4F1ED] h-24 px-4 py-3 border border-[#E3C27D]/30 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none"
                  maxLength={300}
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 text-[#E8E6E3] hover:text-[#F4F1ED] font-medium"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-8 py-3 rounded-lg font-medium transition-colors ${
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
                      Logging...
                    </span>
                  ) : (
                    'Log Trigger'
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}
