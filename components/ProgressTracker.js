/**
 * Progress Tracker Component
 * Visual display of streaks, progress, and achievements
 */

import { useState, useEffect } from 'react';
import { calculateStreak, formatDate } from '../utils/dateUtils';
import { getStreakValue } from '../lib/streakRecovery';
import { calculateVowProgress } from '../utils/vowUtils';

export default function ProgressTracker({ vow, reflections = [], stats = {} }) {
  const [progress, setProgress] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (vow) {
      setProgress(calculateVowProgress(vow));
    }
    
    if (reflections.length > 0) {
      const dates = reflections.map(r => r.createdAt);
      setStreak(calculateStreak(dates));
    } else if (stats.currentStreak !== undefined) {
      setStreak(stats.currentStreak);
    }
  }, [vow, reflections, stats]);

  const streakValue = getStreakValue(streak);
  const daysRemaining = vow ? vow.duration - vow.currentDay : 0;

  return (
    <div className="progress-tracker">
      {/* Streak Display */}
      <div className="streak-section mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium awareness-text">Current Streak</h3>
          <span className="text-3xl">{streakValue.emoji}</span>
        </div>
        
        <div className="streak-display">
          <div className="text-center p-6 rounded-xl separation-card">
            <div className="text-5xl font-bold" style={{ color: streakValue.color }}>
              {streak}
            </div>
            <div className="text-sm observation-text mt-2">
              {streak === 1 ? 'Day' : 'Days'}
            </div>
            <div className="text-xs mt-2 px-3 py-1 rounded-full inline-block"
                 style={{ 
                   backgroundColor: `${streakValue.color}20`,
                   color: streakValue.color 
                 }}>
              {streakValue.label}
            </div>
          </div>
        </div>
      </div>

      {/* Vow Progress */}
      {vow && (
        <div className="vow-progress-section">
          <h3 className="text-lg font-medium awareness-text mb-3">Vow Progress</h3>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm observation-text mb-2">
              <span>Day {vow.currentDay}</span>
              <span>{daysRemaining} days remaining</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #C6A664 0%, #5FD3A5 100%)'
                }}
              />
            </div>
            <div className="text-center mt-2 text-sm font-medium" style={{ color: '#C6A664' }}>
              {progress}% Complete
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-3 rounded-lg separation-card text-center">
              <div className="text-2xl font-bold awareness-text">
                {vow.currentDay}
              </div>
              <div className="text-xs observation-text">Days Active</div>
            </div>
            
            <div className="p-3 rounded-lg separation-card text-center">
              <div className="text-2xl font-bold awareness-text">
                {vow.duration}
              </div>
              <div className="text-xs observation-text">Total Days</div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Stats */}
      {stats && Object.keys(stats).length > 0 && (
        <div className="stats-section mt-6">
          <h3 className="text-lg font-medium awareness-text mb-3">Your Journey</h3>
          
          <div className="space-y-2">
            {stats.totalReflections !== undefined && (
              <div className="flex items-center justify-between p-3 rounded-lg separation-card">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">📝</span>
                  <span className="observation-text">Reflections</span>
                </div>
                <span className="font-medium awareness-text">{stats.totalReflections}</span>
              </div>
            )}
            
            {stats.triggersLogged !== undefined && (
              <div className="flex items-center justify-between p-3 rounded-lg separation-card">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🎯</span>
                  <span className="observation-text">Triggers Logged</span>
                </div>
                <span className="font-medium awareness-text">{stats.triggersLogged}</span>
              </div>
            )}
            
            {stats.longestStreak !== undefined && (
              <div className="flex items-center justify-between p-3 rounded-lg separation-card">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🔥</span>
                  <span className="observation-text">Longest Streak</span>
                </div>
                <span className="font-medium awareness-text">{stats.longestStreak}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Motivational Message */}
      {streak > 0 && (
        <div className="mt-6 p-4 rounded-lg" style={{ background: 'linear-gradient(135deg, #C6A66420 0%, #5FD3A520 100%)' }}>
          <p className="text-sm observation-text text-center">
            {streak >= 30 && "You're building lasting change. Neural pathways are forming."}
            {streak >= 7 && streak < 30 && "Consistency is the key. You're doing great."}
            {streak < 7 && "Every day of remembrance matters. Keep going."}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Compact Progress Tracker (for dashboard)
 */
export function CompactProgressTracker({ streak, progress, vow }) {
  const streakValue = getStreakValue(streak);
  
  return (
    <div className="compact-progress flex items-center justify-between p-4 rounded-xl separation-card">
      <div className="flex items-center space-x-4">
        <div className="text-center">
          <div className="text-2xl">{streakValue.emoji}</div>
          <div className="text-xs observation-text mt-1">{streak}d</div>
        </div>
        
        {vow && (
          <div className="flex-1">
            <div className="text-sm observation-text mb-1">
              Day {vow.currentDay}/{vow.duration}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  backgroundColor: streakValue.color
                }}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="text-right">
        <div className="text-xs observation-text">Progress</div>
        <div className="text-lg font-bold awareness-text">{progress}%</div>
      </div>
    </div>
  );
}
