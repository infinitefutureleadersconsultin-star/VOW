import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoadingSpinner from './LoadingSpinner';
import { checkUserAccess } from '../utils/accessControl';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [accessMessage, setAccessMessage] = useState('');

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const token = localStorage.getItem('vow_auth_token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch user data
      const response = await fetch('/api/userData', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('vow_auth_token');
          router.push('/login');
          return;
        }
        throw new Error('Failed to verify access');
      }

      const result = await response.json();
      const access = checkUserAccess(result.data);

      if (!access.hasAccess) {
        setAccessDenied(true);
        setAccessMessage(access.message);
        
        // Redirect to profile after 2 seconds
        setTimeout(() => {
          router.push('/pricing');
        }, 2000);
      } else {
        setChecking(false);
      }

    } catch (error) {
      console.error('Access check failed:', error);
      router.push('/login');
    }
  };

  if (checking && !accessDenied) {
    return <LoadingSpinner fullScreen text="Verifying access..." />;
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0C1117' }}>
        <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center animate-fade-in">
          <div className="text-[#E3C27D] text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-light text-[#F4F1ED] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Access Required
          </h2>
          <p className="text-[#8E8A84] mb-2">{accessMessage}</p>
          <p className="text-[#E3C27D] text-sm mb-6">
            Continue your transformation journey with full access
          </p>
          <button
            onClick={() => router.push('/pricing')}
            className="w-full mt-4 mb-6 px-8 py-4 rounded-xl font-medium text-lg transition-all"
            style={{ background: '#E3C27D', color: '#0C1117' }}
          >
            Upgrade Now
          </button>
          <p className="text-sm text-[#8E8A84]">
            Redirecting to upgrade options...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
