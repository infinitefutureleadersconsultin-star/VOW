import { useState } from 'react';
import { showToast } from '../utils/notificationUtils';
import { useTranslation } from '../lib/translations';

export default function VowForm({ onSubmit, initialData = null, isLoading = false }) {
  const { t } = useTranslation();
  
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
    { label: t('vow.categories.addiction'), value: 'addiction' },
    { label: t('vow.categories.procrastination'), value: 'procrastination' },
    { label: t('vow.categories.self_sabotage'), value: 'self_sabotage' },
    { label: t('vow.categories.emotional'), value: 'emotional' },
    { label: t('vow.categories.habit'), value: 'habit' },
    { label: t('vow.categories.other'), value: 'other' },
  ];

  const durations = [
    { label: t('vow.validation.statement_min') === 'Vow statement must be at least 10 characters' ? '7 days' : '7 días', value: 7 },
    { label: '30 ' + t('common.days'), value: 30 },
    { label: '90 ' + t('common.days'), value: 90 },
    { label: '365 ' + t('common.days'), value: 365 },
  ];

  const validateField = (name, value) => {
    switch (name) {
      case 'statement':
        if (!value || value.trim().length < 10) {
          return t('vow.validation.statement_min');
        }
        if (value.trim().length > 300) {
          return t('vow.validation.statement_max');
        }
        break;
      
      case 'category':
        if (!value) {
          return t('vow.validation.category_required');
        }
        break;
      
      case 'whyMatters':
        if (!value || value.trim().length < 10) {
          return 'Please explain why this matters (at least 10 characters)';
        }
        break;
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          {t('vow.statement_label')}
        </label>
        <textarea
          name="statement"
          value={formData.statement}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={t('vow.statement_placeholder')}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.statement && touched.statement ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
          rows="3"
          disabled={isLoading}
        />
        {errors.statement && touched.statement && (
          <p className="mt-1 text-sm text-red-500">{errors.statement}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('vow.category_label')}
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.category && touched.category ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-amber-500`}
            disabled={isLoading}
          >
            <option value="">{t('vow.category_placeholder')}</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          {errors.category && touched.category && (
            <p className="mt-1 text-sm text-red-500">{errors.category}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('vow.duration_label')}
          </label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500"
            disabled={isLoading}
          >
            {durations.map(dur => (
              <option key={dur.value} value={dur.value}>{dur.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {t('vow.why_matters_label')}
        </label>
        <textarea
          name="whyMatters"
          value={formData.whyMatters}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={t('vow.why_matters_placeholder')}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.whyMatters && touched.whyMatters ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-amber-500`}
          rows="3"
          disabled={isLoading}
        />
        {errors.whyMatters && touched.whyMatters && (
          <p className="mt-1 text-sm text-red-500">{errors.whyMatters}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? t('common.loading') : (initialData ? t('vow.update') : t('vow.submit'))}
      </button>
    </form>
  );
}
