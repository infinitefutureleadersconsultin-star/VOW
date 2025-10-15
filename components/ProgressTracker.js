export default function ProgressTracker({ 
  stats = {}, 
  variant = 'card',
  showDetails = true 
}) {
  const {
    totalVows = 0,
    currentStreak = 0,
    longestStreak = 0,
    totalReflections = 0,
    alignmentScore = 0
  } = stats;

  // Calculate progress percentage for alignment
  const alignmentPercentage = Math.min(Math.max(alignmentScore, 0), 100);

  // Get alignment color based on score
  const getAlignmentColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-amber-600 bg-amber-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  // Get alignment message
  const getAlignmentMessage = (score) => {
    if (score >= 80) return 'Excellent alignment! 🌟';
    if (score >= 60) return 'Good progress 💪';
    if (score >= 40) return 'Keep going 🚶';
    return 'Start your journey 🌱';
  };

  const alignmentColor = getAlignmentColor(alignmentScore);
  const alignmentMessage = getAlignmentMessage(alignmentScore);

  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="font-medium text-gray-900">{currentStreak}</p>
            <p className="text-xs text-gray-500">Day Streak</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-2xl">📜</span>
          <div>
            <p className="font-medium text-gray-900">{totalVows}</p>
            <p className="text-xs text-gray-500">Vows</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-2xl">✨</span>
          <div>
            <p className="font-medium text-gray-900">{alignmentScore}%</p>
            <p className="text-xs text-gray-500">Aligned</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center space-x-4 bg-gray-50 rounded-lg p-3">
        <div className="text-center min-w-[60px]">
          <p className="text-2xl font-light text-gray-900">{currentStreak}</p>
          <p className="text-xs text-gray-600">days</p>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Alignment</span>
            <span className="text-sm font-medium text-gray-900">{alignmentScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${alignmentPercentage}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Default: card variant
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Your Progress</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${alignmentColor}`}>
          {alignmentMessage}
        </span>
      </div>

      {/* Alignment Score Circle */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className="text-amber-600 transition-all duration-500"
              style={{
                strokeDasharray: `${2 * Math.PI * 56}`,
                strokeDashoffset: `${2 * Math.PI * 56 * (1 - alignmentPercentage / 100)}`
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-light text-gray-900">{alignmentScore}%</p>
              <p className="text-xs text-gray-600">Alignment</p>
            </div>
          </div>
        </div>
      </div>

      {showDetails && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-light text-gray-900">{totalVows}</p>
              <p className="text-xs text-gray-600">Total Vows</p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-light text-gray-900">{totalReflections}</p>
              <p className="text-xs text-gray-600">Reflections</p>
            </div>
          </div>

          {/* Streak Info */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {currentStreak} day streak
                  </p>
                  <p className="text-xs text-gray-500">
                    Longest: {longestStreak} days
                  </p>
                </div>
              </div>
              
              {currentStreak > 0 && (
                <div className="text-right">
                  <p className="text-xs text-gray-500">Keep it up! 💪</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Mini version for headers/navbars
export function MiniProgressTracker({ stats = {} }) {
  const { currentStreak = 0, alignmentScore = 0 } = stats;

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-1">
        <span className="text-lg">🔥</span>
        <span className="text-sm font-medium text-gray-900">{currentStreak}</span>
      </div>
      
      <div className="w-16 bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-amber-600 h-1.5 rounded-full transition-all"
          style={{ width: `${Math.min(alignmentScore, 100)}%` }}
        />
      </div>
      
      <span className="text-sm font-medium text-gray-900">{alignmentScore}%</span>
    </div>
  );
}
