/**
 * Confrontation Card Component
 * Interactive card for The Confrontational Model™
 */

import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ConfrontationCard({ interactive = true }) {
  const [flipped, setFlipped] = useState(false);
  const router = useRouter();

  return (
    <div className="confrontation-card">
      {interactive ? (
        <InteractiveCard 
          flipped={flipped} 
          onFlip={() => setFlipped(!flipped)}
          onLearnMore={() => router.push('/learn_confrontation')}
        />
      ) : (
        <StaticCard onLearnMore={() => router.push('/learn_confrontation')} />
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
      style={{ background: 'linear-gradient(135deg, #C6A66440 0%, #C6A66460 100%)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-4xl">🔍</span>
          <div>
            <h3 className="text-xl font-bold awareness-text">Confrontation</h3>
            <p className="text-xs observation-text">Principle 2</p>
          </div>
        </div>
        <div className="text-sm observation-text">Click to flip →</div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium awareness-text mb-2">
            Face the Truth with Compassion
          </p>
          <p className="text-sm observation-text">
            Understand the origins without shame
          </p>
        </div>
      </div>

      <div className="p-3 rounded-lg corrective-bg/50">
        <p className="text-xs italic" style={{ color: '#B7791F' }}>
          "You are not your trauma. You are who you became to survive it."
        </p>
      </div>
    </div>
  );
}

function BackCard({ onLearnMore }) {
  return (
    <div 
      className="h-full p-6 rounded-xl flex flex-col"
      style={{ background: 'linear-gradient(135deg, #C6A66460 0%, #C6A66480 100%)' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-4">
        <h4 className="font-bold awareness-text mb-2">The Three Questions</h4>
        <p className="text-sm observation-text mb-2">
          Gentle investigation, not attack
        </p>
      </div>

      <div className="space-y-2 mb-4 text-xs">
        <QuestionPoint text="When did this pattern begin?" />
        <QuestionPoint text="What was happening then?" />
        <QuestionPoint text="What was it protecting me from?" />
      </div>

      <button
        onClick={onLearnMore}
        className="mt-auto w-full py-2 rounded-lg font-medium text-white"
        style={{ backgroundColor: '#C6A664' }}
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
      style={{ background: 'linear-gradient(135deg, #C6A66440 0%, #C6A66460 100%)' }}
    >
      <div className="flex items-start space-x-4 mb-4">
        <div className="text-5xl">🔍</div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold awareness-text mb-2">
            The Confrontational Model™
          </h3>
          <p className="text-sm observation-text mb-3">
            Principle 2: Face the Truth with Compassion
          </p>
          <p className="observation-text mb-4">
            After observing, you're ready to ask: Why does this exist? 
            Understanding the origin removes shame and replaces it with compassion.
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <InsightPoint text="Every pattern has an origin story" />
        <InsightPoint text="Behaviors protected you once" />
        <InsightPoint text="You are not your trauma" />
        <InsightPoint text="Understanding replaces shame" />
      </div>

      <div className="p-3 rounded-lg corrective-bg/50 mb-4">
        <p className="text-sm italic" style={{ color: '#B7791F' }}>
          "What hurt you once cannot hurt you again—unless you refuse to see it."
        </p>
      </div>

      <button
        onClick={onLearnMore}
        className="w-full py-3 rounded-lg font-medium text-white"
        style={{ backgroundColor: '#C6A664' }}
      >
        Explore Confrontation →
      </button>
    </div>
  );
}

function QuestionPoint({ text }) {
  return (
    <div className="flex items-start space-x-2">
      <span className="text-amber-600 font-bold">?</span>
      <span className="observation-text">{text}</span>
    </div>
  );
}

function InsightPoint({ text }) {
  return (
    <div className="flex items-center space-x-2">
      <div 
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: '#C6A664' }}
      />
      <span className="text-sm observation-text">{text}</span>
    </div>
  );
}

/**
 * Mini Confrontation Card
 */
export function MiniConfrontationCard({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-lg transition-all hover:shadow-lg"
      style={{ background: 'linear-gradient(135deg, #C6A66420 0%, #C6A66440 100%)' }}
    >
      <div className="flex items-center space-x-3">
        <span className="text-3xl">🔍</span>
        <div className="flex-1">
          <h4 className="font-medium awareness-text mb-1">Confrontation</h4>
          <p className="text-xs observation-text">Understand the origins</p>
        </div>
        <span className="text-xl observation-text">→</span>
      </div>
    </button>
  );
}

/**
 * Confrontation Prompt Card
 */
export function ConfrontationPrompt({ onReflect }) {
  const prompts = [
    'When did this pattern first begin?',
    'What was happening in your life at that time?',
    'What emotion or experience was this protecting you from?',
    'Can you see the difference between the pattern and your true self?'
  ];

  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  return (
    <div 
      className="p-4 rounded-xl"
      style={{ background: 'linear-gradient(135deg, #C6A66430 0%, #C6A66450 100%)' }}
    >
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-2xl">🔍</span>
        <h4 className="font-medium awareness-text">Confrontation Prompt</h4>
      </div>
      
      <p className="text-sm observation-text mb-4">
        {randomPrompt}
      </p>

      {onReflect && (
        <button
          onClick={onReflect}
          className="text-sm font-medium"
          style={{ color: '#B7791F' }}
        >
          Explore this →
        </button>
      )}
    </div>
  );
}

/**
 * Origin Story Builder
 */
export function OriginStoryBuilder({ onComplete }) {
  const [answers, setAnswers] = useState({
    when: '',
    what: '',
    protection: ''
  });

  const questions = [
    { 
      key: 'when', 
      label: 'When did this pattern begin?',
      placeholder: 'e.g., When I was 12, after my parents divorced...'
    },
    { 
      key: 'what', 
      label: 'What was happening in your life?',
      placeholder: 'e.g., Constant conflict at home, feeling unsafe...'
    },
    { 
      key: 'protection', 
      label: 'What was this protecting you from?',
      placeholder: 'e.g., Being blamed, feeling responsible...'
    }
  ];

  const isComplete = Object.values(answers).every(v => v.trim().length > 0);

  return (
    <div 
      className="p-6 rounded-xl"
      style={{ background: 'linear-gradient(135deg, #C6A66420 0%, #C6A66440 100%)' }}
    >
      <div className="text-center mb-4">
        <span className="text-4xl">🔍</span>
        <h3 className="text-lg font-bold awareness-text mt-2 mb-1">
          Your Pattern's Origin Story
        </h3>
        <p className="text-sm observation-text">
          Understanding creates compassion
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((q, index) => (
          <div key={q.key}>
            <label className="block text-sm font-medium awareness-text mb-2">
              {index + 1}. {q.label}
            </label>
            <textarea
              value={answers[q.key]}
              onChange={(e) => setAnswers({ ...answers, [q.key]: e.target.value })}
              placeholder={q.placeholder}
              className="w-full p-3 rounded-lg border border-[#E3C27D]/30 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
              rows={2}
            />
          </div>
        ))}
      </div>

      {isComplete && (
        <button
          onClick={() => onComplete(answers)}
          className="w-full mt-4 py-3 rounded-lg font-medium text-white"
          style={{ backgroundColor: '#C6A664' }}
        >
          Save My Origin Story
        </button>
      )}
    </div>
  );
}

/**
 * Confrontation Check-In
 */
export function ConfrontationCheckIn({ onComplete }) {
  const [selected, setSelected] = useState(null);

  const options = [
    { id: 'investigating', label: 'I\'m investigating the origin', icon: '🔍' },
    { id: 'understanding', label: 'I understand why it began', icon: '💡' },
    { id: 'separating', label: 'I see I\'m not the pattern', icon: '🪞' },
    { id: 'compassion', label: 'I feel compassion for myself', icon: '💚' }
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
      style={{ background: 'linear-gradient(135deg, #C6A66420 0%, #C6A66440 100%)' }}
    >
      <div className="text-center mb-4">
        <span className="text-4xl">🔍</span>
        <h3 className="text-lg font-bold awareness-text mt-2 mb-1">
          Confrontation Check-In
        </h3>
        <p className="text-sm observation-text">
          Where are you in understanding your pattern?
        </p>
      </div>

      <div className="space-y-2">
        {options.map(option => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`w-full p-3 rounded-lg text-left transition-all ${
              selected === option.id
                ? 'bg-amber-100 border-2 border-amber-400'
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
