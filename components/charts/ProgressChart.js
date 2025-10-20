/**
 * Progress Chart Component
 * Visual charts for tracking progress and remembrance
 */

import { useEffect, useRef } from 'react';

/**
 * Alignment Index / Remembrance Meter
 */
export default function ProgressChart({ score = 0, size = 200 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    drawChart();
  }, [score]);

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 15;
    ctx.stroke();

    // Progress arc
    const startAngle = -Math.PI / 2; // Start at top
    const endAngle = startAngle + (score / 100) * 2 * Math.PI;

    // Gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#C6A664');
    gradient.addColorStop(1, '#5FD3A5');

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Center text
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(score)}%`, centerX, centerY);
  };

  const getAlignmentLevel = (score) => {
    if (score >= 90) return { label: 'Aligned', color: '#5FD3A5', icon: '✨' };
    if (score >= 75) return { label: 'Growing', color: '#C6A664', icon: '🌟' };
    if (score >= 50) return { label: 'Building', color: '#FFA500', icon: '🌱' };
    return { label: 'Starting', color: '#90EE90', icon: '🌿' };
  };

  const level = getAlignmentLevel(score);

  return (
    <div className="progress-chart text-center">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="mx-auto"
      />
      <div className="mt-4">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="text-2xl">{level.icon}</span>
          <span className="font-medium" style={{ color: level.color }}>
            {level.label}
          </span>
        </div>
        <p className="text-sm observation-text">Alignment Index</p>
      </div>
    </div>
  );
}

/**
 * Weekly Activity Chart
 */
export function WeeklyActivityChart({ data = [] }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="weekly-chart">
      <div className="flex items-end justify-between h-40 space-x-2">
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 100;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="flex-1 flex items-end w-full">
                <div
                  className="w-full rounded-t transition-all"
                  style={{
                    height: `${height}%`,
                    background: item.value > 0 
                      ? 'linear-gradient(180deg, #C6A664 0%, #5FD3A5 100%)'
                      : '#e5e7eb',
                    minHeight: item.value > 0 ? '8px' : '4px'
                  }}
                />
              </div>
              <div className="text-xs observation-text mt-2">
                {days[index]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Emotion Distribution Chart
 */
export function EmotionChart({ emotions = {} }) {
  const total = Object.values(emotions).reduce((sum, val) => sum + val, 0);
  
  if (total === 0) {
    return (
      <div className="text-center p-6 observation-text">
        No emotion data yet
      </div>
    );
  }

  const emotionColors = {
    peaceful: '#90EE90',
    anxious: '#FFB6C1',
    hopeful: '#FFD700',
    frustrated: '#FF6347',
    grateful: '#FF69B4',
    sad: '#4682B4',
    empowered: '#C6A664',
    triggered: '#FF4500'
  };

  return (
    <div className="emotion-chart space-y-3">
      {Object.entries(emotions)
        .sort((a, b) => b[1] - a[1])
        .map(([emotion, count]) => {
          const percentage = (count / total) * 100;
          
          return (
            <div key={emotion}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize observation-text">{emotion}</span>
                <span className="font-medium awareness-text">{count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: emotionColors[emotion] || '#C6A664'
                  }}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}

/**
 * Stage Progress Chart
 */
export function StageProgressChart({ stages = {} }) {
  const total = Object.values(stages).reduce((sum, val) => sum + val, 0);
  
  if (total === 0) {
    return (
      <div className="text-center p-6 observation-text">
        No stage data yet
      </div>
    );
  }

  const stageColors = {
    pacification: '#90EE90',
    confrontation: '#C6A664',
    integration: '#5FD3A5'
  };

  const stageIcons = {
    pacification: '🕊️',
    confrontation: '🔍',
    integration: '✨'
  };

  return (
    <div className="stage-chart">
      <div className="flex items-center justify-center space-x-4 mb-6">
        {Object.entries(stages).map(([stage, count]) => {
          const percentage = Math.round((count / total) * 100);
          
          return (
            <div key={stage} className="text-center">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-2"
                style={{ backgroundColor: `${stageColors[stage]}40` }}
              >
                {stageIcons[stage]}
              </div>
              <div className="text-2xl font-bold" style={{ color: stageColors[stage] }}>
                {percentage}%
              </div>
              <div className="text-xs observation-text capitalize">{stage}</div>
            </div>
          );
        })}
      </div>
      
      {/* Progress bar showing stage distribution */}
      <div className="flex w-full h-4 rounded-full overflow-hidden">
        {Object.entries(stages).map(([stage, count]) => {
          const percentage = (count / total) * 100;
          
          return (
            <div
              key={stage}
              style={{
                width: `${percentage}%`,
                backgroundColor: stageColors[stage]
              }}
              title={`${stage}: ${count}`}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * Trigger Frequency Chart
 */
export function TriggerFrequencyChart({ triggers = [] }) {
  if (triggers.length === 0) {
    return (
      <div className="text-center p-6 observation-text">
        No triggers logged yet
      </div>
    );
  }

  // Group by day
  const groupedByDay = triggers.reduce((acc, trigger) => {
    const date = new Date(trigger.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(groupedByDay).slice(-7);
  const maxValue = Math.max(...data.map(([_, count]) => count), 1);

  return (
    <div className="trigger-chart">
      <div className="flex items-end justify-between h-32 space-x-2">
        {data.map(([date, count], index) => {
          const height = (count / maxValue) * 100;
          const day = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="flex-1 flex items-end w-full">
                <div
                  className="w-full rounded-t transition-all"
                  style={{
                    height: `${height}%`,
                    backgroundColor: '#FF6347',
                    minHeight: '8px'
                  }}
                />
              </div>
              <div className="text-xs observation-text mt-2">{day}</div>
              <div className="text-xs font-medium awareness-text">{count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
