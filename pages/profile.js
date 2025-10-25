import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ProtectedRoute from '../components/ProtectedRoute';
import { ProfileCard } from '../components/ProfileAvatar';
import StreakMeter, { StreakMilestones } from '../components/charts/StreakMeter';
import { useTranslation } from '../lib/translations';
import { loadAuthToken } from '../lib/storage';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = loadAuthToken();
      
      const userResponse = await fetch('/api/userData', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (userResponse.ok) {
        const data = await userResponse.json();
        setUserData(data.data);
        setStats(data.data.stats || {});
      }

      const achievementsResponse = await fetch('/api/achievements', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (achievementsResponse.ok) {
        const data = await achievementsResponse.json();
        setAchievements(data.achievements || []);
      }

    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">👤</div>
          <p className="observation-text">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C1117] to-[#1A1C1F]">
      <Head>
        <title>{t('profile.title')} - VOW</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold awareness-text">{t('profile.title')}</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Card */}
          <div className="separation-card rounded-xl p-6">
            <ProfileCard user={userData} />
            <button
              onClick={() => router.push('/settings')}
              className="mt-6 w-full vow-action py-3 rounded-lg surgical-transition"
            >
              {t('profile.edit')}
            </button>
          </div>

          {/* Stats */}
          <div className="separation-card rounded-xl p-6">
            <h2 className="text-xl font-semibold awareness-text mb-4">
              {t('dashboard.stats_title')}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-[#1A1C1F] rounded-lg">
                <div className="text-3xl icon-gold mb-2">{stats?.totalVows || 0}</div>
                <div className="observation-text text-sm">{t('dashboard.total_vows')}</div>
              </div>
              <div className="text-center p-4 bg-[#1A1C1F] rounded-lg">
                <div className="text-3xl icon-gold mb-2">{stats?.totalReflections || 0}</div>
                <div className="observation-text text-sm">{t('dashboard.reflections')}</div>
              </div>
              <div className="text-center p-4 bg-[#1A1C1F] rounded-lg">
                <div className="text-3xl icon-gold mb-2">{stats?.currentStreak || 0}</div>
                <div className="observation-text text-sm">{t('dashboard.current_streak')}</div>
              </div>
              <div className="text-center p-4 bg-[#1A1C1F] rounded-lg">
                <div className="text-3xl icon-gold mb-2">{Math.round(stats?.alignmentScore || 0)}</div>
                <div className="observation-text text-sm">{t('dashboard.current_alignment')}</div>
              </div>
            </div>
          </div>

          {/* Streak Meter */}
          {stats?.currentStreak > 0 && (
            <div className="md:col-span-2 separation-card rounded-xl p-6">
              <StreakMeter currentStreak={stats.currentStreak} longestStreak={stats.longestStreak || 0} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
