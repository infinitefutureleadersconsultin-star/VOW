/**
 * Principles Overview Page
 * Detailed overview of the 5 VOW Theory principles
 */

import { useRouter } from 'next/router';
import Head from 'next/head';
import ProtectedRoute from '../components/ProtectedRoute';

export default function PrinciplesPage() {
  return (
    <ProtectedRoute>
      <PrinciplesContent />
    </ProtectedRoute>
  );
}

function PrinciplesContent() {
  const router = useRouter();

  const principles = [
    {
      id: 'pacification',
      name: 'The Pacification Paradox™',
      subtitle: 'Principle 1: Acceptance',
      icon: '🕊️',
      color: '#90EE90',
      summary: 'You cannot change what you refuse to see. Pacification is not surrender—it is the courage to observe without judgment.',
      keyInsights: [
        'Accepting a pattern is not approving it',
        'Observation creates distance from behavior',
        'What you fight, you strengthen',
        'Peace comes before change'
      ],
      quote: 'The pattern existed before you saw it. Seeing it is the first step to freedom.'
    },
    {
      id: 'confrontation',
      name: 'The Confrontational Model™',
      subtitle: 'Principle 2: Understanding',
      icon: '🔍',
      color: '#C6A664',
      summary: 'Face the truth with compassion. You are not your trauma—you are who you became to survive it.',
      keyInsights: [
        'Every pattern has an origin story',
        'Behaviors protected you once',
        'Understanding replaces shame',
        'The "why" lives beneath the "what"'
      ],
      quote: 'What hurt you once cannot hurt you again—unless you refuse to see it.'
    },
    {
      id: 'integration',
      name: 'The Integration Cycle™',
      subtitle: 'Principle 3: Wholeness',
      icon: '✨',
      color: '#5FD3A5',
      summary: 'You were whole before trauma. Through awareness, you merge who you were with who you became.',
      keyInsights: [
        'You are not broken, you adapted',
        'Integration is not forgetting',
        'Both selves can exist as one',
        'Remembering who you were = becoming who you are'
      ],
      quote: 'The healed self and the original self are one.'
    },
    {
      id: 'remembrance',
      name: 'The Law of Daily Remembrance™',
      subtitle: 'Principle 4: Consistency',
      icon: '⏰',
      color: '#4169E1',
      summary: 'Daily remembrance rewires neural pathways. Consistency, not perfection, creates lasting change.',
      keyInsights: [
        'Daily practice builds new neural pathways',
        'Your vow is not a rule—it\'s a reminder',
        'Every day you remember, you return to yourself',
        'Consistency compounds into transformation'
      ],
      quote: 'Every day you remember is a day you return to yourself.'
    },
    {
      id: 'balance',
      name: 'The Balance Integration™',
      subtitle: 'Principle 5: Unity',
      icon: '⚖️',
      color: '#9370DB',
      summary: 'True healing is not choosing one self over another—it is finding balance between both.',
      keyInsights: [
        'You don\'t erase who you became',
        'Both selves have wisdom',
        'Balance is not 50/50—it\'s harmony',
        'Integration creates a third, unified self'
      ],
      quote: 'Who you were + who you became = who you truly are.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50">
      <Head>
        <title>The 5 Principles - VOW Theory</title>
      </Head>

      {/* Header */}
      <nav className="bg-white border-b border-amber-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push('/learn')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Learn
            </button>
            <h1 className="text-lg font-medium text-gray-900">The 5 Principles</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Intro */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold awareness-text mb-4">
            The Five Principles of VOW Theory
          </h2>
          <p className="text-lg observation-text max-w-2xl mx-auto">
            These principles form the foundation of healing through daily remembrance. 
            Each builds upon the last, guiding you from awareness to integration.
          </p>
        </div>

        {/* Principles */}
        <div className="space-y-8">
          {principles.map((principle, index) => (
            <PrincipleSection
              key={principle.id}
              principle={principle}
              index={index}
              onLearnMore={() => router.push(`/learn_${principle.id}`)}
            />
          ))}
        </div>

        {/* Journey Flow */}
        <div className="mt-16 separation-card rounded-xl p-8">
          <h3 className="text-2xl font-bold awareness-text mb-6 text-center">
            The Integration Journey
          </h3>
          <div className="flex items-center justify-center space-x-4 mb-6">
            <JourneyStep icon="🕊️" label="Accept" color="#90EE90" />
            <Arrow />
            <JourneyStep icon="🔍" label="Understand" color="#C6A664" />
            <Arrow />
            <JourneyStep icon="✨" label="Integrate" color="#5FD3A5" />
            <Arrow />
            <JourneyStep icon="⏰" label="Remember" color="#4169E1" />
            <Arrow />
            <JourneyStep icon="⚖️" label="Balance" color="#9370DB" />
          </div>
          <p className="text-center observation-text">
            This is not a linear path. You may revisit stages as you grow. 
            Each principle supports the others in your healing.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="observation-text mb-4">
            Ready to begin your practice?
          </p>
          <button
            onClick={() => router.push('/create-vow')}
            className="px-8 py-4 rounded-lg font-medium text-white text-lg"
            style={{ backgroundColor: '#C6A664' }}
          >
            Create Your Vow
          </button>
        </div>
      </div>
    </div>
  );
}

function PrincipleSection({ principle, index, onLearnMore }) {
  return (
    <div 
      className="separation-card rounded-xl p-6"
      style={{ borderLeft: `6px solid ${principle.color}` }}
    >
      <div className="flex items-start space-x-4 mb-4">
        <div className="text-5xl">{principle.icon}</div>
        <div className="flex-1">
          <div className="text-sm font-medium observation-text mb-1">
            {principle.subtitle}
          </div>
          <h3 className="text-2xl font-bold awareness-text mb-2">
            {principle.name}
          </h3>
          <p className="observation-text mb-4">
            {principle.summary}
          </p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mb-4">
        <h4 className="font-medium awareness-text mb-2">Key Insights:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {principle.keyInsights.map((insight, i) => (
            <div key={i} className="flex items-start space-x-2">
              <span style={{ color: principle.color }}>•</span>
              <span className="text-sm observation-text">{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quote */}
      <div 
        className="p-4 rounded-lg mb-4"
        style={{ backgroundColor: `${principle.color}20` }}
      >
        <p className="text-sm italic" style={{ color: principle.color }}>
          "{principle.quote}"
        </p>
      </div>

      {/* Learn More Button */}
      <button
        onClick={onLearnMore}
        className="w-full md:w-auto px-6 py-2 rounded-lg font-medium"
        style={{ 
          backgroundColor: principle.color,
          color: 'white'
        }}
      >
        Explore {principle.name} →
      </button>
    </div>
  );
}

function JourneyStep({ icon, label, color }) {
  return (
    <div className="text-center">
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-2 mx-auto"
        style={{ backgroundColor: `${color}40` }}
      >
        {icon}
      </div>
      <div className="text-xs font-medium observation-text">{label}</div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="text-2xl observation-text">→</div>
  );
}
