import { useState, useEffect } from 'react';
import { getWelcomeVideo, markVideoAsSeen } from '../lib/welcomeVideos';

export default function WelcomeVideo({ user, onClose }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [hasWatched, setHasWatched] = useState(false);

  useEffect(() => {
    if (user) {
      setVideoUrl(getWelcomeVideo(user));
    }
  }, [user]);

  const handleVideoEnd = () => {
    setHasWatched(true);
  };

  const handleBegin = () => {
    markVideoAsSeen(user.userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white relative"><button onClick={handleBegin} className="absolute top-4 right-4 text-white hover:text-amber-200 text-sm">Skip</button><div className="text-center">
          <div className="text-4xl mb-2">🕊️</div>
          <h2 className="text-3xl font-bold mb-2">
            Welcome to The Vow Theory
          </h2>
          <p className="text-amber-100">
            Understanding the framework that will guide your journey
          </p>
        </div>

        {/* Video */}
        <div className="relative aspect-video bg-gray-900">
          <video
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-full"
            onEnded={handleVideoEnd}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support video playback.
          </video>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50">
          <div className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-gray-700">
              <strong>What you just learned:</strong>
            </p>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              <li>✓ The Daily Law of Remembrance</li>
              <li>✓ The 3 Principles: Pacification, Confrontation, Integration</li>
              <li>✓ How to use your daily vow and reflections</li>
              <li>✓ Your journey of separation through awareness</li>
            </ul>
          </div>

          <button
            onClick={handleBegin}
            disabled={false}
            className={`w-full px-8 py-4 rounded-lg font-medium text-lg transition-all ${
              hasWatched
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {hasWatched ? 'Begin Your Journey →' : 'Skip Video & Begin →'}
          </button>

          {hasWatched && (
            <p className="text-center text-xs text-gray-500 mt-3">
              You can replay this video anytime from Settings
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
