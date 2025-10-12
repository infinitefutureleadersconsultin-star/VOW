import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { api } from '../utils/apiClient';
import { showToast } from '../utils/notificationUtils';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('vow_auth_token');
    if (token) {
      router.push('/dashboard');
    }

    // Check for session expired message
    if (router.query.session_expired) {
      showToast('Your session has expired. Please log in again.', 'warning');
    }
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!formData.email || !formData.password) {
        throw new Error('Please enter both email and password');
      }

      // Call login API
      const response = await api.post('/auth', {
        action: 'login',
        email: formData.email,
        password: formData.password,
      });

      const { token, refreshToken, subscriptionStatus, trialEndDate } = response.data.data;

      // Store tokens
      localStorage.setItem('vow_auth_token', token);
      localStorage.setItem('vow_refresh_token', refreshToken);

      // Show success message
      showToast('Welcome back! Remember who you said you\'d be.', 'success');

      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!resetEmail) {
        throw new Error('Please enter your email address');
      }

      await api.post('/auth', {
        action: 'reset-password',
        email: resetEmail,
      });

      setResetSent(true);
      showToast('Password reset instructions sent to your email', 'success');
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to send reset email');
      showToast(err.message || 'Failed to send reset email', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Log In - VOW</title>
        <meta name="description" content="Log in to continue your journey of becoming" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-gray-900 mb-2">VOW</h1>
            <p className="text-gray-600">
              {showForgotPassword ? 'Reset Your Password' : 'Welcome Back'}
            </p>
          </div>

          {/* Login Form */}
          {!showForgotPassword ? (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-600"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    'Log In'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-amber-600 hover:text-amber-700 font-medium">
                    Start your journey
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            /* Forgot Password Form */
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {resetSent ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Check Your Email</h3>
                  <p className="text-gray-600 mb-6">
                    We've sent password reset instructions to {resetEmail}
                  </p>
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetSent(false);
                      setResetEmail('');
                    }}
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    ← Back to login
                  </button>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleForgotPassword} className="space-y-6">
                    <div>
                      <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        id="reset-email"
                        name="reset-email"
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        We'll send you a code to reset your password
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Sending...' : 'Send Reset Code'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="w-full text-gray-600 hover:text-gray-900 py-2 text-sm"
                    >
                      ← Back to login
                    </button>
                  </form>
                </>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
