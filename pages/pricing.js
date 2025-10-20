/**
 * Pricing Page
 * Display pricing tiers and upgrade options
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { loadAuthToken } from '../lib/storage';
import { getTierFeatures, getUserTier } from '../lib/featureAccess';

export default function PricingPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTier, setCurrentTier] = useState('trial');
  const [billingCycle, setBillingCycle] = useState('monthly');

  useEffect(() => {
    const token = loadAuthToken();
    if (token) {
      setIsAuthenticated(true);
      loadUserTier();
    }
  }, []);

  const loadUserTier = async () => {
    try {
      const token = loadAuthToken();
      const response = await fetch('/api/userData', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentTier(getUserTier(data.data));
      }
    } catch (error) {
      console.error('Failed to load user tier:', error);
    }
  };

  const tiers = [
    {
      id: 'trial',
      name: 'Free Trial',
      icon: '🌱',
      price: 0,
      period: 'forever',
      description: 'Start your remembrance journey',
      features: [
        'Create up to 5 active vows',
        'Daily reflections',
        'Basic trigger tracking',
        'Progress tracking',
        '7-day streak tracking',
        'Mobile access'
      ],
      limitations: [
        'Limited AI insights',
        'No pattern analysis',
        'No data export',
        'No priority support'
      ],
      cta: 'Current Plan',
      disabled: currentTier === 'trial'
    },
    {
      id: 'seeker',
      name: 'Seeker',
      icon: '🔍',
      price: billingCycle === 'monthly' ? 9.99 : 99,
      period: billingCycle === 'monthly' ? 'per month' : 'per year',
      description: 'For committed practitioners',
      popular: true,
      features: [
        'Unlimited vows',
        'Unlimited reflections',
        'Full trigger tracking',
        'AI-powered insights',
        'Pattern analysis',
        'Weekly summaries',
        'Unlimited streak tracking',
        'Priority email support',
        'Data export (JSON, CSV)',
        'Custom reminders'
      ],
      cta: currentTier === 'seeker' ? 'Current Plan' : 'Upgrade to Seeker',
      disabled: currentTier === 'seeker' || currentTier === 'master'
    },
    {
      id: 'master',
      name: 'Master',
      icon: '👑',
      price: billingCycle === 'monthly' ? 19.99 : 199,
      period: billingCycle === 'monthly' ? 'per month' : 'per year',
      description: 'For transformation leaders',
      features: [
        'Everything in Seeker',
        'Advanced AI coaching',
        'Deep pattern analysis',
        'Custom integration vows',
        'Monthly video reviews',
        'Priority phone support',
        'Private community access',
        'Early feature access',
        'Personalized guidance',
        '1-on-1 coaching session/month'
      ],
      cta: currentTier === 'master' ? 'Current Plan' : 'Upgrade to Master',
      disabled: currentTier === 'master'
    }
  ];

  const savings = billingCycle === 'yearly' ? '17% off' : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50">
      <Head>
        <title>Pricing - VOW Theory</title>
      </Head>

      {/* Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push(isAuthenticated ? '/dashboard' : '/')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <h1 className="text-lg font-medium text-gray-900">Pricing</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold awareness-text mb-4">
            Choose Your Path
          </h2>
          <p className="text-xl observation-text mb-8">
            Daily remembrance creates lasting change. Start free, upgrade anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center space-x-4 p-2 rounded-lg bg-white shadow-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-amber-100 to-amber-50 text-gray-900'
                  : 'text-gray-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-amber-100 to-amber-50 text-gray-900'
                  : 'text-gray-600'
              }`}
            >
              Yearly
              {savings && (
                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                  {savings}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {tiers.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              isAuthenticated={isAuthenticated}
              onSelect={() => handleSelectTier(tier.id)}
            />
          ))}
        </div>

        {/* Features Comparison */}
        <div className="separation-card rounded-xl p-8 mb-12">
          <h3 className="text-2xl font-bold awareness-text mb-6 text-center">
            Feature Comparison
          </h3>
          <FeatureComparison tiers={tiers} />
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold awareness-text mb-6 text-center">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            <FAQItem
              question="Can I change plans later?"
              answer="Yes! You can upgrade or downgrade anytime. Changes take effect immediately for upgrades, or at the end of your billing cycle for downgrades."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards, debit cards, and PayPal. All payments are processed securely through Stripe."
            />
            <FAQItem
              question="Can I cancel anytime?"
              answer="Absolutely. Cancel anytime with no penalties. You'll continue to have access until the end of your paid period."
            />
            <FAQItem
              question="What happens to my data if I downgrade?"
              answer="Your data is never deleted. If you downgrade, some features become limited but all your vows and reflections remain accessible."
            />
            <FAQItem
              question="Is there a refund policy?"
              answer="We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, we'll refund your payment in full."
            />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12 p-8 rounded-xl" style={{ background: 'linear-gradient(135deg, #C6A66420 0%, #5FD3A540 100%)' }}>
          <h3 className="text-2xl font-bold awareness-text mb-3">
            Ready to Transform?
          </h3>
          <p className="observation-text mb-6">
            Join thousands who are remembering who they truly are.
          </p>
          {!isAuthenticated && (
            <button
              onClick={() => router.push('/signup')}
              className="px-8 py-4 rounded-lg font-medium text-white text-lg"
              style={{ backgroundColor: '#C6A664' }}
            >
              Start Free Trial
            </button>
          )}
        </div>
      </div>
    </div>
  );

  function handleSelectTier(tierId) {
    if (!isAuthenticated) {
      router.push('/signup');
      return;
    }

    if (tierId === 'trial') {
      return; // Already on trial
    }

    // In production, this would redirect to payment flow
    alert(`Upgrade to ${tierId} - Payment integration coming soon!`);
  }
}

function PricingCard({ tier, isAuthenticated, onSelect }) {
  return (
    <div 
      className={`separation-card rounded-xl p-6 transition-all hover:shadow-xl ${
        tier.popular ? 'ring-2 ring-amber-400 relative' : ''
      }`}
    >
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="px-4 py-1 rounded-full bg-amber-400 text-white text-xs font-bold">
            MOST POPULAR
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <div className="text-5xl mb-3">{tier.icon}</div>
        <h3 className="text-2xl font-bold awareness-text mb-2">{tier.name}</h3>
        <p className="text-sm observation-text mb-4">{tier.description}</p>
        <div className="mb-2">
          <span className="text-4xl font-bold awareness-text">${tier.price}</span>
          <span className="text-sm observation-text ml-2">{tier.period}</span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {tier.features.map((feature, i) => (
          <div key={i} className="flex items-start space-x-2">
            <span className="text-green-600 mt-1">✓</span>
            <span className="text-sm observation-text">{feature}</span>
          </div>
        ))}
        {tier.limitations?.map((limitation, i) => (
          <div key={i} className="flex items-start space-x-2">
            <span className="text-gray-400 mt-1">✗</span>
            <span className="text-sm text-gray-400">{limitation}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onSelect}
        disabled={tier.disabled}
        className={`w-full py-3 rounded-lg font-medium transition-all ${
          tier.disabled
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : tier.popular
            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700'
            : 'bg-white border-2 border-gray-300 hover:border-amber-400'
        }`}
      >
        {tier.cta}
      </button>
    </div>
  );
}

function FeatureComparison({ tiers }) {
  const allFeatures = [
    { name: 'Active vows', trial: '5', seeker: '∞', master: '∞' },
    { name: 'Reflections', trial: '∞', seeker: '∞', master: '∞' },
    { name: 'AI insights', trial: 'Basic', seeker: 'Advanced', master: 'Expert' },
    { name: 'Pattern analysis', trial: '—', seeker: '✓', master: '✓' },
    { name: 'Data export', trial: '—', seeker: '✓', master: '✓' },
    { name: 'Weekly summaries', trial: '—', seeker: '✓', master: '✓' },
    { name: 'Priority support', trial: '—', seeker: 'Email', master: 'Phone' },
    { name: '1-on-1 coaching', trial: '—', seeker: '—', master: '1/month' }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left py-3 px-4 font-medium awareness-text">Feature</th>
            <th className="text-center py-3 px-4 font-medium awareness-text">Free</th>
            <th className="text-center py-3 px-4 font-medium awareness-text">Seeker</th>
            <th className="text-center py-3 px-4 font-medium awareness-text">Master</th>
          </tr>
        </thead>
        <tbody>
          {allFeatures.map((feature, i) => (
            <tr key={i} className="border-b border-gray-100">
              <td className="py-3 px-4 text-sm observation-text">{feature.name}</td>
              <td className="py-3 px-4 text-sm text-center">{feature.trial}</td>
              <td className="py-3 px-4 text-sm text-center">{feature.seeker}</td>
              <td className="py-3 px-4 text-sm text-center">{feature.master}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="separation-card rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="font-medium awareness-text">{question}</span>
        <span className="text-xl">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          <p className="text-sm observation-text">{answer}</p>
        </div>
      )}
    </div>
  );
}
