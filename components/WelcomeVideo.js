import { useState, useEffect } from 'react';
import { getWelcomeVideo, markVideoAsSeen } from '../lib/welcomeVideos';
export default function WelcomeVideo({ user, onClose }) {
  const behaviorMessages = {
  addiction: 'VOW Theory helps you remember who you were before addiction became a companion.',
  anxiety: 'VOW Theory helps you remember who you were before anxiety took hold.',
  'self-sabotage': 'VOW Theory helps you understand patterns that no longer serve you.',
  isolation: 'VOW Theory helps you reconnect with the self that existed before withdrawal.',
  shutdown: 'VOW Theory helps you understand your protective responses with compassion.',
  avoidance: 'VOW Theory helps you face what you have been avoiding with awareness.',
  procrastination: 'VOW Theory helps you separate behavior from identity.',
  perfectionism: 'VOW Theory helps you remember wholeness does not require perfection.',
  'people-pleasing': 'VOW Theory helps you reclaim your authentic self.',
  other: 'VOW Theory helps you remember who you are beyond what happened to you.'
};
const behaviorMessage = user?.behavior ? behaviorMessages[user.behavior] : behaviorMessages.other;

  const [videoUrl, setVideoUrl] = useState('');
  const [hasWatched, setHasWatched] = useState(false);
  useEffect(() => { if (user) setVideoUrl(getWelcomeVideo(user)); }, [user]);
  const handleVideoEnd = () => setHasWatched(true);
  const handleBegin = () => { markVideoAsSeen(user.userId); onClose(); };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="corrective-bg rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white relative">
          <button onClick={handleBegin} className="absolute top-4 right-4 text-white hover:text-amber-200 text-sm font-medium">Skip</button>
          <div className="text-center">
            <div className="text-4xl mb-2">🕊️</div>
            <h2 className="text-3xl font-bold mb-2">Welcome to VOW Theory</h2>
            <p className="text-amber-100 mb-2">I see you are here for {user?.behavior?.replace("-", " ")}.</p>
            <p className="text-amber-50 text-sm">{behaviorMessage}</p>
          </div>
        </div>
        <div className="relative aspect-video bg-gray-900">
          <video src={videoUrl} controls autoPlay className="w-full h-full" onEnded={handleVideoEnd}>
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
        <div className="p-6 bg-[#1A1C1F]">
          <button onClick={handleBegin} className="w-full px-8 py-4 rounded-lg font-medium text-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:shadow-lg">
            {hasWatched ? 'Begin Your Journey' : 'Skip Video & Begin'}
          </button>
        </div>
      </div>
    </div>
  );
}