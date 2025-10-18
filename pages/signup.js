import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { api } from '../utils/apiClient';
import { showToast } from '../utils/notificationUtils';
import TermsAgreement from '../components/TermsAgreement';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function SignupForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    nationality: '',
    ethnicity: '',
    language: 'en',
    consentData: false,
    consentAI: false,
  });
  
  const [paymentData, setPaymentData] = useState({
    priceId: 'price_monthly_4_99',
    interval: 'monthly',
  });

  const nationalityOptions = [
    { value: '', label: 'Select your country (optional)' },
    { value: 'US', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'MX', label: 'Mexico' },
    { value: 'OTHER', label: 'Other' },
  ];

  const ethnicityOptions = [
    { value: '', label: 'Prefer not to say' },
    { value: 'white', label: 'White/Caucasian' },
    { value: 'black', label: 'Black/African American' },
    { value: 'hispanic', label: 'Hispanic/Latino' },
    { value: 'asian', label: 'Asian' },
    { value: 'native', label: 'Native American/Indigenous' },
    { value: 'pacific', label: 'Pacific Islander' },
    { value: 'middle_eastern', label: 'Middle Eastern/North African' },
    { value: 'mixed', label: 'Mixed/Multiracial' },
    { value: 'other', label: 'Other' },
  ];

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
    if (!formData.gender) {
      setError('Please select your gender');
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

  const validateStep3 = () => {
    if (!termsAccepted) {
      setError('Please accept the Terms of Service to continue');
      showToast('You must accept the terms to continue', 'error');
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

  const handleStartFreeTrial = async () => {
    if (!validateStep3()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth', {
        action: 'signup',
        ...formData,
        termsAccepted: true,
        termsAcceptedAt: new Date().toISOString(),
      });

      if (response?.data?.success) {
        showToast('Welcome! Your 2-day free trial has started.', 'success');
        
        if (response.data.token) {
          localStorage.setItem('vow_auth_token', response.data.token);
        }

        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        throw new Error(response?.data?.error || 'Signup failed');
      }
    } catch (err) {
      console.error('Free trial signup error:', err);
      
      if (err.type === 'CONFLICT' || err.status === 409 || err.message?.includes('already exists')) {
        setError('This email is already registered. Please log in instead.');
        showToast('Account already exists. Redirecting to login...', 'info');
        setTimeout(() => {
          router.push(`/login?email=${encodeURIComponent(formData.email)}`);
        }, 2000);
      } else {
        setError(err.message || 'Failed to start free trial. Please try again.');
        showToast(err.message || 'Signup failed', 'error');
      }
    } finally {
      setLoading(false);
    }
  };
  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!validateStep3()) return;
    
    if (!stripe || !elements) {
      setError('Payment system not loaded. Please refresh the page.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const intentResponse = await api.post('/subscription', {
        action: 'create-payment-intent',
        email: formData.email,
        priceId: paymentData.priceId,
      });

      const { clientSecret } = intentResponse.data;

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
        const response = await api.post('/auth', {
          action: 'signup',
          ...formData,
          subscriptionStatus: 'active',
          paymentIntentId: paymentIntent.id,
          termsAccepted: true,
          termsAcceptedAt: new Date().toISOString(),
        });

        if (response?.data?.success) {
          showToast('Account created successfully!', 'success');
          
          if (response.data.token) {
            localStorage.setItem('vow_auth_token', response.data.token);
          }

          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      
      if (err.type === 'CONFLICT' || err.status === 409 || err.message?.includes('already exists')) {
        setError('This email is already registered. Please log in instead.');
        showToast('Account already exists. Redirecting to login...', 'info');
        setTimeout(() => {
          router.push(`/login?email=${encodeURIComponent(formData.email)}`);
        }, 2000);
        return;
      }
      
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up - VOW</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: 'linear-gradient(135deg, #0C1117 0%, #1a1f2e 100%)' }}>
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-[#F4F1ED] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Create Your Account
            </h1>
            <p className="text-[#8E8A84]">Begin your transformation</p>
          </div>

          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 mx-1 transition-all ${
                  s <= step ? 'bg-[#E3C27D]' : 'bg-[#252b3d]'
                }`}
              />
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#6E3B3B]/20 border border-[#6E3B3B]/30">
              <p className="text-[#F4F1ED] text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: Account Info */}
          {step === 1 && (
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#C8C4BE] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-glass w-full px-4 py-3 rounded-xl"
                  placeholder="John Doe"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#C8C4BE] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-glass w-full px-4 py-3 rounded-xl"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#C8C4BE] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-glass w-full px-4 py-3 rounded-xl"
                  placeholder="At least 8 characters"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#C8C4BE] mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="input-glass w-full px-4 py-3 rounded-xl"
                  placeholder="Re-enter password"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#C8C4BE] mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="input-glass w-full px-4 py-3 rounded-xl"
                  disabled={loading}
                >
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#C8C4BE] mb-2">
                  Nationality <span className="text-[#8E8A84] text-xs">(Optional)</span>
                </label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="input-glass w-full px-4 py-3 rounded-xl"
                  disabled={loading}
                >
                  {nationalityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#C8C4BE] mb-2">
                  Ethnicity <span className="text-[#8E8A84] text-xs">(Optional)</span>
                </label>
                <select
                  name="ethnicity"
                  value={formData.ethnicity}
                  onChange={handleInputChange}
                  className="input-glass w-full px-4 py-3 rounded-xl"
                  disabled={loading}
                >
                  {ethnicityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleNextStep}
                disabled={loading}
                className="w-full btn-primary mt-6"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Consent */}
          {step === 2 && (
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="space-y-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="consentData"
                    checked={formData.consentData}
                    onChange={handleInputChange}
                    className="mt-1"
                    disabled={loading}
                  />
                  <span className="text-sm text-[#C8C4BE]">
                    I agree to the collection and processing of my data for app functionality
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="consentAI"
                    checked={formData.consentAI}
                    onChange={handleInputChange}
                    className="mt-1"
                    disabled={loading}
                  />
                  <span className="text-sm text-[#C8C4BE]">
                    I consent to AI-powered insights and recommendations
                  </span>
                </label>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="flex-1 btn-secondary"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={loading}
                  className="flex-1 btn-primary"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Terms & Free Trial */}
          {step === 3 && (
            <div className="glass-card rounded-2xl p-6 space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-light text-[#F4F1ED] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Begin Your Vow
                </h2>
                <p className="text-[#8E8A84]">Your daily act of unlocking</p>
              </div>

              {/* Terms Agreement - REQUIRED */}
              <TermsAgreement 
                onAcceptanceChange={setTermsAccepted}
                initialAccepted={termsAccepted}
              />

              {/* Free Trial with Pricing Display */}
              <div className={`p-6 rounded-xl border-2 transition-all ${
                termsAccepted 
                  ? 'border-[#E3C27D]/30 hover:border-[#E3C27D]' 
                  : 'border-[#252b3d] opacity-50'
              }`} style={{ background: 'rgba(227, 194, 125, 0.05)' }}>
                
                {/* Pricing Display */}
                <div className="text-center mb-6">
                  <p className="text-sm text-[#E3C27D] font-medium mb-4">Initiation</p>
                  <div className="mb-4">
                    <p className="text-5xl font-light text-[#F4F1ED]" style={{ fontFamily: "'Playfair Display', serif" }}>
                      $0.16
                    </p>
                    <p className="text-lg text-[#8E8A84]">per day</p>
                  </div>
                  <div className="bg-[#1A1C1F] rounded-lg p-3 mb-4">
                    <p className="text-sm text-[#F4F1ED]">
                      Billed monthly at <span className="font-semibold text-[#E3C27D]">$4.99</span>
                    </p>
                    <p className="text-xs text-[#8E8A84] mt-1">4-week minimum commitment</p>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="text-[#E3C27D] mr-3 text-lg">✓</span>
                    <span className="text-[#F4F1ED]">Create unlimited vows</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#E3C27D] mr-3 text-lg">✓</span>
                    <span className="text-[#F4F1ED]">Daily reflection journaling</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#E3C27D] mr-3 text-lg">✓</span>
                    <span className="text-[#F4F1ED]">Track patterns & triggers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#E3C27D] mr-3 text-lg">✓</span>
                    <span className="text-[#F4F1ED]">2-day free trial included</span>
                  </li>
                </ul>

                {/* Start Free Trial Button */}
                <button
                  onClick={handleStartFreeTrial}
                  disabled={loading || !termsAccepted}
                  className="w-full btn-primary py-4 text-lg disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Start Free Trial'}
                </button>

                {/* Trust Signals */}
                <div className="mt-4 space-y-2 text-center">
                  <p className="text-xs text-[#8E8A84]">✓ No credit card required for trial</p>
                  <p className="text-xs text-[#8E8A84]">✓ Cancel anytime after 4 weeks</p>
                  <p className="text-xs text-[#8E8A84]">✓ Secure payment via Stripe</p>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={loading}
                className="w-full btn-secondary mt-4"
              >
                Back              </button>
            </div>
          )}

          <p className="text-center text-[#8E8A84] mt-6">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-[#E3C27D] hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </>
  );
}

export default function Signup() {
  return (
    <Elements stripe={stripePromise}>
      <SignupForm />
    </Elements>
  );
}
