/**
 * Integration Card Component
 * Interactive card for The Integration Cycle™
 */

import { useState } from 'react';
import { useRouter } from 'next/router';

export default function IntegrationCard({ interactive = true }) {
  const [flipped, setFlipped] = useState(false);
  const router = useRouter();

  return (
    <div className="integration-card">
      {interactive ? (
        <InteractiveCard 
          flipped={flipped} 
          onFlip={() => setFlipped(!flipped)}
          onLearnMore={() => router.push('/learn_integration')}
        />
      ) : (
        <StaticCard onLearnMore={() => router.push('/learn_integration')} />
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
      style={{ background: 'linear-gradient(135deg, #5FD3A540 0%, #5FD3A560 100%)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-4xl">✨</span>
          <div>
            <h3 className="text-xl font-bold awareness-text">Integration</h3>
            <p className="text-xs observation-text">Principle 3</p>
          </div>
        </div>
        <div className="text-sm observation-text">Click to flip →</div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium awareness-text mb-2">
            Become Whole Again
          </p>
          <p className="text-sm observation-text">
            Merge who you were with who you became
          </p>
        </div>
      </div>

      <div className="p-3 rounded-lg corrective-bg/50">
        <p className="text-xs italic" style={{ color: '#047857' }}>
          "You were whole before. You are becoming whole again."
        </p>
      </div>
    </div>
  );
}

function BackCard({ onLearnMore }) {
  return (
    <div 
      className="h-full p-6 rounded-xl flex flex-col"
      style={{ background: 'linear-gradient(135deg, #5FD3A560 0%, #5FD3A580 100%)' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-4">
        <h4 className="font-bold awareness-text mb-2">The Formula</h4>
        <p className="text-sm font-medium mb-2" style={{ color: '#5FD3A5' }}>
          Original + Adaptive = Integrated
        </p>
      </div>

      <div className="space-y-2 mb-4 text-xs">
        <IntegrationPoint text="Remember who you were" />
        <IntegrationPoint text="Acknowledge who you became" />
        <IntegrationPoint text="Merge both into one" />
      </div>

      <button
        onClick={onLearnMore}
        className="mt-auto w-full py-2 rounded-lg font-medium text-white"
        style={{ backgroundColor: '#5FD3A5' }}
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
      style={{ background: 'linear-gradient(135deg, #5FD3A540 0%, #5FD3A560 100%)' }}
    >
      <div className="flex items-start space-x-4 mb-4">
        <div className="text-5xl">✨</div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold awareness-text mb-2">
            The Integration Cycle™
          </h3>
          <p className="text-sm observation-text mb-3">
            Principle 3: Become Whole Again
          </p>
          <p className="observation-text mb-4">
            You are not choosing one self over another. You are merging both—
            who you were before trauma and who you became through it—into a unified whole.
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <InsightPoint text="Integration is not forgetting" />
        <InsightPoint text="Both selves can exist as one" />
        <InsightPoint text="Wholeness was always there" />
        <InsightPoint text="You were never broken" />
      </div>

      <div className="p-3 rounded-lg corrective-bg/50 mb-4">
        <p className="text-sm italic" style={{ color: '#047857' }}>
          "The healed self and the original self are one."
        </p>
      </div>

      <button
        onClick={onLearnMore}
        className="w-full py-3 rounded-lg font-medium text-white"
        style={{ backgroundColor: '#5FD3A5' }}
      >
        Explore Integration →
      </button>
    </div>
  );
}

function IntegrationPoint({ text }) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-teal-600">✓</span>
      <span className="observation-text">{text}</span>
    </div>
  );
}

function InsightPoint({ text }) {
  return (
    <div className="flex items-center space-x-2">
      <div 
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: '#5FD3A5' }}
      />
      <span className="text-sm observation-text">{text}</span>
    </div>
  );
}

/**
 * Mini Integration Card
 */
export function MiniIntegrationCard({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-lg transition-all hover:shadow-lg"
      style={{ background: 'linear-gradient(135deg, #5FD3A520 0%, #5FD3A540 100%)' }}
    >
      <div className="flex items-center space-x-3">
        <span className="text-3xl">✨</span>
        <div className="flex-1">
          <h4 className="font-medium awareness-text mb-1">Integration</h4>
          <p className="text-xs observation-text">Become whole again</p>
        </div>
        <span className="text-xl observation-text">→</span>
      </div>
    </button>
  );
}

/**
 * Integration Prompt Card
 */
export function IntegrationPrompt({ onReflect }) {
  const prompts = [
    'What quality from your original self do you want to reclaim?',
    'What wisdom from your adaptive self do you want to keep?',
    'How can you be open AND protected at the same time?',
    'What would your whole self choose today?'
  ];

  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  return (
    <div 
      className="p-4 rounded-xl"
      style={{ background: 'linear-gradient(135deg, #5FD3A530 0%, #5FD3A550 100%)' }}
    >
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-2xl">✨</span>
        <h4 className="font-medium awareness-text">Integration Prompt</h4>
      </div>
      
      <p className="text-sm observation-text mb-4">
        {randomPrompt}
      </p>

      {onReflect && (
        <button
          onClick={onReflect}
          className="text-sm font-medium"
          style={{ color: '#047857' }}
        >
          Reflect on this →
        </button>
      )}
    </div>
  );
}

/**
 * Three Selves Visualizer
 */
export function ThreeSelvesVisualizer() {
  return (
    <div 
      className="p-6 rounded-xl"
      style={{ background: 'linear-gradient(135deg, #5FD3A520 0%, #5FD3A540 100%)' }}
    >
      <h3 className="text-lg font-bold awareness-text mb-4 text-center">
        The Three Selves
      </h3>

      <div className="space-y-4">
        <SelfBox
          icon="🌟"
          color="#FFD700"
          title="Original Self"
          subtitle="Who you were before"
          description="Authentic, whole, naturally expressive"
        />
        
        <div className="text-center text-2xl">↓</div>
        
        <SelfBox
          icon="🛡️"
          color="#B7791F"
          title="Adaptive Self"
          subtitle="Who you became"
          description="Protected, cautious, survival-focused"
        />
        
        <div className="text-center text-2xl">↓</div>
        
        <SelfBox
          icon="✨"
          color="#5FD3A5"
          title="Integrated Self"
          subtitle="Who you truly are"
          description="Authentic AND wise, vulnerable AND protected"
        />
      </div>

      <div className="mt-4 p-4 rounded-lg corrective-bg/50 text-center">
        <p className="text-sm font-medium" style={{ color: '#5FD3A5' }}>
          Original + Adaptive = Integrated
        </p>
      </div>
    </div>
  );
}

function SelfBox({ icon, color, title, subtitle, description }) {
  return (
    <div className="p-4 rounded-lg corrective-bg/70 border-2" style={{ borderColor: color }}>
      <div className="flex items-center space-x-3 mb-2">
        <span className="text-3xl">{icon}</span>
        <div>
          <h4 className="font-bold awareness-text">{title}</h4>
          <p className="text-xs" style={{ color }}>{subtitle}</p>
        </div>
      </div>
      <p className="text-sm observation-text">{description}</p>
    </div>
  );
}

/**
 * Integration Check-In
 */
export function IntegrationCheckIn({ onComplete }) {
  const [selected, setSelected] = useState(null);

  const options = [
    { id: 'remembering', label: 'I\'m remembering who I was', icon: '🌟' },
    { id: 'acknowledging', label: 'I see who I became', icon: '🛡️' },
    { id: 'merging', label: 'I\'m merging both selves', icon: '✨' },
    { id: 'whole', label: 'I feel whole', icon: '🦋' }
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
      style={{ background: 'linear-gradient(135deg, #5FD3A520 0%, #5FD3A540 100%)' }}
    >
      <div className="text-center mb-4">
        <span className="text-4xl">✨</span>
        <h3 className="text-lg font-bold awareness-text mt-2 mb-1">
          Integration Check-In
        </h3>
        <p className="text-sm observation-text">
          Where are you in becoming whole?
        </p>
      </div>

      <div className="space-y-2">
        {options.map(option => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`w-full p-3 rounded-lg text-left transition-all ${
              selected === option.id
                ? 'bg-teal-100 border-2 border-teal-400'
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

/**
 * Integration Affirmation Generator
 */
export function IntegrationAffirmation() {
  const affirmations = [
    'I am both who I was and who I became',
    'My vulnerability and my wisdom coexist',
    'I honor all versions of myself',
    'I am whole, not fragmented',
    'Integration is my natural state',
    'I choose authenticity with boundaries'
  ];

  const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

  return (
    <div 
      className="p-6 rounded-xl text-center"
      style={{ background: 'linear-gradient(135deg, #5FD3A540 0%, #5FD3A560 100%)' }}
    >
      <span className="text-5xl mb-4 block">✨</span>
      <p className="text-xl font-medium awareness-text mb-2">
        {randomAffirmation}
      </p>
      <p className="text-sm observation-text">
        Repeat this throughout your day
      </p>
    </div>
  );
}
