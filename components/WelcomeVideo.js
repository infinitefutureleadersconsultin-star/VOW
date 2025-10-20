import { useState, useEffect } from 'react';
import { getWelcomeVideo, markVideoAsSeen } from '../lib/welcomeVideos';
export default function WelcomeVideo({ user, onClose }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [hasWatched, setHasWatched] = useState(false);
  useEffect(() => { if (user) setVideoUrl(getWelcomeVideo(user)); }, [user]);
  const handleVideoEnd = () => setHasWatched(true);
  const handleBegin = () => { markVideoAsSeen(user.userId); onClose(); };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white relative">
          <button onClick={handleBegin} className="absolute top-4 right-4 text-white hover:text-amber-200 text-sm font-medium">Skip</button>
          <div className="text-center">
            <div className="text-4xl mb-2">🕊️</div>
            <h2 className="text-3xl font-bold mb-2">Welcome to The Vow Theory</h2>
            <p className="text-amber-100">Understanding the framework that will guide your journey</p>
          </div>
        </div>
        <div className="relative aspect-video bg-gray-900">
          <video src={videoUrl} controls autoPlay className="w-full h-full" onEnded={handleVideoEnd}>
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
        <div className="p-6 bg-gray-50">
          <button onClick={handleBegin} className="w-full px-8 py-4 rounded-lg font-medium text-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:shadow-lg">
            {hasWatched ? 'Begin Your Journey' : 'Skip Video & Begin'}
          </button>
        </div>
      </div>
    </div>
  );
}