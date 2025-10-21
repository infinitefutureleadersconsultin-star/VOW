/**
 * Insight Modal Component
 * Display AI-generated insights and guidance
 */

import { useState, useEffect } from 'react';

export default function InsightModal({ insight, isOpen, onClose, type = 'reflection' }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className={`corrective-bg rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-all duration-300 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {type === 'reflection' && <ReflectionInsight insight={insight} onClose={onClose} />}
        {type === 'vow' && <VowInsight insight={insight} onClose={onClose} />}
        {type === 'weekly' && <WeeklySummary insight={insight} onClose={onClose} />}
        {type === 'pattern' && <PatternInsight insight={insight} onClose={onClose} />}
      </div>
    </div>
  );
}

/**
 * Reflection Insight Display
 */
function ReflectionInsight({ insight, onClose }) {
  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="text-6xl mb-3">💡</div>
        <h2 className="text-2xl font-bold awareness-text mb-2">
          Your Reflection Insight
        </h2>
        <p className="text-sm observation-text">
          AI-guided understanding
        </p>
      </div>

      <div className="p-6 rounded-xl mb-6" style={{ background: 'linear-gradient(135deg, #C6A66420 0%, #5FD3A540 100%)' }}>
        <p className="observation-text leading-relaxed">
          {insight.text || insight}
        </p>
      </div>

      {insight.suggestedStage && (
        <div className="mb-6 p-4 rounded-lg bg-[#1A1C1F]">
          <h4 className="font-medium awareness-text mb-2">Suggested Next Stage</h4>
          <p className="text-sm observation-text capitalize">
            {insight.suggestedStage}
          </p>
        </div>
      )}

      {insight.patterns && insight.patterns.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium awareness-text mb-3">Patterns Noticed</h4>
          <div className="space-y-2">
            {insight.patterns.map((pattern, i) => (
              <div key={i} className="flex items-start space-x-2 p-3 rounded-lg bg-amber-50">
                <span className="text-amber-600">•</span>
                <span className="text-sm observation-text">{pattern}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onClose}
        className="w-full py-3 rounded-lg font-medium text-white"
        style={{ backgroundColor: '#C6A664' }}
      >
        Continue Reflecting
      </button>
    </div>
  );
}

/**
 * Vow Insight Display
 */
function VowInsight({ insight, onClose }) {
  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="text-6xl mb-3">🌟</div>
        <h2 className="text-2xl font-bold awareness-text mb-2">
          Your Vow Insight
        </h2>
        <p className="text-sm observation-text">
          Understanding your commitment
        </p>
      </div>

      <div className="p-6 rounded-xl mb-6" style={{ background: 'linear-gradient(135deg, #90EE9040 0%, #5FD3A560 100%)' }}>
        <p className="observation-text leading-relaxed">
          {insight.text || insight}
        </p>
      </div>

      {insight.strengths && insight.strengths.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium awareness-text mb-3">Strengths You're Claiming</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {insight.strengths.map((strength, i) => (
              <div key={i} className="flex items-center space-x-2 p-3 rounded-lg bg-green-50">
                <span className="text-green-600">✓</span>
                <span className="text-sm observation-text">{strength}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onClose}
        className="w-full py-3 rounded-lg font-medium text-white"
        style={{ backgroundColor: '#5FD3A5' }}
      >
        Continue Your Journey
      </button>
    </div>
  );
}

/**
 * Weekly Summary Display
 */
function WeeklySummary({ insight, onClose }) {
  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="text-6xl mb-3">📊</div>
        <h2 className="text-2xl font-bold awareness-text mb-2">
          Your Weekly Summary
        </h2>
        <p className="text-sm observation-text">
          {insight.dateRange || 'This week\'s progress'}
        </p>
      </div>

      {/* Stats */}
      {insight.stats && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatBox
            label="Reflections"
            value={insight.stats.reflections || 0}
            icon="📝"
          />
          <StatBox
            label="Triggers"
            value={insight.stats.triggers || 0}
            icon="🎯"
          />
          <StatBox
            label="Streak"
            value={insight.stats.streak || 0}
            icon="🔥"
          />
        </div>
      )}

      {/* Summary Text */}
      <div className="p-6 rounded-xl mb-6" style={{ background: 'linear-gradient(135deg, #C6A66420 0%, #5FD3A540 100%)' }}>
        <p className="observation-text leading-relaxed whitespace-pre-line">
          {insight.summary || insight.text}
        </p>
      </div>

      {/* Insights */}
      {insight.insights && insight.insights.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium awareness-text mb-3">Key Insights</h4>
          <div className="space-y-2">
            {insight.insights.map((item, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 rounded-lg bg-amber-50">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium awareness-text">{item.title}</p>
                  <p className="text-xs observation-text">{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onClose}
        className="w-full py-3 rounded-lg font-medium text-white"
        style={{ backgroundColor: '#C6A664' }}
      >
        View Full Dashboard
      </button>
    </div>
  );
}

/**
 * Pattern Insight Display
 */
function PatternInsight({ insight, onClose }) {
  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="text-6xl mb-3">🔍</div>
        <h2 className="text-2xl font-bold awareness-text mb-2">
          Pattern Detected
        </h2>
        <p className="text-sm observation-text">
          Understanding your journey
        </p>
      </div>

      <div className="p-6 rounded-xl mb-6" style={{ background: 'linear-gradient(135deg, #FF634720 0%, #FFA50040 100%)' }}>
        <h3 className="font-medium awareness-text mb-2">{insight.title}</h3>
        <p className="observation-text leading-relaxed">
          {insight.text || insight.description}
        </p>
      </div>

      {insight.frequency && (
        <div className="mb-6 p-4 rounded-lg bg-[#1A1C1F]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm observation-text">Frequency</span>
            <span className="font-bold awareness-text">{insight.frequency} times</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(insight.frequency * 10, 100)}%`,
                backgroundColor: '#FF6347'
              }}
            />
          </div>
        </div>
      )}

      {insight.recommendation && (
        <div className="mb-6 p-4 rounded-lg border-2 border-amber-200 bg-amber-50">
          <h4 className="font-medium awareness-text mb-2">💡 Recommendation</h4>
          <p className="text-sm observation-text">
            {insight.recommendation}
          </p>
        </div>
      )}

      <button
        onClick={onClose}
        className="w-full py-3 rounded-lg font-medium text-white"
        style={{ backgroundColor: '#C6A664' }}
      >
        Continue Observing
      </button>
    </div>
  );
}

function StatBox({ label, value, icon }) {
  return (
    <div className="text-center p-3 rounded-lg separation-card">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold awareness-text">{value}</div>
      <div className="text-xs observation-text">{label}</div>
    </div>
  );
}

/**
 * Loading Modal (for AI generation)
 */
export function InsightLoadingModal({ isOpen, message = 'Generating insight...' }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="corrective-bg rounded-2xl p-8 text-center max-w-sm">
        <div className="text-6xl mb-4 animate-pulse">🤔</div>
        <h3 className="text-lg font-bold awareness-text mb-2">
          {message}
        </h3>
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

/**
 * Celebration Modal (for achievements)
 */
export function CelebrationModal({ achievement, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="corrective-bg rounded-2xl p-8 text-center max-w-md animate-bounce"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-8xl mb-4">{achievement.icon || '🎉'}</div>
        <h2 className="text-3xl font-bold awareness-text mb-3">
          {achievement.title || 'Achievement Unlocked!'}
        </h2>
        <p className="observation-text mb-6">
          {achievement.description}
        </p>
        <button
          onClick={onClose}
          className="px-8 py-3 rounded-lg font-medium text-white"
          style={{ backgroundColor: '#FFD700' }}
        >
          Amazing!
        </button>
      </div>
    </div>
  );
}
