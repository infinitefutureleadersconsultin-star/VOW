/**
 * Streak Meter Component
 * Visual streak tracking and calendar view
 */

import { useState } from 'react';
import { formatDate, isToday, daysBetween } from '../../utils/dateUtils';
import { getStreakValue } from '../../lib/streakRecovery';

/**
 * Main Streak Meter with flame animation
 */
export default function StreakMeter({ streak = 0, size = 'large' }) {
  const streakValue = getStreakValue(streak);
  
  const sizeClasses = {
    small: 'text-3xl',
    medium: 'text-5xl',
    large: 'text-7xl'
  };

  const numberSizes = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl'
  };

  return (
    <div className="streak-meter text-center">
      <div 
        className={`${sizeClasses[size]} mb-2 ${streak > 0 ? 'animate-pulse' : ''}`}
      >
        {streakValue.emoji}
      </div>
      <div className={`${numberSizes[size]} font-bold mb-2`} style={{ color: streakValue.color }}>
        {streak}
      </div>
      <div className="text-sm observation-text mb-1">
        {streak === 1 ? 'Day' : 'Days'}
      </div>
      <div 
        className="text-xs px-3 py-1 rounded-full inline-block"
        style={{ 
          backgroundColor: `${streakValue.color}20`,
          color: streakValue.color 
        }}
      >
        {streakValue.label}
      </div>
    </div>
  );
}

/**
 * Streak Calendar - Shows activity over time
 */
export function StreakCalendar({ dates = [], currentMonth = new Date() }) {
  const [selectedDate, setSelectedDate] = useState(null);

  // Generate calendar grid
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay(); // 0 = Sunday

    const calendar = [];
    let week = new Array(7).fill(null);

    // Fill empty days at start
    for (let i = 0; i < startDay; i++) {
      week[i] = null;
    }

    // Fill days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const hasActivity = dates.some(d => d.startsWith(dateStr));
      
      week[date.getDay()] = {
        day,
        date: dateStr,
        hasActivity,
        isToday: isToday(date)
      };

      if (date.getDay() === 6 || day === daysInMonth) {
        calendar.push(week);
        week = new Array(7).fill(null);
      }
    }

    return calendar;
  };

  const calendar = generateCalendar();
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="streak-calendar">
      <h4 className="text-center font-medium awareness-text mb-4">{monthName}</h4>
      
      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs observation-text">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-1">
        {calendar.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIdx) => (
              <CalendarDay
                key={dayIdx}
                day={day}
                onSelect={setSelectedDate}
                isSelected={selectedDate === day?.date}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function CalendarDay({ day, onSelect, isSelected }) {
  if (!day) {
    return <div className="aspect-square" />;
  }

  return (
    <button
      onClick={() => onSelect(day.date)}
      className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all ${
        day.isToday
          ? 'ring-2 ring-blue-500'
          : ''
      } ${
        day.hasActivity
          ? 'bg-gradient-to-br from-green-400 to-green-600 text-white font-medium'
          : 'bg-gray-100 text-gray-400'
      } ${
        isSelected
          ? 'ring-2 ring-amber-500'
          : ''
      }`}
    >
      {day.day}
    </button>
  );
}

/**
 * Streak Heatmap - Year view
 */
export function StreakHeatmap({ dates = [] }) {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), 0, 1);
  const weeks = [];
  let currentWeek = [];

  // Generate all days of the year
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = new Date(d).toISOString().split('T')[0];
    const hasActivity = dates.some(activityDate => activityDate.startsWith(dateStr));
    
    currentWeek.push({
      date: dateStr,
      hasActivity
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return (
    <div className="streak-heatmap overflow-x-auto">
      <div className="inline-flex space-x-1">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col space-y-1">
            {week.map((day, dayIdx) => (
              <div
                key={dayIdx}
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: day.hasActivity ? '#5FD3A5' : '#e5e7eb'
                }}
                title={day.date}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Streak Progress Bar
 */
export function StreakProgressBar({ current = 0, goal = 30 }) {
  const progress = Math.min((current / goal) * 100, 100);
  const streakValue = getStreakValue(current);

  return (
    <div className="streak-progress">
      <div className="flex justify-between text-sm mb-2">
        <span className="observation-text">Streak Progress</span>
        <span className="font-medium awareness-text">{current} / {goal} days</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
          style={{
            width: `${progress}%`,
            backgroundColor: streakValue.color
          }}
        >
          {progress > 20 && (
            <span className="text-xs text-white font-medium">
              {Math.round(progress)}%
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between text-xs mt-2 observation-text">
        <span>Start</span>
        <span>{goal - current} days to goal</span>
      </div>
    </div>
  );
}

/**
 * Streak Milestones
 */
export function StreakMilestones({ currentStreak = 0, longestStreak = 0 }) {
  const milestones = [
    { days: 7, label: 'Week Strong', icon: '🌟', reward: 'First milestone!' },
    { days: 30, label: 'Month Committed', icon: '⚡', reward: 'Neural pathways forming' },
    { days: 90, label: 'Quarter Master', icon: '💎', reward: 'Transformation visible' },
    { days: 365, label: 'Year Liberated', icon: '👑', reward: 'Complete integration' }
  ];

  return (
    <div className="streak-milestones space-y-3">
      {milestones.map(milestone => {
        const achieved = longestStreak >= milestone.days;
        const current = currentStreak >= milestone.days;
        
        return (
          <div
            key={milestone.days}
            className={`p-4 rounded-lg border-2 transition-all ${
              achieved
                ? 'border-green-400 bg-green-50'
                : current
                ? 'border-amber-400 bg-amber-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{milestone.icon}</div>
                <div>
                  <div className="font-medium awareness-text">{milestone.label}</div>
                  <div className="text-sm observation-text">{milestone.days} days</div>
                </div>
              </div>
              <div>
                {achieved ? (
                  <span className="text-green-600 font-medium">✓ Achieved</span>
                ) : current ? (
                  <span className="text-amber-600 font-medium">● In Progress</span>
                ) : (
                  <span className="text-gray-400">{milestone.days - currentStreak} to go</span>
                )}
              </div>
            </div>
            {achieved && (
              <div className="mt-2 text-sm text-green-700 italic">
                {milestone.reward}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Mini Streak Display (for compact spaces)
 */
export function MiniStreakMeter({ streak = 0 }) {
  const streakValue = getStreakValue(streak);
  
  return (
    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full"
         style={{ backgroundColor: `${streakValue.color}20` }}>
      <span className="text-xl">{streakValue.emoji}</span>
      <span className="font-bold" style={{ color: streakValue.color }}>
        {streak}
      </span>
      <span className="text-xs observation-text">day streak</span>
    </div>
  );
}
