import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressTracker from '../components/ProgressTracker';
import ProfileAvatar from '../components/ProfileAvatar';
import { hasCelebrated, MILESTONE_KEYS } from '../utils/celebrationUtils';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('vow_auth_token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    setShowUpgrade(hasCelebrated(MILESTONE_KEYS.FIRST_VOW));
    fetchUserData(token);
  }, [router]);

  const fetchUserData = async (token) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/userData?include=stats', {
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
        
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load dashboard');
      }

      const result = await response.json();
      setUserData(result.data);
      setStats(result.data.stats || {});

    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vow_auth_token');
    router.push('/login');
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50/30 to-gray-50 flex items-center justify-center p-4">
        <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => {
              const token = localStorage.getItem('vow_auth_token');
              if (token) fetchUserData(token);
            }}
            className="bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50/30 to-gray-50">
      <header className="glass-card border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">VOW</h1>
            <ProfileAvatar userData={userData} onLogout={handleLogout} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userData?.name?.split(' ')[0] || 'there'}! 👋
          </h2>
          <p className="text-gray-600">Track your progress and honor your commitments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1">
            <ProgressTracker stats={stats} variant="card" />
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-6 floating">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Active Vows</span>
                <span className="text-2xl">📜</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.activeVows || 0}</p>
            </div>

            <div className="glass-card rounded-2xl p-6 floating">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Current Streak</span>
                <span className="text-2xl">🔥</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.currentStreak || 0}</p>
              <p className="text-xs text-gray-500 mt-1">days</p>
            </div>

            <div className="glass-card rounded-2xl p-6 floating">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Reflections</span>
                <span className="text-2xl">✨</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalReflections || 0}</p>
            </div>

            <div className="glass-card rounded-2xl p-6 floating">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Alignment</span>
                <span className="text-2xl">🎯</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.alignmentScore || 0}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => router.push('/create-vow')}
            className="glass-card rounded-2xl p-6 floating hover:shadow-xl transition-all"
          >
            <div className="text-3xl mb-2">📜</div>
            <h3 className="text-lg font-semibold mb-1 text-gray-900">Create a Vow</h3>
            <p className="text-sm text-gray-600">Make a new commitment</p>
          </button>

          <button
            onClick={() => router.push('/reflection')}
            className="glass-card rounded-2xl p-6 floating hover:shadow-xl transition-all"
          >
            <div className="text-3xl mb-2">✨</div>
            <h3 className="text-lg font-semibold mb-1 text-gray-900">Daily Reflection</h3>
            <p className="text-sm text-gray-600">Check in with yourself</p>
          </button>

          <button
            onClick={() => router.push('/log-trigger')}
            className="glass-card rounded-2xl p-6 floating hover:shadow-xl transition-all"
          >
            <div className="text-3xl mb-2">📊</div>
            <h3 className="text-lg font-semibold mb-1 text-gray-900">Log Trigger</h3>
            <p className="text-sm text-gray-600">Track patterns</p>
          </button>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/profile')}
              className="w-full text-left p-4 rounded-xl glass-button floating"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">View Profile</p>
                  <p className="text-sm text-gray-600">Manage your account</p>
                </div>
                <span className="text-2xl">👤</span>
              </div>
            </button>

            {showUpgrade && (
              <button
                onClick={() => router.push('/pricing')}
                className="w-full text-left p-4 rounded-xl glass-button floating"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Unlock Path</p>
                    <p className="text-sm text-gray-600">
                      {userData?.subscriptionStatus === 'active' 
                        ? 'Manage your journey' 
                        : 'Continue your transformation'}
                    </p>
                  </div>
                  <span className="text-2xl">✨</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
