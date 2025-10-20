/**
 * About Page
 * Information about VOW Theory and the methodology
 */

import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50">
      <Head>
        <title>About - VOW Theory</title>
      </Head>

      {/* Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <h1 className="text-lg font-medium text-gray-900">About VOW Theory</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="text-7xl mb-6">📿</div>
          <h2 className="text-5xl font-bold awareness-text mb-6">
            VOW Theory
          </h2>
          <p className="text-2xl observation-text max-w-3xl mx-auto">
            A methodology for remembering who you are through daily practice
          </p>
        </div>

        {/* Mission */}
        <section className="mb-16">
          <div className="separation-card rounded-xl p-8 text-center">
            <h3 className="text-3xl font-bold awareness-text mb-4">Our Mission</h3>
            <p className="text-xl observation-text max-w-3xl mx-auto">
              To help people remember their authentic selves through the power of daily remembrance, 
              transforming trauma into wisdom and separation into wholeness.
            </p>
          </div>
        </section>

        {/* The Story */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold awareness-text mb-8 text-center">The Story</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="separation-card rounded-xl p-6">
              <div className="text-4xl mb-4">💡</div>
              <h4 className="text-xl font-bold awareness-text mb-3">The Insight</h4>
              <p className="observation-text">
                VOW Theory emerged from a simple but powerful realization: we are not broken by trauma—
                we adapt to survive it. What we call dysfunction is often intelligence responding to 
                impossible situations.
              </p>
            </div>

            <div className="separation-card rounded-xl p-6">
              <div className="text-4xl mb-4">🔄</div>
              <h4 className="text-xl font-bold awareness-text mb-3">The Method</h4>
              <p className="observation-text">
                Through consistent daily practice, we can rewire neural pathways and reclaim our 
                authentic identity. Not by fighting ourselves, but by remembering who we were before 
                we learned to protect.
              </p>
            </div>

            <div className="separation-card rounded-xl p-6">
              <div className="text-4xl mb-4">⏰</div>
              <h4 className="text-xl font-bold awareness-text mb-3">The Law</h4>
              <p className="observation-text">
                The Law of Daily Remembrance™: transformation happens through consistency, not intensity. 
                Every day you remember who you are, you strengthen the neural pathways of authenticity.
              </p>
            </div>

            <div className="separation-card rounded-xl p-6">
              <div className="text-4xl mb-4">✨</div>
              <h4 className="text-xl font-bold awareness-text mb-3">The Goal</h4>
              <p className="observation-text">
                Integration—merging who you were before trauma with who you became through it. 
                Not choosing one over the other, but becoming whole by honoring both.
              </p>
            </div>
          </div>
        </section>

        {/* The Three Principles */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold awareness-text mb-8 text-center">
            The Three Principles
          </h3>
          
          <div className="space-y-6">
            <PrincipleCard
              icon="🕊️"
              number="1"
              title="The Pacification Paradox™"
              subtitle="Accept Without Fighting"
              description="You cannot change what you refuse to see. Observation creates distance. Distance creates choice. Choice creates freedom."
              color="#90EE90"
            />

            <PrincipleCard
              icon="🔍"
              number="2"
              title="The Confrontational Model™"
              subtitle="Face the Truth with Compassion"
              description="Every pattern has an origin story. Understanding where behaviors came from removes shame and replaces it with compassion. You are not your trauma."
              color="#C6A664"
            />

            <PrincipleCard
              icon="✨"
              number="3"
              title="The Integration Cycle™"
              subtitle="Become Whole Again"
              description="Merge who you were before with who you became. Integration is not choosing—it's honoring both selves and becoming complete."
              color="#5FD3A5"
            />
          </div>
        </section>

        {/* Core Beliefs */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold awareness-text mb-8 text-center">
            What We Believe
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BeliefCard text="You are not broken—you adapted" />
            <BeliefCard text="Healing is remembering, not fixing" />
            <BeliefCard text="Consistency creates lasting change" />
            <BeliefCard text="Your journey is unique and valid" />
            <BeliefCard text="Transformation happens daily" />
            <BeliefCard text="Authenticity is your birthright" />
            <BeliefCard text="You were whole before trauma" />
            <BeliefCard text="You are becoming whole again" />
          </div>
        </section>

        {/* Technology & Science */}
        <section className="mb-16">
          <div className="separation-card rounded-xl p-8">
            <h3 className="text-2xl font-bold awareness-text mb-4 text-center">
              Grounded in Science, Powered by Technology
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-4xl mb-3">🧠</div>
                <h4 className="font-bold awareness-text mb-2">Neuroscience</h4>
                <p className="text-sm observation-text">
                  Daily practice rewires neural pathways through neuroplasticity
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-3">🤖</div>
                <h4 className="font-bold awareness-text mb-2">AI Insights</h4>
                <p className="text-sm observation-text">
                  Personalized guidance powered by advanced language models
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-3">💾</div>
                <h4 className="font-bold awareness-text mb-2">Privacy First</h4>
                <p className="text-sm observation-text">
                  Your journey is private, secure, and never sold
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team (Placeholder) */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold awareness-text mb-8 text-center">
            Built with Care
          </h3>
          <div className="separation-card rounded-xl p-8 text-center">
            <p className="observation-text max-w-2xl mx-auto mb-6">
              VOW Theory is built by a small team dedicated to creating tools for genuine 
              transformation. We believe technology should serve healing, not exploit vulnerability.
            </p>
            <button
              onClick={() => router.push('/contact')}
              className="px-6 py-3 rounded-lg font-medium text-white"
              style={{ backgroundColor: '#C6A664' }}
            >
              Get in Touch
            </button>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center p-8 rounded-xl" style={{ background: 'linear-gradient(135deg, #C6A66420 0%, #5FD3A540 100%)' }}>
          <h3 className="text-3xl font-bold awareness-text mb-4">
            Begin Your Journey
          </h3>
          <p className="text-xl observation-text mb-6 max-w-2xl mx-auto">
            Every day of remembrance matters. Start today.
          </p>
          <button
            onClick={() => router.push('/signup')}
            className="px-8 py-4 rounded-lg font-medium text-white text-lg"
            style={{ backgroundColor: '#C6A664' }}
          >
            Start Free Trial
          </button>
        </div>
      </div>
    </div>
  );
}

function PrincipleCard({ icon, number, title, subtitle, description, color }) {
  return (
    <div 
      className="separation-card rounded-xl p-6 border-l-4"
      style={{ borderColor: color }}
    >
      <div className="flex items-start space-x-4">
        <div className="text-5xl">{icon}</div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span 
              className="px-3 py-1 rounded-full text-white font-bold text-sm"
              style={{ backgroundColor: color }}
            >
              {number}
            </span>
            <h4 className="text-xl font-bold awareness-text">{title}</h4>
          </div>
          <p className="font-medium mb-2" style={{ color }}>{subtitle}</p>
          <p className="observation-text">{description}</p>
        </div>
      </div>
    </div>
  );
}

function BeliefCard({ text }) {
  return (
    <div className="flex items-center space-x-3 p-4 rounded-lg bg-white border-2 border-gray-200">
      <span className="text-2xl">✓</span>
      <span className="font-medium awareness-text">{text}</span>
    </div>
  );
}
