import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoadingSpinner from './LoadingSpinner';
import { checkSubscriptionStatus } from '../utils/subscriptionCheck';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const token = localStorage.getItem('vow_auth_token');
      
      if (!token) {
        console.log('[PROTECTED] No token, redirect to login');
        router.push('/login');
        return;
      }

      const response = await fetch('/api/userData', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.log('[PROTECTED] Invalid token, redirect to login');
          localStorage.removeItem('vow_auth_token');
          router.push('/login');
          return;
        }
        throw new Error('Failed to verify access');
      }

      const result = await response.json();
      
      // 👑 ADMIN BYPASS - Never block admin
      if (result.data?.email === 'issiahmclean1999@gmail.com') {
        console.log('[PROTECTED] 👑 ADMIN ACCESS GRANTED');
        setChecking(false);
        return;
      }

      const accessCheck = checkSubscriptionStatus(result.data);
      
      console.log('[PROTECTED] Access check:', accessCheck);

      if (!accessCheck.hasAccess) {
        console.log('[PROTECTED] No access, redirect to:', accessCheck.shouldRedirect);
        router.push(accessCheck.shouldRedirect);
      } else {
        console.log('[PROTECTED] Access granted');
        setChecking(false);
      }

    } catch (error) {
      console.error('[PROTECTED] Error:', error);
      router.push('/login');
    }
  };

  if (checking) {
    return <LoadingSpinner fullScreen text="Verifying access..." />;
  }

  return <>{children}</>;
}
