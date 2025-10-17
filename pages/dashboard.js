import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressTracker from '../components/ProgressTracker';
import ProfileAvatar from '../components/ProfileAvatar';
import { hasCelebrated, MILESTONE_KEYS } from '../utils/celebrationUtils';
import { ScrollText, Sparkles, Activity, User, Unlock } from 'lucide-react';

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
    return <LoadingSpinner fullScreen text="Loading your journey..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-yellow-600 text-5xl mb-4">⚠</div>
          <h2 className="text-2xl font-light text-gray-100 mb-2">
            Connection Issue
          </h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => {
              const token = localStorage.getItem('vow_auth_token');
              if (token) fetchUserData(token);
            }}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="glass-card border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-light tracking-wider text-gray-100">VOW</h1>
            <ProfileAvatar userData={userData} onLogout={handleLogout} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-light text-gray-100 mb-2">
            Welcome back, {userData?.name?.split(' ')[0] || 'there'}
          </h2>
          <p className="text-gray-400">Continue your transformation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1">
            <ProgressTracker stats={stats} variant="card" />
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-6 floating">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Active Vows</span>
                <ScrollText size={24} className="text-yellow-600" strokeWidth={1.5} />
              </div>
              <p className="text-3xl font-light text-gray-100">{stats?.activeVows || 0}</p>
            </div>

            <div className="glass-card rounded-2xl p-6 floating">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Current Streak</span>
                <Activity size={24} className="text-yellow-600" strokeWidth={1.5} />
              </div>
              <p className="text-3xl font-light text-gray-100">{stats?.currentStreak || 0}</p>
              <p className="text-xs text-gray-500 mt-1">days</p>
            </div>

            <div className="glass-card rounded-2xl p-6 floating">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Reflections</span>
                <Sparkles size={24} className="text-yellow-600" strokeWidth={1.5} />
              </div>
              <p className="text-3xl font-light text-gray-100">{stats?.totalReflections || 0}</p>
            </div>

            <div className="glass-card rounded-2xl p-6 floating">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Alignment</span>
                <div className="w-6 h-6 rounded-full border-2 border-yellow-600 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-yellow-600"></div>
                </div>
              </div>
              <p className="text-3xl font-light text-gray-100">{stats?.alignmentScore || 0}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => router.push('/create-vow')}
            className="glass-card rounded-2xl p-6 floating hover:shadow-xl transition-all text-left"
          >
            <ScrollText size={32} className="text-yellow-600 mb-3" strokeWidth={1.5} />
            <h3 className="text-lg font-medium mb-1 text-gray-100">Create a Vow</h3>
            <p className="text-sm text-gray-400">Begin a new commitment</p>
          </button>

          <button
            onClick={() => router.push('/reflection')}
            className="glass-card rounded-2xl p-6 floating hover:shadow-xl transition-all text-left"
          >
            <Sparkles size={32} className="text-yellow-600 mb-3" strokeWidth={1.5} />
            <h3 className="text-lg font-medium mb-1 text-gray-100">Reflect</h3>
            <p className="text-sm text-gray-400">Check in with yourself</p>
          </button>

          <button
            onClick={() => router.push('/log-trigger')}
            className="glass-card rounded-2xl p-6 floating hover:shadow-xl transition-all text-left"
          >
            <Activity size={32} className="text-yellow-600 mb-3" strokeWidth={1.5} />
            <h3 className="text-lg font-medium mb-1 text-gray-100">Log Pattern</h3>
            <p className="text-sm text-gray-400">Track your triggers</p>
          </button>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-medium text-gray-100 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/profile')}
              className="w-full text-left p-4 rounded-xl glass-button floating"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-100">View Profile</p>
                  <p className="text-sm text-gray-400">Manage your account</p>
                </div>
                <User size={24} className="text-yellow-600" strokeWidth={1.5} />
              </div>
            </button>

            {showUpgrade && (
              <button
                onClick={() => router.push('/pricing')}
                className="w-full text-left p-4 rounded-xl glass-button floating"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-100">Unlock Path</p>
                    <p className="text-sm text-gray-400">
                      {userData?.subscriptionStatus === 'active' 
                        ? 'Manage your journey' 
                        : 'Continue your transformation'}
                    </p>
                  </div>
                  <Unlock size={24} className="text-yellow-600" strokeWidth={1.5} />
                </div>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
