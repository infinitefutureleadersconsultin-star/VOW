import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useTranslation } from '../lib/translations';

export default function PricingPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState('');

  const tiers = [
    {
      id: 'seeker',
      name: t('pricing.tiers.seeker.name') || 'Seeker',
      icon: '🔍',
      price: 4.99,
      dailyPrice: '0.16',
      description: t('pricing.tiers.seeker.description') || 'Perfect for getting started',
      popular: true,
      features: [
        'Unlimited vows',
        'Unlimited reflections',
        'Full trigger tracking',
        'AI-powered insights',
        'Pattern analysis',
        'Weekly summaries',
        'Priority email support',
        'Data export'
      ]
    },
    {
      id: 'explorer',
      name: t('pricing.tiers.explorer.name') || 'Explorer',
      icon: '🌟',
      price: 9.99,
      dailyPrice: '0.33',
      description: t('pricing.tiers.explorer.description') || 'For dedicated growth',
      features: [
        'Everything in Seeker',
        'Advanced AI coaching',
        'Deep pattern analysis',
        'Custom integration vows',
        'Bi-weekly video reviews',
        'Priority phone support',
        'Advanced analytics',
        'Community access'
      ]
    },
    {
      id: 'master',
      name: t('pricing.tiers.master.name') || 'Master',
      icon: '👑',
      price: 14.99,
      dailyPrice: '0.50',
      description: t('pricing.tiers.master.description') || 'For transformation leaders',
      features: [
        'Everything in Explorer',
        'Premium AI coaching',
        'Monthly video reviews',
        '24/7 priority support',
        'Private community access',
        'Early feature access',
        '1-on-1 coaching session/month'
      ]
    }
  ];

  const handleSelectPlan = async (plan) => {
    const token = localStorage.getItem('vow_auth_token');
    
    if (!token) {
      router.push(`/login?redirect=/pricing&plan=${plan.id}`);
      return;
    }

    setLoading(true);
    setSelectedPlan(plan.id);
    setError('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tier: plan.id,
          price: plan.price,
          cycle: 'monthly',
          language: language
        })
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.message || t('errors.server_error'));
        setLoading(false);
        setSelectedPlan(null);
      }
    } catch (error) {
      console.error('[PRICING] Subscribe error:', error);
      setError(t('errors.server_error'));
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50">
      <Head>
        <title>{t('pricing.title')} - VOW</title>
      </Head>

      <nav className="border-b border-amber-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <img src="/logo.svg" alt="VOW" className="h-10" />
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              {t('common.back')}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('pricing.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('pricing.subtitle')}
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-white rounded-2xl shadow-xl border-2 ${
                tier.popular ? 'border-amber-500' : 'border-gray-200'
              } p-8 flex flex-col`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  {t('pricing.popular')}
                </div>
              )}

              <div className="text-center mb-6">
                <div className="text-4xl mb-2">{tier.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {tier.name}
                </h3>
                <p className="text-gray-600 text-sm">{tier.description}</p>
              </div>

              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900">
                  ${tier.price}
                </div>
                <div className="text-gray-600">
                  {t('pricing.per_month')} · ${tier.dailyPrice}{t('pricing.per_day')}
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(tier)}
                disabled={loading && selectedPlan === tier.id}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  tier.popular
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading && selectedPlan === tier.id
                  ? t('common.loading')
                  : t('pricing.select_plan')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
