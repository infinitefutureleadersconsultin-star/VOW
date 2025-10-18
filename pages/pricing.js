import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { api } from '../utils/apiClient';
import { showToast } from '../utils/notificationUtils';
import { CheckCircle } from 'lucide-react';

export default function Pricing() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  // Single visible plan - $4.99 Initiation
  const initiationPlan = {
    id: 'initiation',
    name: 'Initiation',
    dailyPrice: 0.16,
    monthlyPrice: 4.99,
    priceId: 'price_monthly_4_99', // Your Stripe price ID
    commitment: '4-week minimum commitment',
    features: [
      'Create unlimited vows',
      'Daily reflection journaling',
      'Track patterns & triggers',
      'Monitor your progress',
      'Access on all devices',
      '2-day free trial included'
    ]
  };

  useEffect(() => {
    checkAuth();
    loadUserData();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('vow_auth_token');
    if (!token) {
      setLoading(false);
      return;
    }
  };

  const loadUserData = async () => {
    const token = localStorage.getItem('vow_auth_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/userData', {
        timeout: 10000
      });
      
      if (response?.data?.success) {
        setUserData(response.data.data);
      }
    } catch (error) {
      console.error('Load user data error:', error);
      
      if (error.code === 'UNAUTHORIZED') {
        localStorage.removeItem('vow_auth_token');
        setUserData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    const token = localStorage.getItem('vow_auth_token');
    if (!token) {
      showToast('Please log in to begin your journey', 'info');
      router.push(`/login?redirect=/pricing`);
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      const response = await api.post('/subscription', {
        action: 'create_checkout',
        priceId: initiationPlan.priceId,
        planName: initiationPlan.name,
        successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`
      }, {
        timeout: 15000
      });

      if (response?.data?.success && response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        throw new Error(response?.data?.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error('Subscribe error:', err);
      setError(err.message || 'Failed to process subscription. Please try again.');
      showToast('Failed to process subscription', 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0C1117' }}>
        <p className="text-[#8E8A84]">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Begin Your Vow - Pricing</title>
      </Head>

      <div className="min-h-screen py-12 px-4" style={{ background: 'linear-gradient(135deg, #0C1117 0%, #1a1f2e 100%)' }}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-light text-[#F4F1ED] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Begin Your Vow
            </h1>
            <p className="text-xl text-[#8E8A84] mb-2">
              Your daily act of unlocking
            </p>
            <p className="text-[#8E8A84]">
              2-day free trial included. Cancel anytime.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-8 p-4 rounded-xl bg-[#6E3B3B]/20 border border-[#6E3B3B]/30 max-w-2xl mx-auto">
              <p className="text-[#F4F1ED] text-sm text-center">{error}</p>
            </div>
          )}

          {/* Single Plan Card */}
          <div className="max-w-lg mx-auto">
            <div className="glass-card rounded-3xl p-8 floating border-2 border-[#E3C27D]/30">
              {/* Plan Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-light text-[#F4F1ED] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {initiationPlan.name}
                </h2>
                <div className="mb-4">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-6xl font-light text-[#E3C27D]" style={{ fontFamily: "'Playfair Display', serif" }}>
                      ${initiationPlan.dailyPrice}
                    </span>
                    <span className="text-2xl text-[#8E8A84]">/day</span>
                  </div>
                  <p className="text-[#8E8A84] mt-3">
                    Billed monthly at ${initiationPlan.monthlyPrice}
                  </p>
                  <p className="text-sm text-[#8E8A84] mt-1">
                    {initiationPlan.commitment}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {initiationPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-[#93B89A] mt-0.5 flex-shrink-0" strokeWidth={2} />
                    <span className="text-[#F4F1ED]">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={handleSubscribe}
                disabled={processing || userData?.subscriptionStatus === 'active'}
                className="w-full btn-primary text-lg py-4 disabled:opacity-50"
              >
                {processing ? 'Processing...' : 
                 userData?.subscriptionStatus === 'active' ? 'Already Subscribed' :
                 'Begin My Journey'}
              </button>

              {/* Trust Signals */}
              <div className="mt-6 text-center space-y-2">
                <p className="text-xs text-[#8E8A84]">
                  ✓ Cancel anytime after 4 weeks
                </p>
                <p className="text-xs text-[#8E8A84]">
                  ✓ Secure payment via Stripe
                </p>
                <p className="text-xs text-[#8E8A84]">
                  ✓ Access on web, iOS, and Android
                </p>
              </div>
            </div>

            {/* Progression Hint */}
            <div className="text-center mt-8 p-6 rounded-xl" style={{ background: 'rgba(227, 194, 125, 0.05)' }}>
              <p className="text-sm text-[#8E8A84] italic">
                As you progress on your journey, deeper paths will reveal themselves.
              </p>
            </div>
          </div>

          {/* Back to Dashboard */}
          {userData && (
            <div className="text-center mt-8">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-[#E3C27D] hover:underline"
              >
                ← Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
