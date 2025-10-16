import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { showToast } from '../utils/notificationUtils';
import { celebrateMilestone, MILESTONE_KEYS } from '../utils/celebrationUtils';

export default function CreateVow() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  
  const [vow, setVow] = useState({
    category: '',
    identityType: '',
    boundary: '',
    duration: 30,
    whyMatters: '',
  });

  const categories = [
    { name: 'Addiction Recovery', value: 'addiction', emoji: '🔗' },
    { name: 'Procrastination', value: 'procrastination', emoji: '⏰' },
    { name: 'Self-Sabotage', value: 'self_sabotage', emoji: '🛑' },
    { name: 'Emotional Healing', value: 'emotional', emoji: '💙' },
    { name: 'Habit Building', value: 'habit', emoji: '🌱' },
    { name: 'Other', value: 'other', emoji: '✨' }
  ];

  const durations = [
    { label: '7 days', value: 7, desc: 'Test the waters' },
    { label: '30 days', value: 30, desc: 'Build momentum' },
    { label: '90 days', value: 90, desc: 'Deep transformation' },
    { label: '1 year', value: 365, desc: 'Lifetime shift' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('vow_auth_token');
    if (!token) {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [router]);

  const handleChange = (field, value) => {
    setVow(prev => ({ ...
cat > pages/create-vow.js << 'EOF'
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { showToast } from '../utils/notificationUtils';
import { celebrateMilestone, MILESTONE_KEYS } from '../utils/celebrationUtils';

export default function CreateVow() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  
  const [vow, setVow] = useState({
    category: '',
    identityType: '',
    boundary: '',
    duration: 30,
    whyMatters: '',
  });

  const categories = [
    { name: 'Addiction Recovery', value: 'addiction', emoji: '🔗' },
    { name: 'Procrastination', value: 'procrastination', emoji: '⏰' },
    { name: 'Self-Sabotage', value: 'self_sabotage', emoji: '🛑' },
    { name: 'Emotional Healing', value: 'emotional', emoji: '💙' },
    { name: 'Habit Building', value: 'habit', emoji: '🌱' },
    { name: 'Other', value: 'other', emoji: '✨' }
  ];

  const durations = [
    { label: '7 days', value: 7, desc: 'Test the waters' },
    { label: '30 days', value: 30, desc: 'Build momentum' },
    { label: '90 days', value: 90, desc: 'Deep transformation' },
    { label: '1 year', value: 365, desc: 'Lifetime shift' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('vow_auth_token');
    if (!token) {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [router]);

  const handleChange = (field, value) => {
    setVow(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    if (step === 1 && !vow.category) {
      showToast('Please select a category', 'error');
      return false;
    }
    if (step === 2 && (!vow.identityType || !vow.boundary)) {
      showToast('Please fill in both parts of your vow', 'error');
      return false;
    }
    if (step === 3 && !vow.whyMatters) {
      showToast('Please explain why this matters', 'error');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setSubmitting(true);

    try {
      const token = localStorage.getItem('vow_auth_token');
      
      const statement = `I'm the type of person that ${vow.identityType}; therefore, I will ${vow.boundary}.`;

      const vowData = {
        statement,
        identityType: vow.identityType,
        boundary: vow.boundary,
        category: vow.category,
        duration: vow.duration,
        whyMatters: vow.whyMatters,
        status: 'active',
        currentDay: 0,
        currentStreak: 0,
        longestStreak: 0,
      };

      const response = await fetch('/api/vowSubmit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vow: vowData }),
      });

      if (!response.ok) throw new Error('Failed to create vow');

      const message = celebrateMilestone(
        MILESTONE_KEYS.FIRST_VOW,
        '🎉 Your first vow is created!'
      );
      
      if (message) {
        showToast(message, 'success');
      } else {
        showToast('Vow created successfully!', 'success');
      }

      setTimeout(() => router.push('/dashboard'), 1500);

    } catch (error) {
      console.error('Submit error:', error);
      showToast('Failed to create vow. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50/30 to-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Create Your Vow - VOW</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50/30 to-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Vow</h1>
            <p className="text-gray-600">Fill the void with intention</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-2 rounded-full mx-1 transition-all ${
                    s <= step ? 'bg-amber-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-center text-gray-600">Step {step} of 4</p>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="glass-card rounded-2xl p-8 space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
                  What chain are you breaking?
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => handleChange('category', cat.value)}
                      className={`glass-button rounded-xl p-6 text-left floating ${
                        vow.category === cat.value ? 'ring-2 ring-amber-500' : ''
                      }`}
                    >
                      <div className="text-4xl mb-2">{cat.emoji}</div>
                      <div className="font-medium text-gray-900">{cat.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="glass-card rounded-2xl p-8 space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Fill the void with intention
                  </h2>
                  <p className="text-gray-600">Define yourself apart from the pattern</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      I'm the type of person that...
                    </label>
                    <input
                      type="text"
                      value={vow.identityType}
                      onChange={(e) => handleChange('identityType', e.target.value)}
                      placeholder="honors time"
                      className="input-glass w-full px-4 py-3 rounded-xl"
                    />
                    <p className="text-xs text-gray-500 mt-2 italic">
                      Example: "honors time" or "values my peace" or "seeks clarity"
                    </p>
                  </div>

                  <div className="text-center text-2xl text-amber-600 font-light">
                    therefore,
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      I will never (or always)...
                    </label>
                    <input
                      type="text"
                      value={vow.boundary}
                      onChange={(e) => handleChange('boundary', e.target.value)}
                      placeholder="never delay my purpose again"
                      className="input-glass w-full px-4 py-3 rounded-xl"
                    />
                    <p className="text-xs text-gray-500 mt-2 italic">
                      Example: "never delay my purpose again" or "always choose my peace"
                    </p>
                  </div>
                </div>

                {vow.identityType && vow.boundary && (
                  <div className="glass-card rounded-xl p-6 bg-amber-50/50 mt-6">
                    <p className="text-sm font-medium text-amber-900 mb-2">Your Vow:</p>
                    <p className="text-lg text-gray-900 leading-relaxed">
                      "I'm the type of person that <span className="font-semibold text-amber-700">{vow.identityType}</span>; therefore, I will <span className="font-semibold text-amber-700">{vow.boundary}</span>."
                    </p>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="glass-card rounded-2xl p-8 space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Why does this matter?
                  </h2>
                  <p className="text-gray-600">Anchor your vow in meaning</p>
                </div>

                <textarea
                  value={vow.whyMatters}
                  onChange={(e) => handleChange('whyMatters', e.target.value)}
                  placeholder="This matters because..."
                  className="input-glass w-full h-40 px-4 py-3 rounded-xl resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500">{vow.whyMatters.length}/500</p>
              </div>
            )}

            {step === 4 && (
              <div className="glass-card rounded-2xl p-8 space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    How long will you honor this?
                  </h2>
                  <p className="text-gray-600">Choose your commitment period</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {durations.map((dur) => (
                    <button
                      key={dur.value}
                      type="button"
                      onClick={() => handleChange('duration', dur.value)}
                      className={`glass-button rounded-xl p-6 text-center floating ${
                        vow.duration === dur.value ? 'ring-2 ring-amber-500' : ''
                      }`}
                    >
                      <div className="text-3xl font-light text-gray-900 mb-1">
                        {dur.label}
                      </div>
                      <div className="text-sm text-gray-600">{dur.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-8">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="glass-button px-6 py-3 rounded-xl font-medium"
                  disabled={submitting}
                >
                  ← Back
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-amber-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-amber-700 transition-colors"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-amber-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create My Vow 🙏'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
