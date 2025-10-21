import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { api } from '../utils/apiClient';
import { canUseAI, trackAIUsage } from '../lib/aiUsageTracker';
import { showToast } from '../utils/notificationUtils';
import { generateEmbodimentReminder } from '../utils/identityUtils';

export default function Reflection() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);
  const [step, setStep] = useState(1);
  const [reflection, setReflection] = useState({
    vowAlignment: '',
    emotionalState: '',
    challenges: '',
    insights: '',
    gratitude: '',
    tomorrowCommitment: ''
  });
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [error, setError] = useState(null);

  const emotions = [
    { name: 'Peaceful', emoji: '😌', value: 'peaceful' },
    { name: 'Strong', emoji: '💪', value: 'strong' },
    { name: 'Grateful', emoji: '🙏', value: 'grateful' },
    { name: 'Challenged', emoji: '😓', value: 'challenged' },
    { name: 'Uncertain', emoji: '🤔', value: 'uncertain' },
    { name: 'Overwhelmed', emoji: '😰', value: 'overwhelmed' }
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
        timeout: 10000 // 10 second timeout
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
    setReflection(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    // Validate current step
    if (step === 1 && !reflection.vowAlignment.trim()) {
      showToast('Please share how you honored your vow today', 'error');
      return;
    }
    
    if (step === 2 && !selectedEmotion) {
      showToast('Please select your emotional state', 'error');
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
    try {
      setSubmitting(true);
      setError(null);

      const reflectionData = {
        ...reflection,
        emotionalState: selectedEmotion,
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
      };

      const response = await api.post('/userData', {
        action: 'save_reflection',
        reflection: reflectionData
      }, {
        timeout: 15000 // 15 second timeout
      });

      if (response?.data?.success) {
        showToast('Reflection saved successfully! 🙏', 'success');if(userData?.userId&&canUseAI(userData.userId,'reflection')){try{const aiResp=await api.post('/vowReflect',{type:'reflection',data:reflectionData});if(aiResp?.data?.success){trackAIUsage(userData.userId,'reflection');showToast('✨ AI insight!','success')}}catch(e){console.log(e)}}
        
        // Wait a moment before redirecting
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        throw new Error(response?.data?.error || 'Failed to save reflection');
      }
    } catch (error) {
      console.error('Submit reflection error:', error);
      
      if (error.code === 'UNAUTHORIZED') {
        localStorage.removeItem('vow_auth_token');
        showToast('Session expired. Please log in again', 'error');
        router.push('/login');
      } else if (error.code === 'ECONNABORTED') {
        setError('Request timeout. Your reflection may not have been saved.');
        showToast('Timeout. Please try again', 'error');
      } else {
        const errorMessage = error.response?.data?.error || error.message || 'Failed to save reflection';
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
          <p className="text-[#8E8A84]">Loading reflection...</p>
        </div>
      </div>
    );
  }

  const progressPercent = (step / 4) * 100;

  return (
    <>
      <Head>
        <title>Daily Reflection - VOW</title>
        <meta name="description" content="Reflect on your journey" />
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
              <h1 className="text-lg font-medium text-[#F4F1ED]">Daily Reflection</h1>
              <div className="w-16"></div>
            </div>
          </div>
        </nav>

        {/* Progress Bar */}
        <div className="corrective-bg border-b border-[#E3C27D]/20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#8E8A84]">Step {step} of 4</span>
              <span className="text-sm text-[#8E8A84]">{Math.round(progressPercent)}%</span>
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
          <div className="corrective-bg rounded-xl shadow-md p-8">
            {/* Step 1: Vow Alignment */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-light text-[#F4F1ED] mb-2">
                  How did you honor your vow today?
                </h2>
                <p className="text-[#8E8A84] mb-6">
                  Reflect on the moments you stayed aligned with who you're becoming.
                </p>
                <textarea
                  value={reflection.vowAlignment}
                  onChange={(e) => handleInputChange('vowAlignment', e.target.value)}
                  placeholder="I honored my vow by..."
                  className="w-full h-40 px-4 py-3 border border-[#E3C27D]/30 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none"
                  maxLength={500}
                />
                <p className="text-sm text-[#8E8A84] mt-2">
                  {reflection.vowAlignment.length}/500 characters
                </p>
              </div>
            )}

            {/* Step 2: Emotional State */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-light text-[#F4F1ED] mb-2">
                  How are you feeling right now?
                </h2>
                <p className="text-[#8E8A84] mb-6">
                  Name your emotion without judgment. Awareness is transformation.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {emotions.map((emotion) => (
                    <button
                      key={emotion.value}
                      onClick={() => setSelectedEmotion(emotion.value)}
                      className={`p-6 border-2 rounded-lg transition-all ${
                        selectedEmotion === emotion.value
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-[#E3C27D]/20 hover:border-amber-300'
                      }`}
                    >
                      <div className="text-4xl mb-2">{emotion.emoji}</div>
                      <div className="text-sm font-medium text-[#F4F1ED]">{emotion.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Challenges & Insights */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-light text-[#F4F1ED] mb-2">
                  What challenged you today?
                </h2>
                <p className="text-[#8E8A84] mb-6">
                  Identify the moments that tested you. What did they teach you?
                </p>
                <textarea
                  value={reflection.challenges}
                  onChange={(e) => handleInputChange('challenges', e.target.value)}
                  placeholder="Today I was challenged by..."
                  className="w-full h-32 px-4 py-3 border border-[#E3C27D]/30 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none mb-4"
                  maxLength={500}
                />
                
                <h3 className="text-lg font-medium text-[#F4F1ED] mb-2 mt-6">
                  What insight did you gain?
                </h3>
                <textarea
                  value={reflection.insights}
                  onChange={(e) => handleInputChange('insights', e.target.value)}
                  placeholder="I learned that..."
                  className="w-full h-32 px-4 py-3 border border-[#E3C27D]/30 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none"
                  maxLength={500}
                />
              </div>
            )}

            {/* Step 4: Gratitude & Tomorrow */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl font-light text-[#F4F1ED] mb-2">
                  What are you grateful for today?
                </h2>
                <p className="text-[#8E8A84] mb-6">
                  Even in difficulty, there is always something to honor.
                </p>
                <textarea
                  value={reflection.gratitude}
                  onChange={(e) => handleInputChange('gratitude', e.target.value)}
                  placeholder="I am grateful for..."
                  className="w-full h-32 px-4 py-3 border border-[#E3C27D]/30 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none mb-4"
                  maxLength={500}
                />
                
                <h3 className="text-lg font-medium text-[#F4F1ED] mb-2 mt-6">
                  How will you honor your vow tomorrow?
                </h3>
                <textarea
                  value={reflection.tomorrowCommitment}
                  onChange={(e) => handleInputChange('tomorrowCommitment', e.target.value)}
                  placeholder="Tomorrow, I will..."
                  className="w-full h-32 px-4 py-3 border border-[#E3C27D]/30 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none"
                  maxLength={500}
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                disabled={step === 1 || submitting}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  step === 1 || submitting
                    ? 'bg-[#2A2C2F] text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-[#E8E6E3] hover:bg-gray-300'
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
                    Saving...
                  </span>
                ) : (
                  step === 4 ? 'Complete Reflection' : 'Next'
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
