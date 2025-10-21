/**
 * Daily Law Card Component
 * Quick reminder of the Law of Daily Remembrance
 */

import { useState } from 'react';
import { getQuoteOfTheDay } from '../lib/quotes';

export default function DailyLawCard({ expanded = false }) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const quote = getQuoteOfTheDay();

  return (
    <div className="daily-law-card">
      {isExpanded ? (
        <ExpandedCard quote={quote} onCollapse={() => setIsExpanded(false)} />
      ) : (
        <CompactCard quote={quote} onExpand={() => setIsExpanded(true)} />
      )}
    </div>
  );
}

function CompactCard({ quote, onExpand }) {
  return (
    <button
      onClick={onExpand}
      className="w-full text-left p-4 rounded-xl transition-all hover:shadow-lg"
      style={{ background: 'linear-gradient(135deg, #C6A66420 0%, #5FD3A540 100%)' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">⏰</span>
            <h3 className="font-bold awareness-text">Law of Daily Remembrance</h3>
          </div>
          <p className="text-sm observation-text line-clamp-2">
            "{quote.text}"
          </p>
        </div>
        <div className="text-xl observation-text ml-2">→</div>
      </div>
    </button>
  );
}

function ExpandedCard({ quote, onCollapse }) {
  return (
    <div 
      className="p-6 rounded-xl"
      style={{ background: 'linear-gradient(135deg, #C6A66430 0%, #5FD3A550 100%)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">⏰</span>
          <h3 className="text-xl font-bold awareness-text">Law of Daily Remembrance</h3>
        </div>
        <button
          onClick={onCollapse}
          className="text-xl observation-text hover:text-[#F4F1ED]"
        >
          ×
        </button>
      </div>

      {/* Core Principle */}
      <div className="mb-4 p-4 rounded-lg corrective-bg/50">
        <p className="text-lg font-medium awareness-text mb-2">
          Daily remembrance creates permanent change.
        </p>
        <p className="text-sm observation-text">
          You are not broken. You adapted. Through consistent daily practice, 
          you rewire neural pathways and reclaim your authentic identity.
        </p>
      </div>

      {/* Quote of the Day */}
      <div className="mb-4 p-4 rounded-lg corrective-bg/30 border-l-4" style={{ borderColor: '#C6A664' }}>
        <p className="text-sm italic observation-text mb-1">
          "{quote.text}"
        </p>
        <p className="text-xs observation-text">— {quote.author}</p>
      </div>

      {/* Key Points */}
      <div className="space-y-2">
        <KeyPoint 
          icon="🔄"
          text="Consistency, not perfection, is the path"
        />
        <KeyPoint 
          icon="🧠"
          text="Daily practice rewires neural pathways"
        />
        <KeyPoint 
          icon="✨"
          text="Your vow is a reminder, not a rule"
        />
        <KeyPoint 
          icon="🌟"
          text="Every day you remember, you return to yourself"
        />
      </div>
    </div>
  );
}

function KeyPoint({ icon, text }) {
  return (
    <div className="flex items-center space-x-2 text-sm">
      <span className="text-lg">{icon}</span>
      <span className="observation-text">{text}</span>
    </div>
  );
}

/**
 * Mini Daily Law Reminder
 */
export function MiniDailyLaw() {
  return (
    <div className="mini-daily-law p-3 rounded-lg bg-gradient-to-r from-amber-50 to-amber-100">
      <div className="flex items-center space-x-2">
        <span className="text-xl">⏰</span>
        <p className="text-sm font-medium" style={{ color: '#C6A664' }}>
          Daily remembrance creates change
        </p>
      </div>
    </div>
  );
}

/**
 * Daily Law with Action
 */
export function DailyLawWithAction({ onCreateVow }) {
  const quote = getQuoteOfTheDay();

  return (
    <div 
      className="p-6 rounded-xl"
      style={{ background: 'linear-gradient(135deg, #C6A66420 0%, #5FD3A540 100%)' }}
    >
      <div className="text-center mb-4">
        <div className="text-4xl mb-3">⏰</div>
        <h3 className="text-xl font-bold awareness-text mb-2">
          Have You Remembered Today?
        </h3>
        <p className="text-sm observation-text mb-4">
          "{quote.text}"
        </p>
      </div>

      <button
        onClick={onCreateVow}
        className="w-full py-3 rounded-lg font-medium text-white"
        style={{ backgroundColor: '#C6A664' }}
      >
        Create Today's Vow
      </button>
    </div>
  );
}

/**
 * Daily Law Progress
 */
export function DailyLawProgress({ streak = 0, totalDays = 0 }) {
  return (
    <div className="daily-law-progress p-4 rounded-xl separation-card">
      <div className="flex items-center space-x-3 mb-3">
        <span className="text-2xl">⏰</span>
        <h4 className="font-medium awareness-text">Your Remembrance Journey</h4>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
          <div className="text-2xl font-bold" style={{ color: '#5FD3A5' }}>
            {streak}
          </div>
          <div className="text-xs observation-text">Current Streak</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100">
          <div className="text-2xl font-bold" style={{ color: '#C6A664' }}>
            {totalDays}
          </div>
          <div className="text-xs observation-text">Total Days</div>
        </div>
      </div>

      <div className="mt-3 text-center text-sm observation-text">
        {streak >= 30 && "30+ days of remembrance — neural pathways are forming"}
        {streak >= 7 && streak < 30 && "Building consistency — keep going"}
        {streak < 7 && "Every day matters. Keep remembering."}
      </div>
    </div>
  );
}

/**
 * Daily Law Tooltip
 */
export function DailyLawTooltip({ children }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
      </div>

      {showTooltip && (
        <div 
          className="absolute z-50 w-64 p-4 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2"
          style={{ background: 'linear-gradient(135deg, #C6A66490 0%, #5FD3A590 100%)' }}
        >
          <div className="text-sm text-white">
            <div className="font-bold mb-1">Law of Daily Remembrance™</div>
            <p className="text-xs">
              Daily practice rewires neural pathways. Consistency creates lasting transformation.
            </p>
          </div>
          <div 
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid rgba(198, 166, 100, 0.9)'
            }}
          />
        </div>
      )}
    </div>
  );
}
