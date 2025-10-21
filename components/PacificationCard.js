/**
 * Pacification Card Component
 * Interactive card for The Pacification Paradox™
 */

import { useState } from 'react';
import { useRouter } from 'next/router';

export default function PacificationCard({ interactive = true }) {
  const [flipped, setFlipped] = useState(false);
  const router = useRouter();

  return (
    <div className="pacification-card">
      {interactive ? (
        <InteractiveCard 
          flipped={flipped} 
          onFlip={() => setFlipped(!flipped)}
          onLearnMore={() => router.push('/learn_pacification')}
        />
      ) : (
        <StaticCard onLearnMore={() => router.push('/learn_pacification')} />
      )}
    </div>
  );
}

function InteractiveCard({ flipped, onFlip, onLearnMore }) {
  return (
    <div className="relative h-64 cursor-pointer" onClick={onFlip}>
      <div 
        className={`absolute inset-0 transition-all duration-500 transform ${
          flipped ? 'rotate-y-180 opacity-0' : ''
        }`}
      >
        <FrontCard />
      </div>
      
      <div 
        className={`absolute inset-0 transition-all duration-500 transform ${
          flipped ? '' : 'rotate-y-180 opacity-0'
        }`}
      >
        <BackCard onLearnMore={onLearnMore} />
      </div>
    </div>
  );
}

function FrontCard() {
  return (
    <div 
      className="h-full p-6 rounded-xl flex flex-col"
      style={{ background: 'linear-gradient(135deg, #90EE9040 0%, #90EE9060 100%)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-4xl">🕊️</span>
          <div>
            <h3 className="text-xl font-bold awareness-text">Pacification</h3>
            <p className="text-xs observation-text">Principle 1</p>
          </div>
        </div>
        <div className="text-sm observation-text">Click to flip →</div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium awareness-text mb-2">
            Accept Without Fighting
          </p>
          <p className="text-sm observation-text">
            You cannot change what you refuse to see
          </p>
        </div>
      </div>

      <div className="p-3 rounded-lg corrective-bg/50">
        <p className="text-xs italic" style={{ color: '#2F855A' }}>
          "The pattern existed before you saw it. Seeing it is the first step to freedom."
        </p>
      </div>
    </div>
  );
}

function BackCard({ onLearnMore }) {
  return (
    <div 
      className="h-full p-6 rounded-xl flex flex-col"
      style={{ background: 'linear-gradient(135deg, #90EE9060 0%, #90EE9080 100%)' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-4">
        <h4 className="font-bold awareness-text mb-2">The Paradox</h4>
        <p className="text-sm observation-text">
          The moment you stop fighting yourself, you begin to change.
        </p>
      </div>

      <div className="space-y-2 mb-4">
        <PracticePoint text="Observe without judgment" />
        <PracticePoint text="Create distance from behavior" />
        <PracticePoint text="Find peace before change" />
      </div>

      <button
        onClick={onLearnMore}
        className="mt-auto w-full py-2 rounded-lg font-medium text-white"
        style={{ backgroundColor: '#90EE90' }}
      >
        Learn More
      </button>
    </div>
  );
}

function StaticCard({ onLearnMore }) {
  return (
    <div 
      className="p-6 rounded-xl"
      style={{ background: 'linear-gradient(135deg, #90EE9040 0%, #90EE9060 100%)' }}
    >
      <div className="flex items-start space-x-4 mb-4">
        <div className="text-5xl">🕊️</div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold awareness-text mb-2">
            The Pacification Paradox™
          </h3>
          <p className="text-sm observation-text mb-3">
            Principle 1: Accept Without Fighting
          </p>
          <p className="observation-text mb-4">
            You cannot change what you refuse to see. Observation creates distance. 
            Distance creates choice. Choice creates freedom.
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <PracticePoint text="Notice patterns without judgment" />
        <PracticePoint text="Observe, don't fight" />
        <PracticePoint text="Acceptance is not approval" />
        <PracticePoint text="Peace comes before change" />
      </div>

      <div className="p-3 rounded-lg corrective-bg/50 mb-4">
        <p className="text-sm italic" style={{ color: '#2F855A' }}>
          "The pattern existed before you saw it. Seeing it is the first step to freedom."
        </p>
      </div>

      <button
        onClick={onLearnMore}
        className="w-full py-3 rounded-lg font-medium text-white"
        style={{ backgroundColor: '#90EE90' }}
      >
        Explore Pacification →
      </button>
    </div>
  );
}

function PracticePoint({ text }) {
  return (
    <div className="flex items-center space-x-2">
      <div 
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: '#90EE90' }}
      />
      <span className="text-sm observation-text">{text}</span>
    </div>
  );
}

/**
 * Mini Pacification Card
 */
export function MiniPacificationCard({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-lg transition-all hover:shadow-lg"
      style={{ background: 'linear-gradient(135deg, #90EE9020 0%, #90EE9040 100%)' }}
    >
      <div className="flex items-center space-x-3">
        <span className="text-3xl">🕊️</span>
        <div className="flex-1">
          <h4 className="font-medium awareness-text mb-1">Pacification</h4>
          <p className="text-xs observation-text">Observe without judgment</p>
        </div>
        <span className="text-xl observation-text">→</span>
      </div>
    </button>
  );
}

/**
 * Pacification Prompt Card
 */
export function PacificationPrompt({ onReflect }) {
  const prompts = [
    'What pattern are you noticing today?',
    'Can you observe this without calling it good or bad?',
    'What would it feel like to sit with this awareness?',
    'How has fighting this pattern kept you stuck?'
  ];

  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  return (
    <div 
      className="p-4 rounded-xl"
      style={{ background: 'linear-gradient(135deg, #90EE9030 0%, #90EE9050 100%)' }}
    >
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-2xl">🕊️</span>
        <h4 className="font-medium awareness-text">Pacification Prompt</h4>
      </div>
      
      <p className="text-sm observation-text mb-4">
        {randomPrompt}
      </p>

      {onReflect && (
        <button
          onClick={onReflect}
          className="text-sm font-medium"
          style={{ color: '#2F855A' }}
        >
          Reflect on this →
        </button>
      )}
    </div>
  );
}

/**
 * Pacification Check-In
 */
export function PacificationCheckIn({ onComplete }) {
  const [selected, setSelected] = useState(null);

  const options = [
    { id: 'observing', label: 'I\'m observing a pattern', icon: '👁️' },
    { id: 'accepting', label: 'I\'m accepting without judgment', icon: '🙏' },
    { id: 'struggling', label: 'I\'m still fighting it', icon: '⚔️' },
    { id: 'peaceful', label: 'I feel peaceful with this', icon: '☮️' }
  ];

  const handleSelect = (id) => {
    setSelected(id);
    if (onComplete) {
      setTimeout(() => onComplete(id), 500);
    }
  };

  return (
    <div 
      className="p-6 rounded-xl"
      style={{ background: 'linear-gradient(135deg, #90EE9020 0%, #90EE9040 100%)' }}
    >
      <div className="text-center mb-4">
        <span className="text-4xl">🕊️</span>
        <h3 className="text-lg font-bold awareness-text mt-2 mb-1">
          Pacification Check-In
        </h3>
        <p className="text-sm observation-text">
          How are you practicing acceptance today?
        </p>
      </div>

      <div className="space-y-2">
        {options.map(option => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`w-full p-3 rounded-lg text-left transition-all ${
              selected === option.id
                ? 'bg-green-100 border-2 border-green-400'
                : 'corrective-bg/50 hover:corrective-bg/70'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">{option.icon}</span>
              <span className="text-sm font-medium awareness-text">
                {option.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
