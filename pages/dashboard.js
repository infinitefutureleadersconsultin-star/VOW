import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressTracker from '../components/ProgressTracker';
import ProfileAvatar from '../components/ProfileAvatar';
import UpgradeModal from '../components/UpgradeModal';
import { hasCelebrated, MILESTONE_KEYS } from '../utils/celebrationUtils';
import { checkUserAccess, getTrialDaysRemaining } from '../utils/accessControl';
import { api } from '../utils/apiClient';
import { showToast } from '../utils/notificationUtils';
import { ScrollText, Sparkles, Activity, User, Unlock, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [accessInfo, setAccessInfo] = useState(null);
  const [upgradeModal, setUpgradeModal] = useState({ show: false, tier: null });
  const [upgrading, setUpgrading] = useState(false);

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

      // Check user access
      const access = checkUserAccess(result.data);
      setAccessInfo(access);

      // Check for upgrade milestones
      checkUpgradeMilestones(result.data);

      // If no access, redirect to profile
      if (!access.hasAccess) {
        router.push('/profile');
      }

    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkUpgradeMilestones = (user) => {
    // Don't show upgrades to admins or users without created date
    if (!user.createdAt) return;

    const createdDate = new Date(user.createdAt);
    const now = new Date();
    const daysActive = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));

    // Check if already seen upgrade prompts
    const seenReflection = localStorage.getItem('upgrade_reflection_seen');
    const seenLiberation = localStorage.getItem('upgrade_liberation_seen');

    // Show Reflection upgrade at 14 days (if on Initiation tier)
    if (
      daysActive >= 14 && 
      !seenReflection && 
      user.subscriptionStatus === 'active' &&
      user.subscriptionTier !== 'reflection' &&
      user.subscriptionTier !== 'liberation'
    ) {
      setTimeout(() => {
        setUpgradeModal({ show: true, tier: 'reflection' });
      }, 2000);
    }

    // Show Liberation upgrade at 45 days (if on Reflection tier)
    if (
      daysActive >= 45 && 
      !seenLiberation && 
      user.subscriptionStatus === 'active' &&
      user.subscriptionTier === 'reflection'
    ) {
      setTimeout(() => {
        setUpgradeModal({ show: true, tier: 'liberation' });
      }, 2000);
    }
  };

  const handleUpgrade = async (tierData) => {
    setUpgrading(true);

    try {
      const response = await api.post('/subscription', {
        action: 'create_checkout',
        priceId: tierData.priceId,
        planName: tierData.name,
        successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/dashboard`
      }, {
        timeout: 15000
      });

      if (response?.data?.success && response.data.checkoutUrl) {
        // Mark as seen before redirect
        localStorage.setItem(`upgrade_${upgradeModal.tier}_seen`, 'true');
        window.location.href = response.data.checkoutUrl;
      } else {
        throw new Error(response?.data?.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error('Upgrade error:', err);
      showToast('Failed to process upgrade. Please try again.', 'error');
    } finally {
      setUpgrading(false);
    }
  };

  const closeUpgradeModal = () => {
    // Mark as seen when dismissed
    localStorage.setItem(`upgrade_${upgradeModal.tier}_seen`, 'true');
    setUpgradeModal({ show: false, tier: null });
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
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0C1117' }}>
        <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-[#E3C27D] text-5xl mb-4">⚠</div>
          <h2 className="text-2xl font-light text-[#F4F1ED] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Connection Issue
          </h2>
          <p className="text-[#8E8A84] mb-6">{error}</p>
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
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0C1117 0%, #1a1f2e 100%)' }}>
      <header className="glass-card border-b" style={{ borderColor: 'rgba(244, 241, 237, 0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-light tracking-wider text-[#F4F1ED]" style={{ fontFamily: "'Playfair Display', serif" }}>
              VOW
            </h1>
            <ProfileAvatar userData={userData} onLogout={handleLogout} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trial Banner */}
        {accessInfo?.isTrial && (
          <div className="mb-6 p-4 rounded-xl glass-card border-2 border-[#E3C27D]/30 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle size={24} className="text-[#E3C27D]" />
                <div>
                  <p className="text-[#F4F1ED] font-medium">
                    Free Trial Active
                  </p>
                  <p className="text-sm text-[#8E8A84]">
                    {accessInfo.daysLeft} {accessInfo.daysLeft === 1 ? 'day' : 'days'} remaining
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push('/pricing')}
                className="btn-primary text-sm px-6 py-2"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-3xl font-light text-[#F4F1ED] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Welcome back, {userData?.name?.split(' ')[0] || 'there'}
          </h2>
          <p className="text-[#8E8A84]">Continue your transformation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1">
            <ProgressTracker stats={stats} variant="card" />
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-6 floating">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#8E8A84] text-sm">Active Vows</span>
                <ScrollText size={24} className="text-[#E3C27D]" strokeWidth={1.5} />
              </div>
              <p className="text-3xl font-light text-[#F4F1ED]" style={{ fontFamily: "'Playfair Display', serif" }}>
                {stats?.activeVows || 0}
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 floating">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#8E8A84] text-sm">Current Streak</span>
                <Activity size={24} className="text-[#E3C27D]" strokeWidth={1.5} />
              </div>
              <p className="text-3xl font-light text-[#F4F1ED]" style={{ fontFamily: "'Playfair Display', serif" }}>
                {stats?.currentStreak || 0}
              </p>
              <p className="text-xs text-[#8E8A84] mt-1">days</p>
            </div>

            <div className="glass-card rounded-2xl p-6 floating">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#8E8A84] text-sm">Reflections</span>
                <Sparkles size={24} className="text-[#E3C27D]" strokeWidth={1.5} />
              </div>
              <p className="text-3xl font-light text-[#F4F1ED]" style={{ fontFamily: "'Playfair Display', serif" }}>
                {stats?.totalReflections || 0}
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 floating celebrate-complete">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#8E8A84] text-sm">Alignment</span>
                <div className="w-6 h-6 rounded-full border-2 border-[#E3C27D] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#E3C27D]"></div>
                </div>
              </div>
              <p className="text-3xl font-light text-[#F4F1ED]" style={{ fontFamily: "'Playfair Display', serif" }}>
                {stats?.alignmentScore || 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => router.push('/create-vow')}
            className="glass-card rounded-2xl p-6 floating hover:shadow-xl transition-all text-left"
          >
            <ScrollText size={32} className="text-[#E3C27D] mb-3" strokeWidth={1.5} />
            <h3 className="text-lg font-medium mb-1 text-[#F4F1ED]">Create a Vow</h3>
            <p className="text-sm text-[#8E8A84]">Begin a new commitment</p>
          </button>

          <button
            onClick={() => router.push('/reflection')}
            className="glass-card rounded-2xl p-6 floating hover:shadow-xl transition-all text-left"
          >
            <Sparkles size={32} className="text-[#E3C27D] mb-3" strokeWidth={1.5} />
            <h3 className="text-lg font-medium mb-1 text-[#F4F1ED]">Reflect</h3>
            <p className="text-sm text-[#8E8A84]">Check in with yourself</p>
          </button>

          <button
            onClick={() => router.push('/log-trigger')}
            className="glass-card rounded-2xl p-6 floating hover:shadow-xl transition-all text-left"
          >
            <Activity size={32} className="text-[#E3C27D] mb-3" strokeWidth={1.5} />
            <h3 className="text-lg font-medium mb-1 text-[#F4F1ED]">Log Pattern</h3>
            <p className="text-sm text-[#8E8A84]">Track your triggers</p>
          </button>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-medium text-[#F4F1ED] mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/profile')}
              className="w-full text-left p-4 rounded-xl glass-button floating"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#F4F1ED]">View Profile</p>
                  <p className="text-sm text-[#8E8A84]">Manage your account</p>
                </div>
                <User size={24} className="text-[#E3C27D]" strokeWidth={1.5} />
              </div>
            </button>

            {showUpgrade && (
              <button
                onClick={() => router.push('/pricing')}
                className="w-full text-left p-4 rounded-xl glass-button floating"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#F4F1ED]">Unlock Path</p>
                    <p className="text-sm text-[#8E8A84]">
                      {userData?.subscriptionStatus === 'active' 
                        ? 'Manage your journey' 
                        : 'Continue your transformation'}
                    </p>
                  </div>
                  <Unlock size={24} className="text-[#E3C27D]" strokeWidth={1.5} />
                </div>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Upgrade Modal */}
      {upgradeModal.show && (
        <UpgradeModal
          tier={upgradeModal.tier}
          onClose={closeUpgradeModal}
          onUpgrade={handleUpgrade}
          loading={upgrading}
        />
      )}
    </div>
  );
}
