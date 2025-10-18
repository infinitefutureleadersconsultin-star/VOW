import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { api } from '../utils/apiClient';
import { showToast } from '../utils/notificationUtils';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      showToast('Please enter your email', 'error');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast('Please enter a valid email', 'error');
      return;
    }

    setLoading(true);

    try {
      await api.post('/password-reset', {
        action: 'request',
        email,
      });

      setSubmitted(true);
      showToast('Reset link sent! Check your email.', 'success');
    } catch (error) {
      console.error('Password reset request error:', error);
      showToast('Failed to send reset link. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password - VOW</title>
        <link rel="stylesheet" href="/corrective-separation.css" />
      </Head>

      <div className="min-h-screen flex items-center justify-center p-4 corrective-bg">
        <div className="max-w-md w-full">
          {/* Back button */}
          <button
            onClick={() => router.push('/login')}
            className="flex items-center space-x-2 observation-text mb-6 hover:text-[var(--text-primary)] surgical-transition"
          >
            <ArrowLeft size={20} />
            <span>Back to Login</span>
          </button>

          <div className="separation-card rounded-2xl p-8">
            {!submitted ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full" style={{ background: 'var(--bg-primary)' }} className="flex items-center justify-center">
                    <Mail size={32} className="icon-gold" />
                  </div>
                  <h1 
                    className="text-2xl awareness-text mb-2"
                    style={{ fontFamily: "'SF Pro Display', sans-serif", fontWeight: 500 }}
                  >
                    Reset Password
                  </h1>
                  <p className="observation-text text-sm">
                    Enter your email to receive a password reset link
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block observation-text text-sm mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="separation-card w-full px-4 py-3 rounded-lg awareness-text surgical-transition"
                      style={{ outline: 'none' }}
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="vow-action w-full py-3 rounded-lg surgical-transition disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full" style={{ background: 'rgba(95, 211, 165, 0.1)' }} className="flex items-center justify-center">
                  <div className="icon-green text-3xl">✓</div>
                </div>
                <h2 
                  className="text-xl awareness-text mb-2"
                  style={{ fontFamily: "'SF Pro Display', sans-serif", fontWeight: 500 }}
                >
                  Check Your Email
                </h2>
                <p className="observation-text text-sm mb-6">
                  If an account exists with <strong className="awareness-text">{email}</strong>, you'll receive a password reset link shortly.
                </p>
                <p className="observation-text text-xs mb-6">
                  The link will expire in 1 hour.
                </p>
                <button
                  onClick={() => router.push('/login')}
                  className="vow-action px-6 py-2 rounded-lg surgical-transition"
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
