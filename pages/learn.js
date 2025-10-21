/**
 * Learning Hub - VOW Theory Education
 * Main landing page for theory and courses
 */

import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ProtectedRoute from '../components/ProtectedRoute';

export default function LearnPage() {
  return (
    <ProtectedRoute>
      <LearnContent />
    </ProtectedRoute>
  );
}

function LearnContent() {
  const router = useRouter();

  const principles = [
    {
      id: 'pacification',
      name: 'The Pacification Paradox™',
      icon: '🕊️',
      color: '#90EE90',
      description: 'Accept without fighting. Observe patterns without judgment.',
      preview: 'The first step to freedom is seeing what exists—not battling it.',
      available: true
    },
    {
      id: 'confrontation',
      name: 'The Confrontational Model™',
      icon: '🔍',
      color: '#C6A664',
      description: 'Face the truth. Understand the origins with compassion.',
      preview: 'You are not your trauma. You are who you became to survive it.',
      available: true
    },
    {
      id: 'integration',
      name: 'The Integration Cycle™',
      icon: '✨',
      color: '#5FD3A5',
      description: 'Become whole. Merge who you were with who you are becoming.',
      preview: 'Remembering who you were means becoming who you truly are.',
      available: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C1117] to-[#1A1C1F]">
      <Head>
        <title>Learn - VOW Theory</title>
        <meta name="description" content="Learn the principles of VOW Theory and the Law of Daily Remembrance" />
      </Head>

      {/* Header */}
      <nav className="corrective-bg border-b border-[#E3C27D]/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-[#8E8A84] hover:text-[#F4F1ED]"
            >
              ← Back
            </button>
            <h1 className="text-lg font-medium text-[#F4F1ED]">Learn VOW Theory</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-3xl font-bold awareness-text mb-4">
            The Law of Daily Remembrance
          </h2>
          <p className="text-lg observation-text max-w-2xl mx-auto mb-6">
            You are not broken. You adapted. Through daily remembrance, 
            you can integrate who you were before with who you've become.
          </p>
          <div className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-amber-100 to-amber-50">
            <p className="text-sm font-medium" style={{ color: '#C6A664' }}>
              "Daily remembrance creates permanent change."
            </p>
          </div>
        </div>

        {/* Core Principles */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold awareness-text mb-6 text-center">
            The Three Principles
          </h3>
          <div className="space-y-6">
            {principles.map((principle) => (
              <PrincipleCard
                key={principle.id}
                principle={principle}
                onClick={() => router.push(`/learn_${principle.id}`)}
              />
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="separation-card bg-[#1A1C1F] border border-[#E3C27D]/20 rounded-xl p-8 mb-8">
          <h3 className="text-xl font-bold awareness-text mb-4">
            How VOW Theory Works
          </h3>
          <div className="space-y-4">
            <Step
              number="1"
              title="Daily Vow"
              description="Create a daily statement of who you are choosing to be"
            />
            <Step
              number="2"
              title="Reflect"
              description="Move through pacification, confrontation, and integration"
            />
            <Step
              number="3"
              title="Remember"
              description="Daily consistency rewires neural pathways and reclaims identity"
            />
          </div>
        </div>

        {/* Key Concepts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ConceptCard
            icon="🧠"
            title="Identity Over Behavior"
            description="You are not what you do. Your vow reminds you of who you are."
          />
          <ConceptCard
            icon="🔄"
            title="Observation Not Combat"
            description="Fighting yourself keeps you stuck. Awareness creates change."
          />
          <ConceptCard
            icon="⏰"
            title="Daily Remembrance"
            description="Consistency, not perfection, is the path to liberation."
          />
          <ConceptCard
            icon="🌟"
            title="Integration"
            description="You were whole before. You are becoming whole again."
          />
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => router.push('/learn_principles')}
            className="px-8 py-4 rounded-lg font-medium text-[#F4F1ED] text-lg"
            style={{ backgroundColor: '#C6A664' }}
          >
            Explore All Principles →
          </button>
        </div>
      </div>
    </div>
  );
}

function PrincipleCard({ principle, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left separation-card rounded-xl p-6 transition-all hover:shadow-lg"
      style={{ borderLeft: `4px solid ${principle.color}` }}
    >
      <div className="flex items-start space-x-4">
        <div className="text-4xl">{principle.icon}</div>
        <div className="flex-1">
          <h4 className="text-xl font-bold awareness-text mb-2">
            {principle.name}
          </h4>
          <p className="observation-text mb-3">
            {principle.description}
          </p>
          <p className="text-sm italic" style={{ color: principle.color }}>
            "{principle.preview}"
          </p>
          <div className="mt-4 flex items-center" style={{ color: principle.color }}>
            <span className="text-sm font-medium">Learn More →</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function Step({ number, title, description }) {
  return (
    <div className="flex items-start space-x-4">
      <div 
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-[#F4F1ED]"
        style={{ backgroundColor: '#C6A664' }}
      >
        {number}
      </div>
      <div>
        <h4 className="font-medium awareness-text mb-1">{title}</h4>
        <p className="text-sm observation-text text-[#E8E6E3]">{description}</p>
      </div>
    </div>
  );
}

function ConceptCard({ icon, title, description }) {
  return (
    <div className="separation-card bg-[#1A1C1F] border border-[#E3C27D]/20 rounded-xl p-6 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h4 className="font-medium awareness-text mb-2">{title}</h4>
      <p className="text-sm observation-text text-[#E8E6E3]">{description}</p>
    </div>
  );
}
