import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const { redirect, email: prefilledEmail } = router.query;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (prefilledEmail) {
      setEmail(prefilledEmail);
    }

    const token = localStorage.getItem('vow_auth_token');
    if (token) {
      console.log('[LOGIN] Already logged in, redirecting...');
      router.push(redirect || '/dashboard');
    }
  }, [router, redirect, prefilledEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('[LOGIN] Attempting login for:', email);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email,
          password,
        }),
      });

      const result = await response.json();
      console.log('[LOGIN] Response:', { 
        success: result.success, 
        hasData: !!result.data,
        hasToken: !!result.data?.token 
      });

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      // ✅ Auth API returns: result.data.token (not result.data.user.token)
      if (result.success && result.data?.token) {
        const { token, trialEndDate, subscriptionStatus } = result.data;
        
        console.log('[LOGIN] Token received, saving...');
        localStorage.setItem('vow_auth_token', token);
        
        console.log('[LOGIN] User status:', {
          trialEndDate,
          subscriptionStatus,
          email: result.data.email
        });
        
        // ✅ Check if trial ended (using data directly from response)
        let shouldGoToPricing = false;
        
        if (trialEndDate) {
          const trialEnd = new Date(trialEndDate);
          const now = new Date();
          const hasActiveSubscription = subscriptionStatus === 'active';
          
          console.log('[LOGIN] Trial check:', {
            trialEnd: trialEnd.toISOString(),
            now: now.toISOString(),
            trialEnded: now > trialEnd,
            hasActiveSubscription
          });
          
          // Trial ended and no active subscription = go to pricing
          if (now > trialEnd && !hasActiveSubscription) {
            shouldGoToPricing = true;
            console.log('[LOGIN] ✅ Trial ended, redirecting to pricing');
          }
        }
        
        // ✅ Redirect with window.location for reliability
        const destination = shouldGoToPricing ? '/pricing' : (redirect || '/dashboard');
        console.log('[LOGIN] Redirecting to:', destination);
        
        // Small delay to ensure token is saved
        setTimeout(() => {
          window.location.href = destination;
        }, 100);
        
        return;
      } else {
        throw new Error('No token in response');
      }

    } catch (err) {
      console.error('[LOGIN] Error:', err);
      setError(err.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - VOW</title>
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-4xl font-bold text-gray-900 mb-2">VOW</h1>
          <h2 className="text-center text-2xl font-medium text-gray-700">
            Welcome back
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-600 focus:border-amber-600 disabled:opacity-50"
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-600 focus:border-amber-600 disabled:opacity-50"
                  autoComplete="current-password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <button 
                    type="button" 
                    onClick={() => router.push("/forgot-password")} 
                    className="font-medium text-amber-600 hover:text-amber-500"
                    disabled={loading}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to VOW?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/signup"
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
