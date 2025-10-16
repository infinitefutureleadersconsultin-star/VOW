import { useState } from 'react';
import { celebrate, MILESTONE_KEYS, hasCelebrated } from '../utils/celebrationUtils';

export default function VowFormV2({ onSubmit, initialData = null, isLoading = false }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // The Void - Identity Declaration
    identityType: initialData?.identityType || '',  // "I'm the type of person that..."
    boundary: initialData?.boundary || '',          // "therefore, I will never/always..."
    
    // Supporting fields
    category: initialData?.category || '',
    duration: initialData?.duration || 30,
    whyMatters: initialData?.whyMatters || '',
    
    // Before/After identity
    beforeIdentity: initialData?.beforeIdentity || '',
    becomingIdentity: initialData?.becomingIdentity || '',
  });

  const [errors, setErrors] = useState({});

  const categories = [
    { label: 'Addiction Recovery', value: 'addiction', icon: '🔗' },
    { label: 'Procrastination', value: 'procrastination', icon: '⏰' },
    { label: 'Self-Sabotage', value: 'self_sabotage', icon: '🛑' },
    { label: 'Emotional Healing', value: 'emotional', icon: '💙' },
    { label: 'Habit Building', value: 'habit', icon: '🌱' },
    { label: 'Other', value: 'other', icon: '✨' },
  ];

  const durations = [
    { label: '7 days', value: 7, desc: 'Test the waters' },
    { label: '30 days', value: 30, desc: 'Build momentum' },
    { label: '90 days', value: 90, desc: 'Deep transformation' },
    { label: '1 year', value: 365, desc: 'Lifetime shift' },
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.category) newErrors.category = 'Please select a category';
    }

    if (step === 2) {
      if (!formData.identityType || formData.identityType.length < 5) {
        newErrors.identityType = 'Describe who you are (at least 5 characters)';
      }
      if (!formData.boundary || formData.boundary.length < 5) {
        newErrors.boundary = 'Define your boundary (at least 5 characters)';
      }
    }

    if (step === 3) {
      if (!formData.whyMatters || formData.whyMatters.length < 10) {
        newErrors.whyMatters = 'Explain why this matters (at least 10 characters)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;

    // Generate full vow statement
    const vowStatement = `I'm the type of person that ${formData.identityType}; therefore, I will ${formData.boundary}.`;

    const vowData = {
      statement: vowStatement,
      identityType: formData.identityType,
      boundary: formData.boundary,
      category: formData.category,
      duration: formData.duration,
      whyMatters: formData.whyMatters,
      beforeIdentity: formData.beforeIdentity,
      becomingIdentity: formData.becomingIdentity,
    };

    // Celebrate first vow!
    if (!hasCelebrated(MILESTONE_KEYS.FIRST_VOW)) {
      celebrate({
        particleCount: 150,
        spread: 90,
      });
    }

    onSubmit(vowData);
  };

  // Render functions for each step
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          What chain are you breaking?
        </h3>
        <p className="text-gray-600">
          Every vow begins with recognizing the pattern
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => handleChange('category', cat.value)}
            className={`glass-card rounded-2xl p-6 text-left floating ${
              formData.category === cat.value
                ? 'ring-2 ring-amber-500 bg-amber-50/50'
                : ''
            }`}
          >
            <div className="text-4xl mb-3">{cat.icon}</div>
            <div className="font-medium text-gray-900">{cat.label}</div>
          </button>
        ))}
      </div>

      {errors.category && (
        <p className="text-sm text-red-600 text-center">{errors.category}</p>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Fill the void with intention
        </h3>
        <p className="text-gray-600">
          Define yourself apart from the pattern
        </p>
      </div>

      {/* The Void Structure */}
      <div className="glass-card rounded-2xl p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            I'm the type of person that...
          </label>
          <input
            type="text"
            value={formData.identityType}
            onChange={(e) => handleChange('identityType', e.target.value)}
            placeholder="honors time"
            className="input-glass w-full"
            disabled={isLoading}
          />
          {errors.identityType && (
            <p className="text-sm text-red-600 mt-2">{errors.identityType}</p>
          )}
          <p className="text-xs text-gray-500 mt-2 italic">
            Example: "honors time" or "values my peace" or "seeks clarity"
          </p>
        </div>

        <div className="flex items-center justify-center py-2">
          <div className="text-2xl text-amber-600 font-light">therefore,</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            I will never (or always)...
          </label>
          <input
            type="text"
            value={formData.boundary}
            onChange={(e) => handleChange('boundary', e.target.value)}
            placeholder="never delay my purpose again"
            className="input-glass w-full"
            disabled={isLoading}
          />
          {errors.boundary && (
            <p className="text-sm text-red-600 mt-2">{errors.boundary}</p>
          )}
          <p className="text-xs text-gray-500 mt-2 italic">
            Example: "never delay my purpose again" or "never abandon myself again"
          </p>
        </div>
      </div>

      {/* Preview */}
      {formData.identityType && formData.boundary && (
        <div className="glass-card rounded-2xl p-6 bg-amber-50/50">
          <div className="text-sm font-medium text-amber-900 mb-2">Your Vow:</div>
          <p className="text-lg text-gray-900 leading-relaxed">
            "I'm the type of person that <span className="font-semibold text-amber-700">{formData.identityType}</span>; therefore, I will <span className="font-semibold text-amber-700">{formData.boundary}</span>."
          </p>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Why does this matter?
        </h3>
        <p className="text-gray-600">
          Anchor your vow in meaning
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <textarea
          value={formData.whyMatters}
          onChange={(e) => handleChange('whyMatters', e.target.value)}
          placeholder="This matters because..."
          className="input-glass w-full h-40 resize-none"
          disabled={isLoading}
          maxLength={500}
        />
        {errors.whyMatters && (
          <p className="text-sm text-red-600 mt-2">{errors.whyMatters}</p>
        )}
        <p className="text-xs text-gray-500 mt-2">
          {formData.whyMatters.length}/500 characters
        </p>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          How long will you honor this?
        </h3>
        <p className="text-gray-600">
          Choose your commitment period
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {durations.map((dur) => (
          <button
            key={dur.value}
            type="button"
            onClick={() => handleChange('duration', dur.value)}
            className={`glass-card rounded-2xl p-6 text-center floating ${
              formData.duration === dur.value
                ? 'ring-2 ring-amber-500 bg-amber-50/50'
                : ''
            }`}
            disabled={isLoading}
          >
            <div className="text-3xl font-light text-gray-900 mb-1">
              {dur.label}
            </div>
            <div className="text-sm text-gray-600">{dur.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      {/* Progress indicator */}
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
        <p className="text-sm text-center text-gray-600">
          Step {step} of 4
        </p>
      </div>

      {/* Step content */}
      <div className="mb-8">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        {step > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            className="btn-secondary"
            disabled={isLoading}
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
            className="btn-primary"
            disabled={isLoading}
          >
            Continue →
          </button>
        ) : (
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Vow...' : 'Create My Vow 🙏'}
          </button>
        )}
      </div>
    </form>
  );
}
