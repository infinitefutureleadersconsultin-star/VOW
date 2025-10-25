import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { showToast } from '../utils/notificationUtils';
import { celebrateMilestone, MILESTONE_KEYS } from '../utils/celebrationUtils';
import { Link2, Clock, ShieldOff, Heart, Sprout, Sparkles } from 'lucide-react';
import { useTranslation } from '../lib/translations';

export default function CreateVowContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  
  const { t } = useTranslation();
  const [vow, setVow] = useState({
    category: '',
    identityType: '',
    boundary: '',
    duration: 30,
    whyMatters: '',
  });

  const categories = [
    {
      name: t('vow.breaking_chains'),
      value: 'addiction',
      icon: Link2,
      desc: t('vow.breaking_chains_desc'),
      color: 'category-addiction'
    },
    {
      name: t('vow.honoring_time'),
      value: 'procrastination',
      icon: Clock,
      desc: t('vow.honoring_time_desc'),
      color: 'category-procrastination'
    },
    {
      name: 'Ending Self-Sabotage',
      value: 'self_sabotage',
      icon: ShieldOff,
      desc: 'Stop blocking your path',
      color: 'category-sabotage'
    },
    {
      name: 'Healing Within',
      value: 'emotional',
      icon: Heart,
      desc: 'Restore inner peace',
      color: 'category-emotional'
    },
    {
      name: 'Building Rituals',
      value: 'habit',
      icon: Sprout,
      desc: 'Create lasting patterns',
      color: 'category-habit'
    },
    {
      name: 'Personal Journey',
      value: 'other',
      icon: Sparkles,
      desc: 'Your unique path',
      color: 'category-other'
    }
  ];

  const durations = [
    { label: '7 Days', value: 7, desc: 'Begin the practice' },
    { label: '30 Days', value: 30, desc: 'Build momentum' },
    { label: '90 Days', value: 90, desc: 'Deep transformation' },
    { label: '365 Days', value: 365, desc: 'Complete evolution' }
  ];

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
        'Your first vow is sealed'
      );
      
      if (message) {
        showToast(message, 'success');
      } else {
        showToast('Vow created successfully', 'success');
      }

      setTimeout(() => router.push('/dashboard'), 1500);

    } catch (error) {
      console.error('Submit error:', error);
      showToast('Failed to create vow. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Your Vow</title>
      </Head>

      <div className="min-h-screen py-12 px-4" style={{ background: 'linear-gradient(135deg, #0C1117 0%, #1a1f2e 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-[#F4F1ED] mb-2 tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
              Create Your Vow
            </h1>
            <p className="text-[#8E8A84]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Fill the void with intention
            </p>
          </div>

          {/* Progress */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-1 mx-1 transition-all duration-500 ${
                    s <= step ? 'bg-[#E3C27D]' : 'bg-[#252b3d]'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-center text-[#8E8A84]">Step {step} of 4</p>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="glass-card rounded-2xl p-8 space-y-6">
                <h2 className="text-2xl font-light text-[#F4F1ED] text-center mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                  What pattern are you transforming?
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleChange('category', cat.value)}
                        className={`glass-button rounded-xl p-6 text-left floating ${cat.color} ${
                          vow.category === cat.value ? 'ring-2 ring-[#E3C27D]' : ''
                        }`}
                      >
                        <Icon size={32} className="text-[#E3C27D] mb-3" strokeWidth={1.5} />
                        <div className="font-medium text-[#F4F1ED] mb-1">{cat.name}</div>
                        <div className="text-sm text-[#8E8A84]">{cat.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="glass-card rounded-2xl p-8 space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-light text-[#F4F1ED] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Fill the void with intention
                  </h2>
                  <p className="text-[#8E8A84]">Define yourself apart from the pattern</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#C8C4BE] mb-3">
                      I'm the type of person that...
                    </label>
                    <input
                      type="text"
                      value={vow.identityType}
                      onChange={(e) => handleChange('identityType', e.target.value)}
                      placeholder="honors time"
                      className="input-glass w-full px-4 py-3 rounded-xl"
                    />
                    <p className="text-xs text-[#8E8A84] mt-2 italic">
                      Example: "honors time" or "values peace" or "seeks clarity"
                    </p>
                  </div>

                  <div className="text-center text-xl text-[#E3C27D] font-light tracking-wider" style={{ fontFamily: "'Playfair Display', serif" }}>
                    therefore,
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#C8C4BE] mb-3">
                      I will never (or always)...
                    </label>
                    <input
                      type="text"
                      value={vow.boundary}
                      onChange={(e) => handleChange('boundary', e.target.value)}
                      placeholder="never delay my purpose again"
                      className="input-glass w-full px-4 py-3 rounded-xl"
                    />
                    <p className="text-xs text-[#8E8A84] mt-2 italic">
                      Example: "never delay my purpose" or "always choose peace"
                    </p>
                  </div>
                </div>

                {vow.identityType && vow.boundary && (
                  <div className="glass-card rounded-xl p-6 mt-6" style={{ 
                    background: 'rgba(227, 194, 125, 0.05)',
                    borderColor: 'rgba(227, 194, 125, 0.2)'
                  }}>
                    <p className="text-sm font-medium text-[#E3C27D] mb-2">Your Vow:</p>
                    <p className="text-lg text-[#F4F1ED] leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
                      "I'm the type of person that <span className="font-semibold text-[#E3C27D]">{vow.identityType}</span>; therefore, I will <span className="font-semibold text-[#E3C27D]">{vow.boundary}</span>."
                    </p>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="glass-card rounded-2xl p-8 space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-light text-[#F4F1ED] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Why does this matter?
                  </h2>
                  <p className="text-[#8E8A84]">Anchor your vow in meaning</p>
                </div>

                <textarea
                  value={vow.whyMatters}
                  onChange={(e) => handleChange('whyMatters', e.target.value)}
                  placeholder="This matters because..."
                  className="input-glass w-full h-40 px-4 py-3 rounded-xl resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-[#8E8A84] text-right">{vow.whyMatters.length}/500</p>
              </div>
            )}

            {step === 4 && (
              <div className="glass-card rounded-2xl p-8 space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-light text-[#F4F1ED] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Choose your commitment
                  </h2>
                  <p className="text-[#8E8A84]">How long will you honor this vow?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {durations.map((dur) => (
                    <button
                      key={dur.value}
                      type="button"
                      onClick={() => handleChange('duration', dur.value)}
                      className={`glass-button rounded-xl p-6 text-center floating ${
                        vow.duration === dur.value ? 'ring-2 ring-[#E3C27D]' : ''
                      }`}
                    >
                      <div className="text-3xl font-light text-[#F4F1ED] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {dur.label}
                      </div>
                      <div className="text-sm text-[#8E8A84]">{dur.desc}</div>
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
                  className="btn-secondary"
                  disabled={submitting}
                >
                  ← Return
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary disabled:opacity-50"
                >
                  {submitting ? 'Sealing...' : 'Seal My Vow'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
