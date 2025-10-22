/**
 * Balance Integration Page
 * Principle 4: Unity - Harmony Before Hierarchy
 */

import { useRouter } from 'next/router';
import Head from 'next/head';
import ProtectedRoute from '../components/ProtectedRoute';

export default function BalancePage() {
  return (
    <ProtectedRoute>
      <BalanceContent />
    </ProtectedRoute>
  );
}

function BalanceContent() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C1117] to-[#1A1C1F]">
      <Head>
        <title>The Balance Integration™ - VOW Theory</title>
      </Head>

      {/* Header */}
      <nav className="corrective-bg border-b border-[#E3C27D]/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push('/learn')}
              className="text-[#8E8A84] hover:text-[#F4F1ED]"
            >
              ← Back
            </button>
            <h1 className="text-lg font-medium text-[#F4F1ED]">The Balance Integration™</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">⚖️</div>
          <h2 className="text-4xl font-bold awareness-text mb-4">
            Unity – The Balance Integration™
          </h2>
          <p className="text-xl observation-text max-w-2xl mx-auto mb-6">
            Harmony Before Hierarchy
          </p>
          <div className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-purple-100 to-purple-50">
            <p className="text-lg font-medium" style={{ color: '#9370DB' }}>
              Principle 4: Unity
            </p>
          </div>
        </div>

        {/* Core Teaching */}
        <div className="separation-card bg-[#1A1C1F] border border-[#E3C27D]/20 rounded-xl p-8 mb-8" style={{ borderLeft: '6px solid #9370DB' }}>
          <h3 className="text-2xl font-bold awareness-text mb-4">The Foundation</h3>
          <p className="observation-text mb-4 text-lg">
            True healing is not choosing one self over another — it's finding balance between both. This principle restores wholeness by integrating the original self (who existed before the trauma, miseducation, lack of guidance, and overexposure) with the adapted self that emerged from those very experiences.
          </p>
          <p className="observation-text text-[#E8E6E3]">
            The goal is not to erase one or glorify the other — but to unify them, forming a balanced identity that honors both the innocence of origin and the strength of survival.
          </p>
        </div>

        {/* Key Insights */}
        <div className="separation-card bg-[#1A1C1F] border border-[#E3C27D]/20 rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold awareness-text mb-4">Key Insights</h3>
          <div className="space-y-4">
            <InsightItem 
              icon="🚫"
              title="You don't erase who you became"
              description="The adapted self carries wisdom from survival"
            />
            <InsightItem 
              icon="💎"
              title="Both selves carry wisdom"
              description="Original innocence + survival strength = complete self"
            />
            <InsightItem 
              icon="⚖️"
              title="Balance is not 50/50—it's harmony"
              description="Integration means finding what serves you now"
            />
            <InsightItem 
              icon="🌟"
              title="Integration creates a third, unified self"
              description="You become greater than the sum of your parts"
            />
          </div>
        </div>

        {/* Core Statement */}
        <div className="p-6 rounded-lg mb-8" style={{ background: 'linear-gradient(135deg, #9370DB20 0%, #9370DB40 100%)' }}>
          <h3 className="text-xl font-bold awareness-text mb-3">🔑 Core Statement</h3>
          <p className="observation-text text-lg">
            "Who you were before the trauma, miseducation, lack of guidance, and overexposure + who you became = who you truly are."
          </p>
        </div>

        {/* Implementation */}
        <div className="separation-card bg-[#1A1C1F] border border-[#E3C27D]/20 rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold awareness-text mb-4">How to Practice Balance Integration</h3>
          <div className="space-y-6">
            <Step 
              number={1}
              title="Acknowledge Both Selves"
              description="Recognize who you were before the pain and who you became after. Neither is wrong."
              example="'I was trusting before betrayal. I became guarded to survive. Both parts deserve honor.'"
            />
            <Step 
              number={2}
              title="Find the Wisdom in Each"
              description="Ask: What did my original self know? What did my adapted self learn?"
              example="'Original me knew joy. Adapted me learned discernment. I need both.'"
            />
            <Step 
              number={3}
              title="Create Harmony, Not Hierarchy"
              description="Don't make one self 'better.' Ask: What serves me now? What can I release?"
              example="'I can be open AND discerning. I can trust AND protect myself.'"
            />
            <Step 
              number={4}
              title="Integrate Daily Through Your Vow"
              description="Your vow reminds you who you're becoming—unified, balanced, whole."
              example="'I'm the type of person who honors both my innocence and my strength.'"
            />
          </div>
        </div>

        {/* Reflection Prompts */}
        <div className="separation-card bg-[#1A1C1F] border border-[#E3C27D]/20 rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold awareness-text mb-4">Reflection Prompts</h3>
          <p className="observation-text mb-4">Use these to explore balance:</p>
          <div className="space-y-3">
            {[
              'Who was I before the pain began?',
              'What qualities did I have that I want to reclaim?',
              'Who did I become to survive?',
              'What strengths did that version of me develop?',
              'Where am I choosing one self over the other?',
              'What would harmony between both selves look like?'
            ].map((prompt, i) => (
              <div key={i} className="p-3 rounded-lg bg-[#2A2C2F]">
                <p className="text-sm" style={{ color: '#9370DB' }}>{prompt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="text-center">
          <p className="observation-text mb-4">
            Ready to apply this principle?
          </p>
          <button
            onClick={() => router.push('/create-vow')}
            className="px-8 py-4 rounded-lg font-medium text-[#F4F1ED] text-lg"
            style={{ backgroundColor: '#9370DB' }}
          >
            Create Your Vow
          </button>
        </div>
      </div>
    </div>
  );
}

function InsightItem({ icon, title, description }) {
  return (
    <div className="flex items-start space-x-3 p-4 rounded-lg bg-[#2A2C2F]">
      <div className="text-2xl">{icon}</div>
      <div>
        <h4 className="font-bold awareness-text mb-1">{title}</h4>
        <p className="text-sm observation-text text-[#E8E6E3]">{description}</p>
      </div>
    </div>
  );
}

function Step({ number, title, description, example }) {
  return (
    <div>
      <div className="flex items-start space-x-4 mb-2">
        <div 
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-[#F4F1ED]"
          style={{ backgroundColor: '#9370DB' }}
        >
          {number}
        </div>
        <div className="flex-1">
          <h4 className="font-bold awareness-text mb-1">{title}</h4>
          <p className="text-sm observation-text mb-2">{description}</p>
          <div className="p-3 rounded-lg bg-[#2A2C2F]">
            <p className="text-sm italic" style={{ color: '#9370DB' }}>
              Example: {example}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
