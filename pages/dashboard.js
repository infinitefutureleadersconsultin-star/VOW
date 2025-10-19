import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import LoadingSpinner from '../components/LoadingSpinner';
import AlignmentIndex from '../components/AlignmentIndex';
import ProfileAvatar from '../components/ProfileAvatar';
import UpgradeModal from '../components/UpgradeModal';
import { hasCelebrated, MILESTONE_KEYS } from '../utils/celebrationUtils';
import { checkUserAccess } from '../utils/accessControl';
import { api } from '../utils/apiClient';
import { showToast } from '../utils/notificationUtils';
import { ScrollText, Sparkles, Activity, User, AlertCircle, Sun, Moon } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [vows, setVows] = useState([]);  const [error, setError] = useState(null);
  const [accessInfo, setAccessInfo] = useState(null);
  const [upgradeModal, setUpgradeModal] = useState({ show: false, tier: null });
  const [upgrading, setUpgrading] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const token = localStorage.getItem('vow_auth_token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('vow_theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    fetchUserData(token);
  }, [router]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('vow_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

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

      // Fetch vows
      const vowsResponse = await fetch('/api/vows', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (vowsResponse.ok) {
        const vowsData = await vowsResponse.json();
        setVows(vowsData.vows || []);
      }
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
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 corrective-bg">
        <div className="separation-card rounded-xl p-8 max-w-md w-full text-center">
          <div className="icon-gold text-4xl mb-4">⚠</div>
          <h2 className="text-xl awareness-text mb-2">
            Connection Issue
          </h2>
          <p className="observation-text mb-6">{error}</p>
          <button
            onClick={() => {
              const token = localStorage.getItem('vow_auth_token');
              if (token) fetchUserData(token);
            }}
            className="vow-action px-6 py-2 rounded-lg surgical-transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>VOW - Dashboard</title>
        <link rel="stylesheet" href="/corrective-separation.css" />
      </Head>

      <div className="min-h-screen corrective-bg">
        {/* Header with theme toggle */}
        <header className="border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 
                className="text-2xl awareness-text tracking-tight"
                style={{ fontFamily: "'SF Pro Display', sans-serif", fontWeight: 600 }}
              >
                VOW
              </h1>
              
              <div className="flex items-center space-x-4">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="mode-toggle flex items-center space-x-2"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun size={16} />
                      <span>Light</span>
                    </>
                  ) : (
                    <>
                      <Moon size={16} />
                      <span>Dark</span>
                    </>
                  )}
                </button>
                
                <ProfileAvatar userData={userData} onLogout={handleLogout} />
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Trial Banner */}
          {accessInfo?.isTrial && (
            <div className="mb-6 p-4 rounded-xl separation-card" style={{ borderColor: 'var(--accent-gold)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertCircle size={20} className="icon-gold" />
                  <div>
                    <p className="awareness-text text-sm font-medium">
                      Trial Active
                    </p>
                    <p className="observation-text text-xs">
                      {accessInfo.daysLeft} {accessInfo.daysLeft === 1 ? 'day' : 'days'} remaining
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/pricing')}
                  className="vow-action text-xs px-4 py-2 rounded-lg surgical-transition"
                >
                  Upgrade
                </button>
              </div>
            </div>
          )}

          {/* Greeting */}
          <div className="mb-8 unlock-fade">
            <h2 
              className="text-2xl awareness-text mb-1"
              style={{ fontFamily: "'SF Pro Display', sans-serif", fontWeight: 500 }}
            >
              Welcome back, {userData?.name?.split(' ')[0] || 'there'}.
            </h2>
            <p className="observation-text text-sm">
              Continue refining your alignment.
            </p>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left: Alignment Index */}
            <div>
              <AlignmentIndex 
                percentage={stats?.alignmentScore || 0}
                activeVows={stats?.activeVows || 0}
                reflections={stats?.totalReflections || 0}
              />
            </div>

            {/* Right: Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="separation-card rounded-xl p-6 surgical-transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="observation-text text-xs uppercase tracking-wide">Active Vows</span>
                  <ScrollText size={18} className="icon-gold" strokeWidth={2} />
                </div>
                <p 
                  className="text-3xl awareness-text"
                  style={{ fontFamily: "'SF Pro Display', sans-serif", fontWeight: 500 }}
                >
                  {stats?.activeVows || 0}
                </p>
              </div>

              <div className="separation-card rounded-xl p-6 surgical-transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="observation-text text-xs uppercase tracking-wide">Reflections</span>
                  <Sparkles size={18} className="icon-gold" strokeWidth={2} />
                </div>
                <p 
                  className="text-3xl awareness-text"
                  style={{ fontFamily: "'SF Pro Display', sans-serif", fontWeight: 500 }}
                >
                  {stats?.totalReflections || 0}
                </p>
              </div>

              <div className="separation-card rounded-xl p-6 surgical-transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="observation-text text-xs uppercase tracking-wide">Triggers</span>
                  <Activity size={18} className="icon-gold" strokeWidth={2} />
                </div>
                <p 
                  className="text-3xl awareness-text"
                  style={{ fontFamily: "'SF Pro Display', sans-serif", fontWeight: 500 }}
                >
                  {stats?.triggersLogged || 0}
                </p>
              </div>

              <div className="separation-card rounded-xl p-6 surgical-transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="observation-text text-xs uppercase tracking-wide">Streak</span>
                  <div className="icon-green">✓</div>
                </div>
                <p 
                  className="text-3xl awareness-text"
                  style={{ fontFamily: "'SF Pro Display', sans-serif", fontWeight: 500 }}
                >
                  {stats?.currentStreak || 0}
                </p>
                <p className="observation-text text-xs mt-1">days</p>
              </div>
            </div>
          </div>

          {/* Action Cards - FIXED TEXT VISIBILITY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => router.push('/create-vow')}
              className="action-card-clinical rounded-xl surgical-transition text-left"
            >
              <ScrollText size={24} className="icon-gold mb-4" strokeWidth={2} />
              <h3 className="text-lg awareness-text font-medium mb-1">New Vow</h3>
              <p className="observation-text text-sm">Create commitment</p>
            </button>

            <button
              onClick={() => router.push('/reflection')}
              className="action-card-clinical rounded-xl surgical-transition text-left"
            >
              <Sparkles size={24} className="icon-gold mb-4" strokeWidth={2} />
              <h3 className="text-lg awareness-text font-medium mb-1">Check-In</h3>
              <p className="observation-text text-sm">Observe patterns</p>
            </button>

            <button
              onClick={() => router.push('/log-trigger')}
              className="action-card-clinical rounded-xl surgical-transition text-left"
            >
              <Activity size={24} className="icon-gold mb-4" strokeWidth={2} />
              <h3 className="text-lg awareness-text font-medium mb-1">Track Trigger</h3>
              <p className="observation-text text-sm">Log awareness</p>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="separation-card rounded-xl p-6">
            <h3 className="awareness-text font-medium mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => router.push('/profile')}
                className="w-full text-left p-4 rounded-lg surgical-transition hover:bg-opacity-50"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="awareness-text text-sm font-medium">Profile</p>
                    <p className="observation-text text-xs">Manage account</p>
                  </div>
                  <User size={20} className="icon-gold" strokeWidth={2} />
                </div>
              </button>
            </div>
          </div>
          {/* Active Vows */}
          {vows.length > 0 && (
            <div className="mt-8 separation-card rounded-xl p-6">
              <h3 className="awareness-text font-medium mb-4">Your Active Vows</h3>
              <div className="space-y-4">
                {vows.map((vow) => (
                  <div key={vow.id} className="p-4 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
                    <p className="awareness-text font-medium mb-2">{vow.statement}</p>
                    <div className="flex items-center space-x-4 observation-text text-sm">
                      <span>📅 {vow.duration} days</span>
                      <span>📂 {vow.category}</span>
                      <span>Day {vow.currentDay || 0}/{vow.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
    </>
  );
}
