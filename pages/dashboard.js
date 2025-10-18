import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressRing from '../components/ProgressRing';
import ProfileAvatar from '../components/ProfileAvatar';
import UpgradeModal from '../components/UpgradeModal';
import { hasCelebrated, MILESTONE_KEYS } from '../utils/celebrationUtils';
import { checkUserAccess } from '../utils/accessControl';
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

      const access = checkUserAccess(result.data);
      setAccessInfo(access);

      checkUpgradeMilestones(result.data);

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
    if (!user.createdAt) return;

    const createdDate = new Date(user.createdAt);
    const now = new Date();
    const daysActive = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));

    const seenReflection = localStorage.getItem('upgrade_reflection_seen');
    const seenLiberation = localStorage.getItem('upgrade_liberation_seen');

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
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0C0E13' }}>
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
    <>
      <Head>
        <title>Dashboard - VOW</title>
        <link rel="stylesheet" href="/dashboard-enhanced.css" />
      </Head>

      <div className="min-h-screen dashboard-bg">
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

          {/* Enhanced Greeting */}
          <div className="mb-8 greeting-fade">
            <h2 className="text-3xl font-light text-[#F4F1ED] greeting-glow mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Welcome back, {userData?.name?.split(' ')[0] || 'there'}. Your path continues.
            </h2>
            <p className="text-[#8E8A84] text-sm">Every moment you return, your vow strengthens.</p>
          </div>

          {/* Enhanced Progress + Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Animated Progress Ring */}
            <div className="glass-card rounded-2xl p-6 floating alignment-glow">
              <div className="flex flex-col items-center">
                <p className="text-sm text-[#8E8A84] mb-4">Alignment</p>
                <ProgressRing percentage={stats?.alignmentScore || 0} />
                {stats?.alignmentScore === 0 && (
                  <p className="text-xs text-[#8E8A84] mt-4 italic">Your energy is gathering.</p>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div className="glass-card rounded-2xl p-6 floating smooth-transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#8E8A84] text-sm">Active Vows</span>
                  <ScrollText size={24} className="text-[#E3C27D]" strokeWidth={1.5} />
                </div>
                <p className="text-3xl font-light text-[#F4F1ED]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {stats?.activeVows || 0}
                </p>
              </div>

              <div className="glass-card rounded-2xl p-6 floating smooth-transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#8E8A84] text-sm">Current Streak</span>
                  <Activity size={24} className="text-[#E3C27D]" strokeWidth={1.5} />
                </div>
                <p className="text-3xl font-light text-[#F4F1ED]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {stats?.currentStreak || 0}
                </p>
                <p className="text-xs text-[#8E8A84] mt-1">days</p>
              </div>

              <div className="glass-card rounded-2xl p-6 floating smooth-transition col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#8E8A84] text-sm">Reflections</span>
                  <Sparkles size={24} className="text-[#E3C27D]" strokeWidth={1.5} />
                </div>
                <p className="text-3xl font-light text-[#F4F1ED]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {stats?.totalReflections || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Action Cards - Enlarged & Reordered */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button
              onClick={() => router.push('/create-vow')}
              className="action-card-create rounded-2xl p-8 floating smooth-transition hover:shadow-xl text-left h-48 flex flex-col justify-between"
            >
              <ScrollText size={40} className="text-[#E3C27D] mb-4" strokeWidth={1.5} />
              <div>
                <h3 className="text-xl font-medium mb-2 text-[#F4F1ED]">Create a Vow</h3>
                <p className="text-sm text-[#8E8A84]">Begin a new commitment</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/reflection')}
              className="action-card-reflect rounded-2xl p-8 floating smooth-transition hover:shadow-xl text-left h-48 flex flex-col justify-between"
            >
              <Sparkles size={40} className="text-[#93B89A] mb-4" strokeWidth={1.5} />
              <div>
                <h3 className="text-xl font-medium mb-2 text-[#F4F1ED]">Reflect</h3>
                <p className="text-sm text-[#8E8A84]">Check in with yourself</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/log-trigger')}
              className="action-card-log rounded-2xl p-8 floating smooth-transition hover:shadow-xl text-left h-48 flex flex-col justify-between"
            >
              <Activity size={40} className="text-[#C6D6C0] mb-4" strokeWidth={1.5} />
              <div>
                <h3 className="text-xl font-medium mb-2 text-[#F4F1ED]">Log Pattern</h3>
                <p className="text-sm text-[#8E8A84]">Track your triggers</p>
              </div>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-medium text-[#F4F1ED] mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/profile')}
                className="w-full text-left p-4 rounded-xl glass-button floating smooth-transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#F4F1ED]">View Profile</p>
                    <p className="text-sm text-[#8E8A84]">Manage your account</p>
                  </div>
                  <User size={24} className="text-[#E3C27D]" strokeWidth={1.5} />
                </div>
              </button>
            </div>
          </div>
        </main>

        {/* Floating Unlock Button */}
        {showUpgrade && (
          <button
            onClick={() => router.push('/pricing')}
            className="floating-unlock px-6 py-3 rounded-full text-[#0C0E13] font-medium flex items-center space-x-2 smooth-transition hover:scale-105"
          >
            <Unlock size={20} strokeWidth={2} />
            <span>Unlock Next Path</span>
          </button>
        )}

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
    </>
  );
}
