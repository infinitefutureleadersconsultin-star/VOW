import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { api } from '../utils/apiClient';
import { showToast } from '../utils/notificationUtils';

export default function Pricing() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [error, setError] = useState(null);

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: 9.99,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY,
      billing: 'per month',
      features: [
        'Unlimited daily vows',
        'Daily reflection journaling',
        'Trigger logging & patterns',
        'Progress tracking',
        'Email support',
        'Mobile app access'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 19.99,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM,
      billing: 'per month',
      features: [
        'Everything in Monthly',
        'AI-guided reflections',
        'Advanced analytics',
        'Voice journaling',
        'Priority support',
        'Offline mode',
        'Export your data'
      ],
      popular: true
    },
    {
      id: 'executive',
      name: 'Executive',
      price: 49.99,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_EXECUTIVE,
      billing: 'per month',
      features: [
        'Everything in Premium',
        '1-on-1 mentor sessions',
        'Personalized healing plan',
        'Private community access',
        'Early access to features',
        'Custom integrations',
        'Dedicated support'
      ],
      popular: false
    }
  ];

  useEffect(() => {
    checkAuth();
    loadUserData();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('vow_auth_token');
    if (!token) {
      // Allow viewing pricing without auth
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
      } else {
        throw new Error('Failed to load user data');
      }
    } catch (error) {
      console.error('Load user data error:', error);
      
      if (error.code === 'UNAUTHORIZED') {
        // Token expired, clear it
        localStorage.removeItem('vow_auth_token');
        localStorage.removeItem('vow_refresh_token');
        setUserData(null);
      } else if (error.code === 'ECONNABORTED') {
        setError('Request timeout. Please check your connection.');
      } else {
        // Don't block pricing page if user data fails
        console.warn('Could not load user data, continuing anyway');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan) => {
    // Check if user is logged in
    const token = localStorage.getItem('vow_auth_token');
    if (!token) {
      showToast('Please log in to subscribe', 'info');
      router.push(`/login?redirect=/pricing&plan=${plan.id}`);
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      setSelectedPlan(plan.id);

      // Create Stripe checkout session
      const response = await api.post('/subscription', {
        action: 'create_checkout',
        priceId: plan.priceId,
        planName: plan.name,
        successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`
      }, {
        timeout: 15000
      });

      if (response?.data?.success && response.data.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.checkoutUrl;
      } else {
        throw new Error(response?.data?.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Subscribe error:', error);
      
      if (error.code === 'UNAUTHORIZED') {
        localStorage.removeItem('vow_auth_token');
        showToast('Session expired. Please log in again', 'error');
        router.push('/login');
      } else if (error.code === 'ECONNABORTED') {
        setError('Request timeout. Please try again.');
        showToast('Timeout. Please try again', 'error');
      } else if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.error || 'Invalid request. Please try again.';
        setError(errorMsg);
        showToast(errorMsg, 'error');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again in a moment.');
        showToast('Server error. Please try again', 'error');
      } else {
        const errorMessage = error.response?.data?.error || error.message || 'Failed to start checkout';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setProcessing(true);
      setError(null);

      const response = await api.post('/subscription', {
        action: 'create_portal',
        returnUrl: `${window.location.origin}/pricing`
      }, {
        timeout: 15000
      });

      if (response?.data?.success && response.data.portalUrl) {
        window.location.href = response.data.portalUrl;
      } else {
        throw new Error(response?.data?.error || 'Failed to access billing portal');
      }
    } catch (error) {
      console.error('Manage subscription error:', error);
      
      const errorMessage = error.response?.data?.error || error.message || 'Failed to access billing portal';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setProcessing(false);
    }
  };

  const isTrialActive = userData?.subscriptionStatus === 'trial';
  const hasActiveSubscription = userData?.subscriptionStatus === 'active';
  const currentTier = userData?.subscriptionTier;

  return (
    <>
      <Head>
        <title>Pricing - VOW</title>
        <meta name="description" content="Choose your journey of becoming" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50">
        {/* Header */}
        <nav className="bg-white border-b border-amber-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => router.push(userData ? '/dashboard' : '/')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              <img src="/logo.svg" alt="VOW" className="h-10" />
              <div className="w-16"></div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-light text-gray-900 mb-4">
              Choose Your Journey
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every moment is a new beginning. Start with 2 free days to experience the transformation.
            </p>
          </div>

          {/* Trial Banner */}
          {isTrialActive && (
            <div className="max-w-3xl mx-auto mb-8">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                <p className="text-amber-800 font-medium mb-2">
                  🌅 You're on your 2-day trial
                </p>
                <p className="text-amber-700 text-sm">
                  Upgrade anytime to continue your journey beyond the trial period
                </p>
              </div>
            </div>
          )}

          {/* Active Subscription Banner */}
          {hasActiveSubscription && (
            <div className="max-w-3xl mx-auto mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <p className="text-green-800 font-medium mb-2">
                  ✅ You have an active {currentTier || 'subscription'}
                </p>
                <button
                  onClick={handleManageSubscription}
                  disabled={processing}
                  className="text-green-700 hover:text-green-900 text-sm underline"
                >
                  Manage your subscription
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="max-w-3xl mx-auto mb-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${
                  plan.popular ? 'ring-2 ring-amber-600' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-amber-600 text-white px-4 py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-light text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span className="text-4xl font-light text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">{plan.billing}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={processing || (hasActiveSubscription && currentTier === plan.name.toLowerCase())}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      hasActiveSubscription && currentTier === plan.name.toLowerCase()
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : processing && selectedPlan === plan.id
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : plan.popular
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {processing && selectedPlan === plan.id ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : hasActiveSubscription && currentTier === plan.name.toLowerCase() ? (
                      'Current Plan'
                    ) : (
                      'Get Started'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-light text-gray-900 mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <details className="bg-white rounded-lg p-6 shadow-md">
                <summary className="font-medium text-gray-900 cursor-pointer">
                  What happens after the 2-day trial?
                </summary>
                <p className="mt-3 text-gray-600 text-sm">
                  After your 2-day trial ends, you can choose to upgrade to any plan to continue your journey. Your progress and data are saved regardless of your subscription status.
                </p>
              </details>
              
              <details className="bg-white rounded-lg p-6 shadow-md">
                <summary className="font-medium text-gray-900 cursor-pointer">
                  Can I cancel anytime?
                </summary>
                <p className="mt-3 text-gray-600 text-sm">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </details>
              
              <details className="bg-white rounded-lg p-6 shadow-md">
                <summary className="font-medium text-gray-900 cursor-pointer">
                  Can I switch between plans?
                </summary>
                <p className="mt-3 text-gray-600 text-sm">
                  Absolutely! You can upgrade or downgrade your plan at any time from your account settings. Changes take effect at your next billing cycle.
                </p>
              </details>
              
              <details className="bg-white rounded-lg p-6 shadow-md">
                <summary className="font-medium text-gray-900 cursor-pointer">
                  Is my data secure?
                </summary>
                <p className="mt-3 text-gray-600 text-sm">
                  Yes. We use industry-standard encryption and security practices. Your reflections and personal information are private and protected. We never share your data with third parties.
                </p>
              </details>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Secure payment processing powered by Stripe
            </p>
            <div className="flex justify-center items-center space-x-8 text-gray-400">
              <span className="text-2xl">🔒</span>
              <span className="text-sm">256-bit SSL</span>
              <span className="text-2xl">💳</span>
              <span className="text-sm">PCI Compliant</span>
              <span className="text-2xl">✅</span>
              <span className="text-sm">Money-back Guarantee</span>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
