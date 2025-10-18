import { useEffect, useState } from 'react';

export default function ProgressRing({ percentage = 0, size = 120, strokeWidth = 8 }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const getTierLabel = (pct) => {
    if (pct === 0) return 'awakening phase';
    if (pct < 33) return 'gathering energy';
    if (pct < 66) return 'ascending';
    return 'aligned';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(244, 241, 237, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle - ORIGINAL GOLD GRADIENT */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={mounted ? offset : circumference}
          style={{
            transition: 'stroke-dashoffset 2s ease-out',
          }}
        />
        
        {/* Gradient definition - ORIGINAL COLORS */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E3C27D" />
            <stop offset="100%" stopColor="#F4F1ED" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-light text-[#F4F1ED]" style={{ fontFamily: "'Playfair Display', serif" }}>
          {percentage}%
        </div>
        <div className="tier-label mt-1">{getTierLabel(percentage)}</div>
      </div>

      {/* Pulse effect at 0% - ORIGINAL GOLD */}
      {percentage === 0 && (
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(227, 194, 125, 0.2) 0%, transparent 70%)',
            animation: 'gentlePulse 3s ease-in-out infinite'
          }}
        />
      )}
    </div>
  );
}
