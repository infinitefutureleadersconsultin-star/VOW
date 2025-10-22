import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState('');

  // ✅ NO AUTH CHECKS - Anyone can view pricing
  // If they try to subscribe without auth, API will handle it

  const tiers = [
    {
      id: 'seeker',
      name: 'Seeker',
      icon: '🔍',
      price: 4.99,
      dailyPrice: '0.16',
      description: 'Perfect for getting started',
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
      name: 'Explorer',
      icon: '🌟',
      price: 9.99,
      dailyPrice: '0.33',
      description: 'For dedicated growth',
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
      name: 'Master',
      icon: '👑',
      price: 14.99,
      dailyPrice: '0.50',
      description: 'For transformation leaders',
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
    // Check if user is logged in
    const token = localStorage.getItem('vow_auth_token');
    
    if (!token) {
      // Not logged in - redirect to login with return URL
      router.push(`/login?redirect=/pricing&plan=${plan.id}`);
      return;
    }

    setLoading(true);
    setSelectedPlan(plan.id);
    setError('');

    try {
      // ✅ Go DIRECTLY to Stripe checkout
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tier: plan.id,
          price: plan.price,
          cycle: 'monthly'
        })
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        console.log('[PRICING] Redirecting to Stripe:', data.checkoutUrl);
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.message || 'Failed to start checkout');
      }
    } catch (error) {
      console.error('[PRICING] Checkout error:', error);
      setError(error.message || 'An error occurred. Please try again.');
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C1117] to-[#1A1C1F]">
      <Head>
        <title>Upgrade - VOW Theory</title>
      </Head>

      <nav className="corrective-bg border-b border-[#E3C27D]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="w-16"></div>
            <h1 className="text-lg font-medium text-[#F4F1ED]">Upgrade Your Access</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold awareness-text mb-4">
            Continue Your Journey
          </h2>
          <p className="text-xl observation-text mb-2">
            Your free trial has ended. Choose a plan to keep transforming.
          </p>
          <p className="text-sm text-[#8E8A84]">
            Select a plan below to restore full access
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 text-center text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {tiers.map((tier) => (
            <div
              key={tier.id}
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
                  <span className="text-4xl font-bold awareness-text">${tier.dailyPrice}</span>
                  <span className="text-sm observation-text ml-2">per day</span>
                </div>
                <div className="text-sm text-[#8E8A84]">
                  Billed ${tier.price}/month
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-sm observation-text">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSelectPlan(tier)}
                disabled={loading && selectedPlan === tier.id}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  tier.popular
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700'
                    : 'corrective-bg border-2 border-[#E3C27D]/30 hover:border-amber-400 text-[#F4F1ED]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading && selectedPlan === tier.id ? 'Processing...' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center p-6 rounded-xl bg-[#1A1C1F]/50">
          <p className="text-sm text-[#8E8A84] mb-2">
            🔒 Secure payment powered by Stripe
          </p>
          <p className="text-xs text-[#8E8A84]">
            Cancel anytime. No hidden fees.
          </p>
        </div>
      </div>
    </div>
  );
}
