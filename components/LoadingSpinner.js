export default function LoadingSpinner({ 
  size = 'md', 
  color = 'amber', 
  text = null,
  fullScreen = false,
  className = ''
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    amber: 'border-amber-600',
    gray: 'border-gray-600',
    white: 'border-white',
    blue: 'border-blue-600',
    green: 'border-green-600',
    red: 'border-red-600'
  };

  const spinnerClass = `animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]} ${className}`;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          <div className={spinnerClass + ' mx-auto mb-4'}></div>
          {text && <p className="text-gray-600 text-sm">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="text-center">
        <div className={spinnerClass + ' mx-auto'}></div>
        {text && <p className="text-gray-600 text-sm mt-2">{text}</p>}
      </div>
    </div>
  );
}

// Inline spinner for buttons
export function InlineSpinner({ size = 'sm', color = 'white', className = '' }) {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5'
  };

  const colorClasses = {
    amber: 'border-amber-600',
    gray: 'border-gray-600',
    white: 'border-white',
    blue: 'border-blue-600'
  };

  return (
    <svg 
      className={`animate-spin ${sizeClasses[size]} ${className}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Skeleton loader for content
export function SkeletonLoader({ lines = 3, className = '' }) {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

// Card skeleton
export function CardSkeleton({ className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 animate-pulse ${className}`}>
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );
}
