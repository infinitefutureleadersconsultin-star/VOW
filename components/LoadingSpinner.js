/**
 * Loading Spinner Component
 * Generic loading states for the app
 */

export default function LoadingSpinner({ size = 'medium', text = 'Loading...', fullScreen = false }) {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const Spinner = () => (
    <div className={`${sizeClasses[size]} relative`}>
      <div className="absolute inset-0 rounded-full border-4 border-[#E3C27D]/20" />
      <div 
        className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
        style={{
          borderTopColor: '#C6A664',
          borderRightColor: '#5FD3A5'
        }}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center corrective-bg/90 z-50">
        <div className="text-center">
          <Spinner />
          {text && <p className="mt-4 observation-text">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Spinner />
        {text && <p className="mt-4 observation-text">{text}</p>}
      </div>
    </div>
  );
}

/**
 * Inline Spinner (for buttons)
 */
export function InlineSpinner({ size = 'small' }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6'
  };

  return (
    <div className={`${sizeClasses[size]} relative inline-block`}>
      <div className="absolute inset-0 rounded-full border-2 border-white/30" />
      <div 
        className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
        style={{ borderTopColor: 'white' }}
      />
    </div>
  );
}

/**
 * Pulse Loader
 */
export function PulseLoader({ color = '#C6A664' }) {
  return (
    <div className="flex space-x-2">
      <div 
        className="w-3 h-3 rounded-full animate-pulse"
        style={{ backgroundColor: color, animationDelay: '0ms' }}
      />
      <div 
        className="w-3 h-3 rounded-full animate-pulse"
        style={{ backgroundColor: color, animationDelay: '150ms' }}
      />
      <div 
        className="w-3 h-3 rounded-full animate-pulse"
        style={{ backgroundColor: color, animationDelay: '300ms' }}
      />
    </div>
  );
}

/**
 * Skeleton Loader
 */
export function SkeletonLoader({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i}
          className="h-4 bg-gray-200 rounded animate-pulse"
          style={{ width: `${100 - (i * 10)}%` }}
        />
      ))}
    </div>
  );
}

/**
 * Card Skeleton
 */
export function CardSkeleton() {
  return (
    <div className="separation-card bg-[#1A1C1F] border border-[#E3C27D]/20 rounded-xl p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}

/**
 * Progress Bar Loader
 */
export function ProgressBar({ progress = 0, showPercent = true }) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-2">
        <span className="observation-text">Loading...</span>
        {showPercent && (
          <span className="font-medium awareness-text">{Math.round(progress)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #C6A664 0%, #5FD3A5 100%)'
          }}
        />
      </div>
    </div>
  );
}

/**
 * Circular Progress
 */
export function CircularProgress({ progress = 0, size = 100 }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C6A664" />
            <stop offset="100%" stopColor="#5FD3A5" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold awareness-text">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}

/**
 * Dots Loader
 */
export function DotsLoader({ size = 'medium' }) {
  const sizeClasses = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4'
  };

  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size]} rounded-full animate-bounce`}
          style={{
            backgroundColor: '#C6A664',
            animationDelay: `${i * 150}ms`
          }}
        />
      ))}
    </div>
  );
}

/**
 * Shimmer Effect
 */
export function ShimmerBox({ className = '', height = 'h-20' }) {
  return (
    <div className={`${height} ${className} bg-gray-200 rounded-lg overflow-hidden relative`}>
      <div 
        className="absolute inset-0 shimmer"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
          animation: 'shimmer 1.5s infinite'
        }}
      />
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

/**
 * Vow Loading State
 */
export function VowLoading() {
  return (
    <div className="text-center p-12">
      <div className="text-6xl mb-4 animate-pulse">📿</div>
      <h3 className="text-lg font-medium awareness-text mb-2">
        Loading your vow...
      </h3>
      <PulseLoader />
    </div>
  );
}

/**
 * Dashboard Loading State
 */
export function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <SkeletonLoader lines={2} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <ShimmerBox key={i} height="h-32" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

/**
 * Button Loading State
 */
export function ButtonLoading({ children, loading = false, ...props }) {
  return (
    <button {...props} disabled={loading}>
      {loading ? (
        <span className="flex items-center justify-center space-x-2">
          <InlineSpinner />
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
