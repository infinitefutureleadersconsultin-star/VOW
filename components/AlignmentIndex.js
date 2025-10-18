import { useEffect, useState } from 'react';

export default function AlignmentIndex({ percentage = 0, activeVows = 0, reflections = 0 }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const size = 140;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="alignment-center rounded-2xl">
      <div className="flex flex-col items-center">
        {/* Label */}
        <p className="text-xs observation-text mb-6 tracking-wide uppercase">
          Current Alignment
        </p>

        {/* Clinical Progress Ring */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background ring - uses theme variable */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="var(--border-color)"
              strokeWidth={strokeWidth}
              fill="none"
            />
            
            {/* Progress ring - matte gold */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="var(--accent-gold)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="butt"
              strokeDasharray={circumference}
              strokeDashoffset={mounted ? offset : circumference}
              className="clinical-ring"
            />
          </svg>

          {/* Center percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span 
              className="text-5xl awareness-text"
              style={{ 
                fontFamily: "'SF Pro Display', -apple-system, sans-serif",
                fontWeight: 500,
                letterSpacing: '-0.02em'
              }}
            >
              {percentage}%
            </span>
          </div>
        </div>

        {/* Metrics - observational data */}
        <div className="flex items-center space-x-6 observation-text text-sm">
          <div className="text-center">
            <p className="text-xl awareness-text font-medium">{activeVows}</p>
            <p className="text-xs mt-1">Active Vows</p>
          </div>
          <div className="w-px h-8" style={{ backgroundColor: 'var(--border-color)' }}></div>
          <div className="text-center">
            <p className="text-xl awareness-text font-medium">{reflections}</p>
            <p className="text-xs mt-1">Reflections</p>
          </div>
        </div>
      </div>
    </div>
  );
}
