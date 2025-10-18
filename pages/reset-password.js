import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { api } from '../utils/apiClient';
import { showToast } from '../utils/notificationUtils';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await api.post('/password-reset', {
        action: 'verify',
        token,
      });

      if (response.data.success) {
        setValidToken(true);
        setEmail(response.data.email);
      } else {
        setValidToken(false);
        showToast('Invalid or expired reset link', 'error');
      }
    } catch (error) {
      console.error('Token verification error:', error);
      setValidToken(false);
      showToast('Invalid or expired reset link', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post('/password-reset', {
        action: 'reset',
        token,
        newPassword,
      });

      if (response.data.success) {
        showToast('Password reset successful!', 'success');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      showToast(error.message || 'Failed to reset password', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center corrective-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[var(--accent-gold)] border-t-transparent mx-auto mb-4"></div>
          <p className="observation-text">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!validToken) {
    return (
      <>
        <Head>
          <title>Invalid Link - VOW</title>
          <link rel="stylesheet" href="/corrective-separation.css" />
        </Head>

        <div className="min-h-screen flex items-center justify-center p-4 corrective-bg">
          <div className="max-w-md w-full separation-card rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 
              className="text-2xl awareness-text mb-2"
              style={{ fontFamily: "'SF Pro Display', sans-serif", fontWeight: 500 }}
            >
              Invalid Reset Link
            </h1>
            <p className="observation-text mb-6">
              This password reset link is invalid or has expired.
            </p>
            <button
              onClick={() => router.push('/forgot-password')}
              className="vow-action px-6 py-3 rounded-lg surgical-transition"
            >
              Request New Link
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Reset Password - VOW</title>
        <link rel="stylesheet" href="/corrective-separation.css" />
      </Head>

      <div className="min-h-screen flex items-center justify-center p-4 corrective-bg">
        <div className="max-w-md w-full">
          <div className="separation-card rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
                <Lock size={32} className="icon-gold" />
              </div>
              <h1 
                className="text-2xl awareness-text mb-2"
                style={{ fontFamily: "'SF Pro Display', sans-serif", fontWeight: 500 }}
              >
                Create New Password
              </h1>
              <p className="observation-text text-sm">
                for {email}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block observation-text text-sm mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="separation-card w-full px-4 py-3 rounded-lg awareness-text surgical-transition pr-12"
                    style={{ outline: 'none' }}
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 observation-text hover:text-[var(--text-primary)]"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block observation-text text-sm mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="separation-card w-full px-4 py-3 rounded-lg awareness-text surgical-transition pr-12"
                    style={{ outline: 'none' }}
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 observation-text hover:text-[var(--text-primary)]"
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="observation-text text-xs space-y-1">
                <p>Password must:</p>
                <ul className="list-disc list-inside ml-2">
                  <li>Be at least 8 characters long</li>
                  <li>Match in both fields</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="vow-action w-full py-3 rounded-lg surgical-transition disabled:opacity-50"
              >
                {submitting ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
