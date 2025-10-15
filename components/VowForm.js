import { useState } from 'react';
import { showToast } from '../utils/notificationUtils';

export default function VowForm({ onSubmit, initialData = null, isLoading = false }) {
  const [formData, setFormData] = useState({
    statement: initialData?.statement || '',
    category: initialData?.category || '',
    duration: initialData?.duration || 30,
    whyMatters: initialData?.whyMatters || '',
    beforeIdentity: initialData?.beforeIdentity || '',
    becomingIdentity: initialData?.becomingIdentity || '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const categories = [
    { label: 'Addiction Recovery', value: 'addiction' },
    { label: 'Procrastination', value: 'procrastination' },
    { label: 'Self-Sabotage', value: 'self_sabotage' },
    { label: 'Emotional Healing', value: 'emotional' },
    { label: 'Habit Building', value: 'habit' },
    { label: 'Other', value: 'other' },
  ];

  const durations = [
    { label: '7 days', value: 7 },
    { label: '30 days', value: 30 },
    { label: '90 days', value: 90 },
    { label: '1 year', value: 365 },
  ];

  const validateField = (name, value) => {
    switch (name) {
      case 'statement':
        if (!value || value.trim().length < 10) {
          return 'Vow statement must be at least 10 characters';
        }
        if (value.trim().length > 300) {
          return 'Vow statement must be less than 300 characters';
        }
        break;
      
      case 'category':
        if (!value) {
          return 'Please select a category';
        }
        break;
      
      case 'whyMatters':
        if (!value || value.trim().length < 10) {
          return 'Please explain why this matters (at least 10 characters)';
        }
        break;
      
      case 'beforeIdentity':
        if (!value || value.trim().length < 5) {
          return 'Please describe your before identity (at least 5 characters)';
        }
        break;
      
      case 'becomingIdentity':
        if (!value || value.trim().length < 5) {
          return 'Please describe who you are becoming (at least 5 characters)';
        }
        break;
      
      default:
        return null;
    }
    return null;
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, formData[name]);
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    setTouched({
      statement: true,
      category: true,
      whyMatters: true,
      beforeIdentity: true,
      becomingIdentity: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the errors before submitting', 'error');
      return;
    }

    onSubmit(formData);
  };

  const getFieldError = (name) => {
    return touched[name] && errors[name] ? errors[name] : null;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Vow Statement */}
      <div>
        <label htmlFor="statement" className="block text-sm font-medium text-gray-700 mb-2">
          Your Vow Statement *
        </label>
        <textarea
          id="statement"
          value={formData.statement}
          onChange={(e) => handleChange('statement', e.target.value)}
          onBlur={() => handleBlur('statement')}
          placeholder="I vow to remember..."
          disabled={isLoading}
          className={`w-full h-32 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
            getFieldError('statement') ? 'border-red-300' : 'border-gray-300'
          }`}
          maxLength={300}
        />
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-gray-500">
            {formData.statement.length}/300 characters
          </span>
          {getFieldError('statement') && (
            <span className="text-sm text-red-600">{getFieldError('statement')}</span>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          onBlur={() => handleBlur('category')}
          disabled={isLoading}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
            getFieldError('category') ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Select a category...</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        {getFieldError('category') && (
          <p className="text-sm text-red-600 mt-1">{getFieldError('category')}</p>
        )}
      </div>

      {/* Duration */}
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
          Duration *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {durations.map((dur) => (
            <button
              key={dur.value}
              type="button"
              onClick={() => handleChange('duration', dur.value)}
              disabled={isLoading}
              className={`p-4 border-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                formData.duration === dur.value
                  ? 'border-amber-600 bg-amber-50'
                  : 'border-gray-200 hover:border-amber-300'
              }`}
            >
              <div className="text-sm font-medium text-gray-900">{dur.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Why It Matters */}
      <div>
        <label htmlFor="whyMatters" className="block text-sm font-medium text-gray-700 mb-2">
          Why does this matter to you? *
        </label>
        <textarea
          id="whyMatters"
          value={formData.whyMatters}
          onChange={(e) => handleChange('whyMatters', e.target.value)}
          onBlur={() => handleBlur('whyMatters')}
          placeholder="This matters because..."
          disabled={isLoading}
          className={`w-full h-32 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
            getFieldError('whyMatters') ? 'border-red-300' : 'border-gray-300'
          }`}
          maxLength={500}
        />
        {getFieldError('whyMatters') && (
          <p className="text-sm text-red-600 mt-1">{getFieldError('whyMatters')}</p>
        )}
      </div>

      {/* Identity Transformation */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Identity Transformation</h3>
        
        <div className="space-y-4">
          {/* Before Identity */}
          <div>
            <label htmlFor="beforeIdentity" className="block text-sm font-medium text-gray-700 mb-2">
              Who I was (before) *
            </label>
            <textarea
              id="beforeIdentity"
              value={formData.beforeIdentity}
              onChange={(e) => handleChange('beforeIdentity', e.target.value)}
              onBlur={() => handleBlur('beforeIdentity')}
              placeholder="Before, I was someone who..."
              disabled={isLoading}
              className={`w-full h-24 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                getFieldError('beforeIdentity') ? 'border-red-300' : 'border-gray-300'
              }`}
              maxLength={300}
            />
            {getFieldError('beforeIdentity') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError('beforeIdentity')}</p>
            )}
          </div>

          <div className="flex justify-center">
            <div className="text-2xl text-amber-600">→</div>
          </div>

          {/* Becoming Identity */}
          <div>
            <label htmlFor="becomingIdentity" className="block text-sm font-medium text-gray-700 mb-2">
              Who I am becoming *
            </label>
            <textarea
              id="becomingIdentity"
              value={formData.becomingIdentity}
              onChange={(e) => handleChange('becomingIdentity', e.target.value)}
              onBlur={() => handleBlur('becomingIdentity')}
              placeholder="Now, I am becoming someone who..."
              disabled={isLoading}
              className={`w-full h-24 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                getFieldError('becomingIdentity') ? 'border-red-300' : 'border-gray-300'
              }`}
              maxLength={300}
            />
            {getFieldError('becomingIdentity') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError('becomingIdentity')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-8 py-3 rounded-lg font-medium transition-colors ${
            isLoading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-amber-600 text-white hover:bg-amber-700'
          }`}
        >
          {isLoading ? 'Saving...' : 'Save Vow'}
        </button>
      </div>
    </form>
  );
}
