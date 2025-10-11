import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { api } from '../utils/apiClient';
import { showToast } from '../utils/notificationUtils';
import { generateEmbodimentReminder } from '../utils/identityUtils';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [trialTimeLeft, setTrialTimeLeft] = useState(null);

  useEffect(() => {
    checkAuth();
    loadUserData();
  }, []);

  useEffect(() => {
    // Update trial countdown every minute
    if (userData?.subscriptionStatus === 'trial' && userData?.trialEndDate) {
      const interval = setInterval(() => {
        calculateTrialTimeLeft(userData.trialEndDate);
      }, 60000);

      calculateTrialTimeLeft(userData.trialEndDate);

      return () => clearInterval(interval);
    }
  }, [userData]);

  const checkAuth = () => {
    const token = localStorage.getItem('vow_auth_token');
    if (!token) {
      router.push('/login');
    }
  };

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      const response = await api.get('/userData?include=vows,stats');
      const { data } = response.data;
      
      setUserData(data);
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to load user data:', error);
      
      if (error.code === 'UNAUTHORIZED') {
        localStorage.removeItem('vow_auth_token');
        localStorage.removeItem('vow_refresh_token');
        router.push('/login');
      } else {
        showToast('Failed to load dashboard', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateTrialTimeLeft = (trialEndDate) => {
    const now = new Date();
    const end = new Date(trialEndDate);
    const diff = end - now;

    if (diff <= 0) {
      setTrialTimeLeft('Trial ended');
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    setTrialTimeLeft(`${hours}h ${minutes}m`);
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('vow_refresh_token');
      
      await api.post('/auth', {
        action: 'logout',
        refreshToken,
      });

      localStorage.removeItem('vow_auth_token');
      localStorage.removeItem('vow_refresh_token');
      
      showToast('Logged out successfully', 'success');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if API call fails
      localStorage.removeItem('vow_auth_token');
      localStorage.removeItem('vow_refresh_token');
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="vow-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your journey...</p>
        </div>
      </div>
    );
  }

  const alignmentScore = stats?.alignmentScore || 0;
  const embodimentMessage = generateEmbodimentReminder(alignmentScore);
  const isTrialActive = userData?.subscriptionStatus === 'trial';

  return (
    <>
      <Head>
        <title>Dashboard - VOW</title>
        <meta name="description" content="Your journey of becoming" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50">
        {/* Navigation */}
        <nav className="bg-white border-b border-amber-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <span className="text-2xl font-light tracking-wider text-gray-900">VOW</span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Trial Banner */}
        {isTrialActive && trialTimeLeft && (
          <div className="bg-amber-600 text-white py-3 px-4">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-sm font-medium">
                <span className="mr-2">🌅</span>
                Your First Two Days of Becoming • {trialTimeLeft} remaining
                <button className="ml-4 underline hover:no-underline">
                  Continue Your Journey →
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-light text-gray-900 mb-2">
              Welcome back, {userData?.name}
            </h1>
            <p className="text-xl text-gray-600 font-light">{embodimentMessage}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Total Vows</span>
                <span className="text-2xl">📜</span>
              </div>
              <p className="text-3xl font-light text-gray-900">{stats?.totalVows || 0}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Current Streak</span>
                <span className="text-2xl">🔥</span>
              </div>
              <p className="text-3xl font-light text-gray-900">{stats?.currentStreak || 0} days</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Alignment Score</span>
                <span className="text-2xl">✨</span>
              </div>
              <p className="text-3xl font-light text-gray-900">{alignmentScore}%</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Reflections</span>
                <span className="text-2xl">💭</span>
              </div>
              <p className="text-3xl font-light text-gray-900">{stats?.totalReflections || 0}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-medium text-gray-900 mb-4">Today's Reflection</h3>
              <p className="text-gray-600 mb-6">
                How are you honoring your vow today? Take a moment to reflect.
              </p>
              <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium transition-colors">
                Start Reflection
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-medium text-gray-900 mb-4">Log an Urge</h3>
              <p className="text-gray-600 mb-6">
                Noticed an urge? Log it without judgment. Awareness is transformation.
              </p>
              <button className="w-full border-2 border-amber-600 text-amber-600 hover:bg-amber-50 py-3 rounded-lg font-medium transition-colors">
                Log Trigger
              </button>
            </div>
          </div>

          {/* Active Vows */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-2xl font-light text-gray-900 mb-6">Your Active Vows</h3>
            
            {userData?.vows && userData.vows.length > 0 ? (
              <div className="space-y-4">
                {userData.vows.filter(v => v.status === 'active').map((vow) => (
                  <div
                    key={vow.id}
                    className="border border-gray-200 rounded-lg p-6 hover:border-amber-600 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full mb-2">
                          {vow.type}
                        </span>
                        <h4 className="text-lg font-medium text-gray-900">{vow.text}</h4>
                      </div>
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span>Day {vow.currentDay || 1} of {vow.duration}</span>
                      <span className="mx-2">•</span>
                      <span>{vow.currentStreak || 0} day streak</span>
                    </div>
                    <div className="mt-4">
                      <div className="vow-progress">
                        <div 
                          className="vow-progress-fill" 
                          style={{ width: `${((vow.currentDay || 1) / vow.duration) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">You haven't created any vows yet</p>
                <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Create Your First Vow
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
