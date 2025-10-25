import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const { redirect, plan } = router.query;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [language, setLanguageState] = useState('en');

  const setLanguage = (lang) => {
    localStorage.setItem('vow_language', lang);
    setLanguageState(lang);
  };

  useEffect(() => {
    const saved = localStorage.getItem('vow_language') || 'en';
    setLanguageState(saved);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('[LOGIN] Starting login for:', email);

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
      console.log('[LOGIN] Response:', { success: result.success });

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      if (result.success && result.data?.token) {
        const { token, trialEndDate, subscriptionStatus } = result.data;
        
        // ✅ Save token
        localStorage.setItem('vow_auth_token', token);
        console.log('[LOGIN] Token saved');
        
        // ✅ Simple trial check
        const now = new Date();
        const trialEnd = trialEndDate ? new Date(trialEndDate) : null;
        const trialExpired = trialEnd && now > trialEnd;
        const hasActiveSub = subscriptionStatus === 'active';
        
        console.log('[LOGIN] Status:', { trialExpired, hasActiveSub });
        
        // ✅ Determine destination
        let destination;
        
        if (trialExpired && !hasActiveSub) {
          // Trial expired, no subscription → pricing
          destination = '/pricing';
          console.log('[LOGIN] Trial expired → Pricing');
        } else if (redirect) {
          // Has valid access and there's a redirect → go there
          destination = redirect;
          console.log('[LOGIN] Valid access → Redirect:', redirect);
        } else {
          // Has valid access, no redirect → dashboard
          destination = '/dashboard';
          console.log('[LOGIN] Valid access → Dashboard');
        }
        
        // ✅ Single redirect, no loops
        console.log('[LOGIN] Final destination:', destination);
        window.location.href = destination;
        
        return; // Don't set loading false, we're redirecting
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
        <title>Sign In - VOW</title>
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

              <div className="flex items-center justify-end">
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
