/**
 * Integration Principle Course
 * Deep dive into The Integration Cycle™
 */

import { useRouter } from 'next/router';
import Head from 'next/head';
import ProtectedRoute from '../components/ProtectedRoute';

export default function IntegrationPage() {
  return (
    <ProtectedRoute>
      <IntegrationContent />
    </ProtectedRoute>
  );
}

function IntegrationContent() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50 bg-gradient-to-b from-white to-teal-50">
      <Head>
        <title>The Integration Cycle - VOW Theory</title>
      </Head>

      {/* Header */}
      <nav className="bg-white border-b border-teal-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push('/learn_principles')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← All Principles
            </button>
            <h1 className="text-lg font-medium text-gray-900">The Integration Cycle™</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">✨</div>
          <h2 className="text-4xl font-bold awareness-text mb-4">
            The Integration Cycle™
          </h2>
          <p className="text-xl observation-text max-w-2xl mx-auto mb-6">
            Principle 3: Become Whole Again
          </p>
          <div className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-teal-100 to-teal-50">
            <p className="text-lg font-medium" style={{ color: '#5FD3A5' }}>
              "You were whole before. You are becoming whole again."
            </p>
          </div>
        </div>

        {/* The Cycle */}
        <div className="separation-card rounded-xl p-8 mb-8" style={{ borderLeft: '6px solid #5FD3A5' }}>
          <h3 className="text-2xl font-bold awareness-text mb-4">The Integration Cycle</h3>
          <p className="observation-text mb-4 text-lg">
            You are not choosing one self over another. You are merging both into a unified whole.
          </p>
          <p className="observation-text text-gray-700">
            Integration is not forgetting who you became. It's recognizing that both versions—
            who you were before trauma and who you became through it—can exist as one.
          </p>
        </div>

        {/* The Three Selves */}
        <div className="separation-card rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold awareness-text mb-4">The Three Selves</h3>
          <div className="space-y-6">
            <SelfCard
              icon="🌟"
              color="#FFD700"
              title="Original Self"
              subtitle="Who you were before"
              description="Before trauma, before coping mechanisms, before protection. This self had authenticity, wholeness, and natural expression."
              example="The child who laughed freely, trusted easily, expressed emotions openly."
            />
            <div className="text-center text-4xl">↓</div>
            <SelfCard
              icon="🛡️"
              color="#B7791F"
              title="Adaptive Self"
              subtitle="Who you became"
              description="The self that learned to survive. This self developed protection, boundaries, and caution. It kept you alive."
              example="The adult who guards emotions, anticipates danger, and self-protects."
            />
            <div className="text-center text-4xl">↓</div>
            <SelfCard
              icon="✨"
              color="#5FD3A5"
              title="Integrated Self"
              subtitle="Who you truly are"
              description="A unified self that honors both—the openness AND the wisdom, the vulnerability AND the protection."
              example="The person who can be authentic while maintaining healthy boundaries."
            />
          </div>
        </div>

        {/* The Formula */}
        <div className="p-6 rounded-lg mb-8 text-center" style={{ background: 'linear-gradient(135deg, #5FD3A520 0%, #5FD3A540 100%)' }}>
          <h3 className="text-2xl font-bold awareness-text mb-3">The Integration Formula</h3>
          <div className="text-3xl font-bold mb-2" style={{ color: '#5FD3A5' }}>
            Original Self + Adaptive Self = Integrated Self
          </div>
          <p className="observation-text text-lg">
            Authenticity + Wisdom = Wholeness
          </p>
        </div>

        {/* What Integration Is Not */}
        <div className="separation-card rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold awareness-text mb-4">What Integration Is NOT</h3>
          <div className="space-y-3">
            <NotCard
              myth="Going back to who you were before"
              truth="You can't un-learn wisdom. Integration includes what you've gained."
            />
            <NotCard
              myth="Staying who you became through trauma"
              truth="Survival mode was temporary. You don't need all those protections anymore."
            />
            <NotCard
              myth="Being 'fixed' or 'cured'"
              truth="You were never broken. Integration is remembering your wholeness."
            />
          </div>
        </div>

        {/* How to Practice */}
        <div className="separation-card rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold awareness-text mb-4">How to Practice Integration</h3>
          <div className="space-y-6">
            <IntegrationStep
              number="1"
              title="Remember Who You Were"
              description="What qualities did you have before protection became necessary?"
              prompt="I was someone who..."
              examples={['trusted easily', 'laughed freely', 'expressed openly', 'loved without fear']}
            />
            <IntegrationStep
              number="2"
              title="Acknowledge Who You Became"
              description="What strengths did you develop through survival?"
              prompt="I learned to..."
              examples={['read people', 'set boundaries', 'recognize danger', 'protect myself']}
            />
            <IntegrationStep
              number="3"
              title="Merge Both"
              description="How can both exist together?"
              prompt="I am now someone who..."
              examples={['trusts wisely', 'laughs with awareness', 'expresses authentically', 'loves with boundaries']}
            />
          </div>
        </div>

        {/* Daily Practice */}
        <div className="separation-card rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold awareness-text mb-4">Daily Integration Practice</h3>
          <div className="space-y-4">
            <PracticeCard
              icon="🌅"
              title="Morning Remembrance"
              description="Before creating your vow, ask: 'Who was I before, who did I become, and who am I now?'"
            />
            <PracticeCard
              icon="🪞"
              title="Notice Integration Moments"
              description="When you feel authentic AND safe, pause. This is integration happening."
            />
            <PracticeCard
              icon="📝"
              title="Journal Both Voices"
              description="Write from your original self, then your adaptive self. Notice what each has to teach."
            />
            <PracticeCard
              icon="🌙"
              title="Evening Reflection"
              description="Where did I honor both selves today? Where did only one show up?"
            />
          </div>
        </div>

        {/* Signs of Integration */}
        <div className="separation-card rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold awareness-text mb-4">Signs You're Integrating</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'You can be vulnerable AND have boundaries',
              'You trust your intuition about people',
              'You express emotions without being controlled by them',
              'You feel whole, not fragmented',
              'Past pain no longer defines present choices',
              'You have compassion for all versions of yourself',
              'Authenticity feels safe, not dangerous',
              'You choose healing over protection'
            ].map((sign, i) => (
              <div key={i} className="flex items-start space-x-2 p-3 rounded-lg bg-teal-50">
                <span className="text-teal-600">✓</span>
                <span className="text-sm observation-text text-gray-700">{sign}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reflection Prompts */}
        <div className="separation-card rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold awareness-text mb-4">Integration Reflection Prompts</h3>
          <div className="space-y-3">
            {[
              'What quality from my original self do I want to reclaim?',
              'What wisdom from my adaptive self do I want to keep?',
              'How can I be open AND protected at the same time?',
              'Where do I feel most integrated in my life right now?',
              'What would my whole self—original + adaptive—choose today?'
            ].map((prompt, i) => (
              <div key={i} className="p-3 rounded-lg bg-teal-50">
                <p className="text-sm" style={{ color: '#047857' }}>{prompt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Completion */}
        <div className="text-center p-8 rounded-xl" style={{ background: 'linear-gradient(135deg, #5FD3A520 0%, #5FD3A540 100%)' }}>
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold awareness-text mb-3">
            You've Completed the Core Principles
          </h3>
          <p className="observation-text mb-6">
            Pacification → Confrontation → Integration. This is the journey of remembrance.
          </p>
          <button
            onClick={() => router.push('/create-vow')}
            className="px-8 py-4 rounded-lg font-medium text-gray-900 text-lg"
            style={{ backgroundColor: '#5FD3A5' }}
          >
            Create Your Integration Vow
          </button>
        </div>
      </div>
    </div>
  );
}

function SelfCard({ icon, color, title, subtitle, description, example }) {
  return (
    <div className="p-6 rounded-xl border-2" style={{ borderColor: color }}>
      <div className="flex items-center space-x-3 mb-3">
        <div className="text-4xl">{icon}</div>
        <div>
          <h4 className="text-xl font-bold awareness-text text-gray-900">{title}</h4>
          <p className="text-sm" style={{ color }}>{subtitle}</p>
        </div>
      </div>
      <p className="observation-text mb-3">{description}</p>
      <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>
        <p className="text-sm italic" style={{ color }}>{example}</p>
      </div>
    </div>
  );
}

function NotCard({ myth, truth }) {
  return (
    <div className="p-4 rounded-lg bg-red-50 border-l-4 border-red-400">
      <div className="mb-2">
        <span className="text-sm font-bold text-red-800">❌ Myth: </span>
        <span className="text-sm text-red-700">{myth}</span>
      </div>
      <div>
        <span className="text-sm font-bold text-green-800">✓ Truth: </span>
        <span className="text-sm text-green-700">{truth}</span>
      </div>
    </div>
  );
}

function IntegrationStep({ number, title, description, prompt, examples }) {
  return (
    <div className="p-4 rounded-lg border-2" style={{ borderColor: '#5FD3A5' }}>
      <div className="flex items-start space-x-3 mb-3">
        <div 
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-900"
          style={{ backgroundColor: '#5FD3A5' }}
        >
          {number}
        </div>
        <div className="flex-1">
          <h4 className="font-bold awareness-text mb-1">{title}</h4>
          <p className="text-sm observation-text mb-3">{description}</p>
          <div className="p-3 rounded-lg bg-teal-50 mb-2">
            <p className="text-sm font-medium mb-1" style={{ color: '#047857' }}>{prompt}</p>
            <div className="space-y-1">
              {examples.map((ex, i) => (
                <p key={i} className="text-sm" style={{ color: '#047857' }}>• {ex}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PracticeCard({ icon, title, description }) {
  return (
    <div className="flex items-start space-x-3 p-4 rounded-lg bg-teal-50">
      <div className="text-2xl">{icon}</div>
      <div>
        <h4 className="font-bold awareness-text mb-1">{title}</h4>
        <p className="text-sm observation-text text-gray-700">{description}</p>
      </div>
    </div>
  );
}
