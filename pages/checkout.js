/**
 * Checkout Page
 * Redirect to Stripe Checkout for payment
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { loadAuthToken } from '../lib/storage';

export default function CheckoutPage() {
  const router = useRouter();
  const { tier, price, cycle } = router.query;
  
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = loadAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }

    if (!tier || !price || !cycle) {
      router.push('/pricing');
      return;
    }

    loadUserData();
  }, [tier, price, cycle]);

  const loadUserData = async () => {
    try {
      const token = loadAuthToken();
      const response = await fetch('/api/userData', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.data);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const planDetails = {
    seeker: {
      name: 'Seeker',
      icon: '🔍',
      dailyPrice: cycle === 'yearly' ? '0.14' : '0.16',
      features: [
        'Unlimited vows',
        'Unlimited reflections',
        'AI-powered insights',
        'Pattern analysis',
        'Weekly summaries',
        'Priority email support'
      ]
    },
    explorer: {
      name: 'Explorer',
      icon: '🌟',
      dailyPrice: cycle === 'yearly' ? '0.27' : '0.33',
      features: [
        'Everything in Seeker',
        'Advanced AI coaching',
        'Deep pattern analysis',
        'Bi-weekly video reviews',
        'Priority phone support',
        'Advanced analytics'
      ]
    },
    master: {
      name: 'Master',
      icon: '👑',
      dailyPrice: cycle === 'yearly' ? '0.55' : '0.66',
      features: [
        'Everything in Explorer',
        'Premium AI coaching',
        'Monthly video reviews',
        '24/7 priority support',
        'Private community access',
        '1-on-1 coaching session/month'
      ]
    }
  };

  const currentPlan = planDetails[tier] || planDetails.seeker;
  const billingPeriod = cycle === 'yearly' ? 'per year' : 'per month';

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const token = loadAuthToken();
      
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tier,
          price,
          cycle
        })
      });

      const data = await response.json();

      if (response.ok && data.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.message || 'Failed to start checkout. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (!tier || !price || !cycle) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C1117] to-[#1A1C1F]">
      <Head>
        <title>Checkout - VOW Theory</title>
      </Head>

      {/* Header */}
      <nav className="corrective-bg border-b border-[#E3C27D]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push('/pricing')}
              className="text-[#8E8A84] hover:text-[#F4F1ED]"
              disabled={loading}
            >
              ← Back to Pricing
            </button>
            <h1 className="text-lg font-medium text-[#F4F1ED]">Checkout</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Order Summary */}
        <div className="separation-card bg-[#1A1C1F] border border-[#E3C27D]/20 rounded-xl p-8 mb-6">
          <h2 className="text-2xl font-bold awareness-text mb-6 text-center">
            Confirm Your Selection
          </h2>
          
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="text-5xl">{currentPlan.icon}</div>
            <div>
              <h3 className="text-2xl font-bold awareness-text">{currentPlan.name}</h3>
              <p className="text-lg text-[#8E8A84]">
                ${currentPlan.dailyPrice} per day
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6 max-w-md mx-auto">
            {currentPlan.features.map((feature, i) => (
              <div key={i} className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-sm observation-text">{feature}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#E3C27D]/20 pt-6 space-y-3 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-[#8E8A84]">Billing Cycle</span>
              <span className="awareness-text font-medium capitalize">{cycle}</span>
            </div>
            <div className="flex justify-between items-center text-xl">
              <span className="awareness-text font-bold">Total</span>
              <div className="text-right">
                <div className="awareness-text font-bold">${price}</div>
                <div className="text-sm text-[#8E8A84]">{billingPeriod}</div>
              </div>
            </div>
          </div>

          {userData && (
            <div className="mt-6 p-4 rounded-lg bg-[#0C1117] max-w-md mx-auto">
              <p className="text-sm text-[#8E8A84] text-center">
                Billing to: <span className="text-[#F4F1ED]">{userData.email}</span>
              </p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-4 rounded-lg font-medium text-lg transition-all bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          {loading ? 'Redirecting to payment...' : 'Continue to Payment'}
        </button>

        {/* Security Badge */}
        <div className="text-center p-6 rounded-lg bg-[#1A1C1F]/50">
          <div className="text-3xl mb-2">🔒</div>
          <p className="text-sm text-[#8E8A84] mb-2">
            Secure payment powered by Stripe
          </p>
          <p className="text-xs text-[#8E8A84]">
            You'll be redirected to our secure payment processor
          </p>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-8 text-center p-6 rounded-xl bg-[#1A1C1F]/50">
          <h3 className="text-lg font-bold awareness-text mb-2">
            30-Day Money-Back Guarantee
          </h3>
          <p className="text-sm text-[#8E8A84]">
            Not satisfied? Get a full refund within 30 days, no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}
