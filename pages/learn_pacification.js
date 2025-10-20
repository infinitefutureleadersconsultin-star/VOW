/**
 * Pacification Principle Course
 * Deep dive into The Pacification Paradox™
 */

import { useRouter } from 'next/router';
import Head from 'next/head';
import ProtectedRoute from '../components/ProtectedRoute';

export default function PacificationPage() {
  return (
    <ProtectedRoute>
      <PacificationContent />
    </ProtectedRoute>
  );
}

function PacificationContent() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <Head>
        <title>The Pacification Paradox - VOW Theory</title>
      </Head>

      {/* Header */}
      <nav className="bg-white border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push('/learn_principles')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← All Principles
            </button>
            <h1 className="text-lg font-medium text-gray-900">The Pacification Paradox™</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">🕊️</div>
          <h2 className="text-4xl font-bold awareness-text mb-4">
            The Pacification Paradox™
          </h2>
          <p className="text-xl observation-text max-w-2xl mx-auto mb-6">
            Principle 1: Accept Without Fighting
          </p>
          <div className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-green-100 to-green-50">
            <p className="text-lg font-medium" style={{ color: '#90EE90' }}>
              "You cannot fight what you refuse to acknowledge."
            </p>
          </div>
        </div>

        {/* The Paradox */}
        <div className="separation-card rounded-xl p-8 mb-8" style={{ borderLeft: '6px solid #90EE90' }}>
          <h3 className="text-2xl font-bold awareness-text mb-4">The Paradox</h3>
          <p className="observation-text mb-4 text-lg">
            The moment you stop fighting yourself, you begin to change.
          </p>
          <p className="observation-text">
            This seems backwards. How can acceptance lead to transformation? 
            Because fighting a pattern gives it power. Observing it creates distance. 
            Distance creates choice. Choice creates freedom.
          </p>
        </div>

        {/* What Pacification Is Not */}
        <div className="separation-card rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold awareness-text mb-4">What Pacification Is NOT</h3>
          <div className="space-y-4">
            <NotCard
              title="❌ Approval"
              description="Accepting that a pattern exists doesn't mean you approve of it."
            />
            <NotCard
              title="❌ Surrender"
              description="Pacification is not giving up. It's gathering information."
            />
            <NotCard
              title="❌ Inaction"
              description="Observation is the first action. Awareness is work."
            />
          </div>
        </div>

        {/* What Pacification IS */}
        <div className="separation-card rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold awareness-text mb-4">What Pacification IS</h3>
          <div className="space-y-4">
            <IsCard
              icon="👁️"
              title="Observation"
              description="Seeing the pattern clearly without emotional charge"
            />
            <IsCard
              icon="🪞"
              title="Distance"
              description="Creating space between you and the behavior"
            />
            <IsCard
              icon="🧘"
              title="Peace"
              description="Finding calm in the presence of difficult truths"
            />
          </div>
        </div>

        {/* How to Practice */}
        <div className="separation-card rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold awareness-text mb-4">How to Practice Pacification</h3>
          <div className="space-y-6">
            <PracticeStep
              number="1"
              title="Notice the Pattern"
              description="When a familiar behavior arises, pause. Simply notice it."
              example='"I notice I'm reaching for my phone when I feel anxious."'
            />
            <PracticeStep
              number="2"
              title="Name It Without Judgment"
              description="Label what you see, but don't add 'good' or 'bad.'"
              example='"This is my avoidance pattern. It exists."'
            />
            <PracticeStep
              number="3"
              title="Sit With It"
              description="Don't immediately try to change it. Just observe."
              example='"I'm going to watch this feeling without acting on it."'
            />
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="separation-card rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold awareness-text mb-4">Common Mistakes</h3>
          <div className="space-y-3">
            <MistakeCard
              mistake="Trying to 'fix' immediately"
              correction="Allow yourself to just observe for at least 3 days before taking action"
            />
            <MistakeCard
              mistake="Judging yourself for having the pattern"
              correction="The pattern protected you once. Acknowledge its purpose"
            />
            <MistakeCard
              mistake="Expecting immediate change"
              correction="Pacification is the foundation. Change comes later"
            />
          </div>
        </div>

        {/* Reflection Prompts */}
        <div className="separation-card rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold awareness-text mb-4">Reflection Prompts</h3>
          <p className="observation-text mb-4">Use these to deepen your pacification practice:</p>
          <div className="space-y-3">
            {[
              'What pattern am I noticing today?',
              'Can I observe this without calling it good or bad?',
              'What does it feel like to sit with this awareness?',
              'How has fighting this pattern kept me stuck?',
              'What would peace with this pattern look like?'
            ].map((prompt, i) => (
              <div key={i} className="p-3 rounded-lg bg-green-50">
                <p className="text-sm" style={{ color: '#2F855A' }}>{prompt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="text-center">
          <p className="observation-text mb-4">
            Once you've practiced observing without judgment, you're ready for the next stage.
          </p>
          <button
            onClick={() => router.push('/learn_confrontation')}
            className="px-8 py-4 rounded-lg font-medium text-white text-lg"
            style={{ backgroundColor: '#C6A664' }}
          >
            Next: The Confrontational Model →
          </button>
        </div>
      </div>
    </div>
  );
}

function NotCard({ title, description }) {
  return (
    <div className="p-4 rounded-lg bg-red-50 border-l-4 border-red-400">
      <h4 className="font-bold text-red-800 mb-1">{title}</h4>
      <p className="text-sm text-red-700">{description}</p>
    </div>
  );
}

function IsCard({ icon, title, description }) {
  return (
    <div className="flex items-start space-x-3 p-4 rounded-lg bg-green-50">
      <div className="text-2xl">{icon}</div>
      <div>
        <h4 className="font-bold text-green-800 mb-1">{title}</h4>
        <p className="text-sm text-green-700">{description}</p>
      </div>
    </div>
  );
}

function PracticeStep({ number, title, description, example }) {
  return (
    <div>
      <div className="flex items-start space-x-4 mb-2">
        <div 
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
          style={{ backgroundColor: '#90EE90' }}
        >
          {number}
        </div>
        <div className="flex-1">
          <h4 className="font-bold awareness-text mb-1">{title}</h4>
          <p className="text-sm observation-text mb-2">{description}</p>
          <div className="p-3 rounded-lg bg-green-50">
            <p className="text-sm italic" style={{ color: '#2F855A' }}>
              Example: {example}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MistakeCard({ mistake, correction }) {
  return (
    <div className="p-4 rounded-lg border-2 border-amber-200 bg-amber-50">
      <div className="flex items-start space-x-2 mb-2">
        <span className="text-amber-600">⚠️</span>
        <p className="text-sm font-medium text-amber-800">{mistake}</p>
      </div>
      <div className="flex items-start space-x-2 ml-6">
        <span className="text-green-600">✓</span>
        <p className="text-sm text-green-700">{correction}</p>
      </div>
    </div>
  );
}
