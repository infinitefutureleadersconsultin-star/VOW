import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { api } from '../utils/apiClient';
import { showToast } from '../utils/notificationUtils';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function SignupForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    nationality: '',
    language: 'en',
    consentData: false,
    consentAI: false,
  });
  
  const [paymentData, setPaymentData] = useState({
    priceId: 'price_monthly_4_99',
    interval: 'monthly',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
  };

  const validateStep1 = () => {
    if (!formData.name || formData.name.length < 2) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (!formData.password || formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.consentData || !formData.consentAI) {
      setError('Please agree to the required consents');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError('Payment system not loaded. Please refresh the page.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const intentResponse = await api.post('/subscription', {
        action: 'create-payment-intent',
        email: formData.email,
        priceId: paymentData.priceId,
      });

      const { clientSecret } = intentResponse.data.data;

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: formData.name,
            email: formData.email,
          },
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Create user account
        const signupResponse = await api.post('/auth', {
          action: 'signup',
          ...formData,
        });

        const { userId, token, refreshToken } = signupResponse.data.data;

        // Store tokens
        localStorage.setItem('vow_auth_token', token);
        localStorage.setItem('vow_refresh_token', refreshToken);

        // Create subscription
        await api.post('/subscription', {
          action: 'create-subscription',
          paymentIntentId: paymentIntent.id,
          userId,
        });

        showToast('Account created successfully! Welcome to VOW.', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      showToast(err.message || 'Payment failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const startFreeTrial = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create user account without payment
      const signupResponse = await api.post('/auth', {
        action: 'signup',
        ...formData,
      });

      const { userId, token, refreshToken, trialEndDate } = signupResponse.data.data;

      // Store tokens
      localStorage.setItem('vow_auth_token', token);
      localStorage.setItem('vow_refresh_token', refreshToken);

      showToast('Welcome! Your First Two Days of Becoming start now.', 'success');
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Signup failed. Please try again.');
      showToast(err.message || 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">VOW</h1>
          <p className="text-gray-600">Begin Your Journey of Becoming</p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              1
            </div>
            <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-amber-600' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
            <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-amber-600' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              3
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  placeholder="At least 8 characters"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <button
                onClick={handleNextStep}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Preferences & Consent */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender (Optional)
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality/Ethnicity (Optional)
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  placeholder="For personalized intro video"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This helps us provide a culturally relevant welcome experience
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Language
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="pt">Português</option>
                  <option value="fr">Français</option>
                  <option value="hi">हिन्दी</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="consentData"
                    checked={formData.consentData}
                    onChange={handleInputChange}
                    className="mt-1 mr-3"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    I consent to VOW storing my data securely and using it to provide personalized guidance
                  </span>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="consentAI"
                    checked={formData.consentAI}
                    onChange={handleInputChange}
                    className="mt-1 mr-3"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    I consent to AI-powered coaching and pattern analysis to support my journey
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment or Trial */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Begin Your First Two Days
                </h3>
                <p className="text-gray-600">
                  Start your free 2-day trial. No credit card required.
                </p>
              </div>

              <button
                onClick={startFreeTrial}
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? 'Creating Your Account...' : 'Start Free Trial'}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or subscribe now</span>
                </div>
              </div>

              <form onSubmit={handlePayment}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Details
                  </label>
                  <div className="p-4 border border-gray-300 rounded-lg">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#374151',
                            '::placeholder': {
                              color: '#9CA3AF',
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subscription Plan
                  </label>
                  <select
                    value={paymentData.priceId}
                    onChange={(e) => setPaymentData({ ...paymentData, priceId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  >
                    <option value="price_monthly_4_99">$4.99/month</option>
                    <option value="price_quarterly_4_99">$14.97/quarter (Save 10%)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!stripe || loading}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Subscribe Now'}
                </button>
              </form>

              <button
                onClick={() => setStep(2)}
                className="w-full text-gray-600 hover:text-gray-900 py-2 text-sm"
              >
                ← Back
              </button>

              <p className="text-xs text-center text-gray-500">
                Secure payment powered by Stripe. Your data is encrypted and safe.
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-amber-600 hover:text-amber-700 font-medium">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

export default function Signup() {
  return (
    <>
      <Head>
        <title>Sign Up - VOW</title>
        <meta name="description" content="Begin your journey of becoming. Start your free 2-day trial." />
      </Head>
      <Elements stripe={stripePromise}>
        <SignupForm />
      </Elements>
    </>
  );
}
