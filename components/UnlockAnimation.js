import { useEffect, useState } from 'react';
import { Unlock } from 'lucide-react';

export default function UnlockAnimation({ onComplete }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timings = [
      500,  // VOW appears
      1500, // Transform to lock
      2500, // Key appears
      3500, // Unlock
    ];

    timings.forEach((delay, index) => {
      setTimeout(() => setStage(index + 1), delay);
    });

    setTimeout(onComplete, 4000);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center">
      {/* Stage 1: VOW text */}
      {stage >= 1 && (
        <div
          className={`absolute transition-all duration-1000 ${
            stage === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <h1 className="text-6xl font-light tracking-widest text-gray-100">
            VOW
          </h1>
        </div>
      )}

      {/* Stage 2-4: Lock animation */}
      {stage >= 2 && (
        <div
          className={`transition-all duration-1000 ${
            stage >= 2 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative">
            {/* Lock icon */}
            <Unlock
              size={80}
              className={`text-yellow-600 transition-all duration-1000 ${
                stage === 4 ? 'rotate-12 scale-110' : ''
              }`}
              strokeWidth={1.5}
            />
            
            {/* Glow effect on unlock */}
            {stage === 4 && (
              <div className="absolute inset-0 animate-ping">
                <div className="w-full h-full rounded-full bg-yellow-600 opacity-20"></div>
              </div>
            )}
          </div>

          {/* Subtitle */}
          {stage === 4 && (
            <p className="text-center text-yellow-600 mt-6 font-light animate-fade-in">
              Your identity unlocked
            </p>
          )}
        </div>
      )}
    </div>
  );
}
