/**
 * Confrontation Principle Course
 * Deep dive into The Confrontational Model™
 */

import { useRouter } from 'next/router';
import Head from 'next/head';
import ProtectedRoute from '../components/ProtectedRoute';

export default function ConfrontationPage() {
  return (
    <ProtectedRoute>
      <ConfrontationContent />
    </ProtectedRoute>
  );
}

function ConfrontationContent() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50">
      <Head>
        <title>The Confrontational Model - VOW Theory</title>
      </Head>

      {/* Header */}
      <nav className="bg-white border-b border-amber-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push('/learn_principles')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← All Principles
            </button>
            <h1 className="text-lg font-medium text-gray-900">The Confrontational Model™</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">🔍</div>
          <h2 className="text-4xl font-bold awareness-text mb-4">
            The Confrontational Model™
          </h2>
          <p className="text-xl observation-text max-w-2xl mx-auto mb-6">
            Principle 2: Face the Truth with Compassion
          </p>
          <div className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-amber-100 to-amber-50">
            <p className="text-lg font-medium" style={{ color: '#C6A664' }}>
              "You are not your trauma. You are who you became to survive it."
            </p>
          </div>
        </div>

        {/* The Model */}
        <div className="separation-card rounded-xl p-8 mb-8" style={{ borderLeft: '6px solid #C6A664' }}>
          <h3 className="text-2xl font-bold awareness-text mb-4">Understanding the Model</h3>
          <p className="observation-text mb-4 text-lg">
            After observing a pattern without judgment, you're ready to ask: Why does this exist?
          </p>
          <p className="observation-text text-gray-700">
            Confrontation is not aggressive. It's gentle investigation. You're not attacking yourself—
            you're seeking to understand the origin of behaviors that once protected you.
          </p>
        </div>

        {/* The Three Questions */}
        <div className="separation-card rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold awareness-text mb-4">The Three Core Questions</h3>
          <div className="space-y-6">
            <QuestionCard
              number="1"
              question="When did this pattern begin?"
              explanation="Behaviors don't appear randomly. They have origins. When did you first notice this?"
              example="I started avoiding conflict after my parents' divorce when I was 12."
            />
            <QuestionCard
              number="2"
              question="What was happening in my life at that time?"
              explanation="Context matters. What environment created the need for this behavior?"
              example="I watched my parents fight constantly. I learned that speaking up caused pain."
            />
            <QuestionCard
              number="3"
              question="What was this behavior protecting me from?"
              explanation="Every pattern served a purpose. What did this behavior shield you from?"
              example="It protected me from being blamed, from causing conflict, from feeling responsible."
            />
          </div>
        </div>

        {/* Key Insight */}
        <div className="p-6 rounded-lg mb-8" style={{ background: 'linear-gradient(135deg, #C6A66420 0%, #C6A66440 100%)' }}>
          <h3 className="text-xl font-bold awareness-text mb-3">🔑 Key Insight</h3>
          <p className="observation-text text-lg">
            The behavior was not your choice—it was your survival strategy. 
            Understanding this removes shame and replaces it with compassion.
          </p>
        </div>

        {/* Separation of Self */}
        <div className="separation-card rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold awareness-text mb-4">Separating Self from Behavior</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-red-50 border-2 border-red-200">
              <h4 className="font-bold text-red-800 mb-2">❌ Before Understanding</h4>
              <p className="text-sm text-red-700 mb-1">"I avoid conflict because I'm weak."</p>
              <p className="text-sm text-red-700 mb-1">"I self-sabotage because I'm broken."</p>
              <p className="text-sm text-red-700">"I push people away because I'm unlovable."</p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 border-2 border-green-200">
              <h4 className="font-bold text-green-800 mb-2">✅ After Understanding</h4>
              <p className="text-sm text-green-700 mb-1">"I avoid conflict because I learned it was dangerous."</p>
              <p className="text-sm text-green-700 mb-1">"I self-sabotage because success once felt unsafe."</p>
              <p className="text-sm text-green-700">"I push people away because abandonment once destroyed me."</p>
            </div>
          </div>
          <p className="observation-text text-center">
            Notice the shift: from identity ("I am") to behavior ("I learned")
          </p>
        </div>

        {/* How to Practice */}
        <div className="separation-card rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold awareness-text mb-4">How to Practice Confrontation</h3>
          <div className="space-y-4">
            <PracticeStep
              icon="📝"
              title="Write Your Pattern's Origin Story"
              description="Journal about when and why this behavior began. Don't censor—just write."
            />
            <PracticeStep
              icon="🕰️"
              title="Return to That Moment"
              description="Imagine yourself at the age when this started. What did you need then?"
            />
            <PracticeStep
              icon="💭"
              title="Speak to Your Younger Self"
              description="What would you say to that version of you? Offer compassion, not judgment."
            />
            <PracticeStep
              icon="🔗"
              title="Connect Past to Present"
              description="See how that old protection shows up now. It made sense then—but what about now?"
            />
          </div>
        </div>

        {/* Common Barriers */}
        <div className="separation-card rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold awareness-text mb-4">Common Barriers to Confrontation</h3>
          <div className="space-y-3">
            <BarrierCard
              barrier="Fear of re-traumatization"
              response="You're not reliving—you're observing from safety. You have distance now."
            />
            <BarrierCard
              barrier="Shame about the origin"
              response="What happened to you was not your fault. You survived the best way you could."
            />
            <BarrierCard
              barrier="Feeling stuck in the past"
              response="Understanding the past frees you from it. This is how you move forward."
            />
          </div>
        </div>

        {/* Reflection Prompts */}
        <div className="separation-card rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold awareness-text mb-4">Reflection Prompts</h3>
          <p className="observation-text mb-4">Use these to explore your pattern's origins:</p>
          <div className="space-y-3">
            {[
              'When did I first notice this behavior in myself?',
              'What was happening in my life at that time?',
              'What emotion or experience was this behavior protecting me from?',
              'How did this strategy serve me then?',
              'Does this protection still serve me now?'
            ].map((prompt, i) => (
              <div key={i} className="p-3 rounded-lg bg-amber-50">
                <p className="text-sm" style={{ color: '#B7791F' }}>{prompt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="text-center">
          <p className="observation-text mb-4">
            Once you understand the origin, you're ready to integrate both selves.
          </p>
          <button
            onClick={() => router.push('/learn_integration')}
            className="px-8 py-4 rounded-lg font-medium text-gray-900 text-lg"
            style={{ backgroundColor: '#5FD3A5' }}
          >
            Next: The Integration Cycle →
          </button>
        </div>
      </div>
    </div>
  );
}

function QuestionCard({ number, question, explanation, example }) {
  return (
    <div className="p-4 rounded-lg border-2" style={{ borderColor: '#C6A664' }}>
      <div className="flex items-start space-x-3 mb-3">
        <div 
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-900"
          style={{ backgroundColor: '#C6A664' }}
        >
          {number}
        </div>
        <h4 className="font-bold awareness-text text-lg">{question}</h4>
      </div>
      <p className="text-sm observation-text mb-3 ml-11">{explanation}</p>
      <div className="ml-11 p-3 rounded-lg bg-amber-50">
        <p className="text-sm italic" style={{ color: '#B7791F' }}>
          Example: {example}
        </p>
      </div>
    </div>
  );
}

function PracticeStep({ icon, title, description }) {
  return (
    <div className="flex items-start space-x-3 p-4 rounded-lg bg-amber-50">
      <div className="text-2xl">{icon}</div>
      <div>
        <h4 className="font-bold awareness-text mb-1">{title}</h4>
        <p className="text-sm observation-text text-gray-700">{description}</p>
      </div>
    </div>
  );
}

function BarrierCard({ barrier, response }) {
  return (
    <div className="p-4 rounded-lg border-2 border-amber-200 bg-amber-50">
      <div className="flex items-start space-x-2 mb-2">
        <span className="text-amber-600">🚧</span>
        <p className="text-sm font-medium text-amber-800">{barrier}</p>
      </div>
      <div className="flex items-start space-x-2 ml-6">
        <span className="text-green-600">💚</span>
        <p className="text-sm text-green-700">{response}</p>
      </div>
    </div>
  );
}
