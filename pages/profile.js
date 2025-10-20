/**
 * Profile Page
 * User profile with stats, achievements, and history
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ProtectedRoute from '../components/ProtectedRoute';
import { ProfileCard } from '../components/ProfileAvatar';
import StreakMeter, { StreakMilestones } from '../components/charts/StreakMeter';
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
      
      // Load user data
      const userResponse = await fetch('/api/userData', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (userResponse.ok) {
        const data = await userResponse.json();
        setUserData(data.data);
        setStats(data.data.stats || {});
      }

      // Load achievements
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
          <p className="observation-text">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Head>
        <title>Profile - VOW</title>
      </Head>

      {/* Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <h1 className="text-lg font-medium text-gray-900">Profile</h1>
            <button
              onClick={() => router.push('/settings')}
              className="text-gray-600 hover:text-gray-900"
            >
              Settings →
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <ProfileCard 
              userData={userData} 
              onEdit={() => router.push('/settings')}
            />

            {/* Streak Display */}
            <div className="separation-card rounded-xl p-6">
              <h3 className="font-bold awareness-text mb-4">Current Streak</h3>
              <StreakMeter streak={stats?.currentStreak || 0} size="large" />
            </div>

            {/* Level Display */}
            <div className="separation-card rounded-xl p-6 text-center">
              <div className="text-5xl mb-3">⭐</div>
              <div className="text-3xl font-bold awareness-text mb-1">
                Level {userData?.level || 1}
              </div>
              <div className="text-sm observation-text mb-3">
                Remembrance Master
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${((userData?.xp || 0) % 1000) / 10}%`,
                    backgroundColor: '#C6A664'
                  }}
                />
              </div>
              <div className="text-xs observation-text mt-2">
                {(userData?.xp || 0) % 1000} / 1000 XP
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Overview */}
            <div className="separation-card rounded-xl p-6">
              <h3 className="text-xl font-bold awareness-text mb-4">Your Journey</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  icon="📜"
                  label="Total Vows"
                  value={stats?.totalVows || 0}
                  color="#C6A664"
                />
                <StatCard
                  icon="✅"
                  label="Completed"
                  value={stats?.completedVows || 0}
                  color="#5FD3A5"
                />
                <StatCard
                  icon="💭"
                  label="Reflections"
                  value={stats?.totalReflections || 0}
                  color="#90EE90"
                />
                <StatCard
                  icon="🔥"
                  label="Longest Streak"
                  value={`${stats?.longestStreak || 0} days`}
                  color="#FF6347"
                />
              </div>
            </div>

            {/* Achievements */}
            <div className="separation-card rounded-xl p-6">
              <h3 className="text-xl font-bold awareness-text mb-4">
                Achievements ({achievements.length})
              </h3>
              
              {achievements.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {achievements.map((achievement) => (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🏆</div>
                  <p className="observation-text">
                    Keep practicing to unlock achievements!
                  </p>
                </div>
              )}
            </div>

            {/* Milestones */}
            <div className="separation-card rounded-xl p-6">
              <h3 className="text-xl font-bold awareness-text mb-4">Streak Milestones</h3>
              <StreakMilestones
                currentStreak={stats?.currentStreak || 0}
                longestStreak={stats?.longestStreak || 0}
              />
            </div>

            {/* Activity Summary */}
            <div className="separation-card rounded-xl p-6">
              <h3 className="text-xl font-bold awareness-text mb-4">Recent Activity</h3>
              
              <div className="space-y-3">
                {stats?.recentActivity ? (
                  stats.recentActivity.map((activity, i) => (
                    <ActivityItem key={i} activity={activity} />
                  ))
                ) : (
                  <div className="text-center py-4 observation-text">
                    No recent activity
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-200">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl font-bold awareness-text mb-1">{value}</div>
      <div className="text-xs observation-text">{label}</div>
    </div>
  );
}

function AchievementBadge({ achievement }) {
  return (
    <div 
      className="p-4 rounded-lg text-center transition-all hover:scale-105 cursor-pointer"
      style={{ 
        background: achievement.unlocked 
          ? 'linear-gradient(135deg, #FFD70020 0%, #FFD70040 100%)'
          : 'linear-gradient(135deg, #E5E7EB20 0%, #E5E7EB40 100%)'
      }}
      title={achievement.description}
    >
      <div className={`text-4xl mb-2 ${!achievement.unlocked && 'grayscale opacity-50'}`}>
        {achievement.icon}
      </div>
      <div className="text-xs font-medium awareness-text">
        {achievement.name}
      </div>
      {achievement.unlockedAt && (
        <div className="text-xs observation-text mt-1">
          {new Date(achievement.unlockedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })}
        </div>
      )}
    </div>
  );
}

function ActivityItem({ activity }) {
  const activityIcons = {
    vow_created: '📜',
    vow_completed: '✅',
    reflection: '💭',
    streak: '🔥',
    achievement: '🏆'
  };

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
      <div className="text-2xl">{activityIcons[activity.type] || '📌'}</div>
      <div className="flex-1">
        <div className="text-sm font-medium awareness-text">{activity.title}</div>
        <div className="text-xs observation-text">{activity.description}</div>
      </div>
      <div className="text-xs observation-text">
        {formatTimeAgo(activity.timestamp)}
      </div>
    </div>
  );
}

function formatTimeAgo(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
