/**
 * Main Vow Page
 * Daily vow creation and viewing experience
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ProtectedRoute from '../components/ProtectedRoute';
import { loadAuthToken } from '../lib/storage';
import { formatDate } from '../utils/dateUtils';
import { calculateVowProgress, getVowStatusDisplay } from '../utils/vowUtils';

export default function VowPage() {
  return (
    <ProtectedRoute>
      <VowContent />
    </ProtectedRoute>
  );
}

function VowContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [vows, setVows] = useState([]);
  const [selectedVow, setSelectedVow] = useState(null);

  useEffect(() => {
    fetchVows();
  }, []);

  const fetchVows = async () => {
    try {
      const token = loadAuthToken();
      const response = await fetch('/api/vows', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setVows(data.vows || []);
        
        // Auto-select first active vow
        const activeVow = data.vows.find(v => v.status === 'active');
        if (activeVow) {
          setSelectedVow(activeVow);
        }
      }
    } catch (error) {
      console.error('Error fetching vows:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="observation-text">Loading your vows...</p>
        </div>
      </div>
    );
  }

  if (vows.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0C1117] to-[#1A1C1F]">
        <Head>
          <title>Your Vows - VOW</title>
        </Head>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <h2 className="text-2xl font-bold awareness-text mb-3">
              Create Your First Vow
            </h2>
            <p className="observation-text mb-6 max-w-md mx-auto">
              A vow is your daily reminder of who you are choosing to be. 
              It's not a battle—it's remembrance.
            </p>
            <button
              onClick={() => router.push('/create-vow')}
              className="px-6 py-3 rounded-lg font-medium text-white"
              style={{ backgroundColor: '#C6A664' }}
            >
              Create Your First Vow
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C1117] to-[#1A1C1F]">
      <Head>
        <title>Your Vows - VOW</title>
      </Head>

      {/* Header */}
      <nav className="corrective-bg border-b border-[#E3C27D]/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-[#8E8A84] hover:text-[#F4F1ED]"
            >
              ← Dashboard
            </button>
            <h1 className="text-lg font-medium text-[#F4F1ED]">Your Vows</h1>
            <button
              onClick={() => router.push('/create-vow')}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: '#C6A664' }}
            >
              New Vow
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vow List Sidebar */}
          <div className="lg:col-span-1">
            <div className="separation-card bg-[#1A1C1F] border border-[#E3C27D]/20 rounded-xl p-4">
              <h3 className="font-medium awareness-text mb-3">All Vows</h3>
              <div className="space-y-2">
                {vows.map((vow) => (
                  <button
                    key={vow.id}
                    onClick={() => setSelectedVow(vow)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedVow?.id === vow.id
                        ? 'bg-gradient-to-r from-amber-100 to-amber-50'
                        : 'hover:bg-[#1A1C1F]'
                    }`}
                  >
                    <div className="font-medium text-sm awareness-text mb-1 truncate">
                      {vow.identityType || vow.statement}
                    </div>
                    <div className="text-xs observation-text">
                      {getVowStatusDisplay(vow)}
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${calculateVowProgress(vow)}%`,
                          backgroundColor: '#C6A664'
                        }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Vow Detail */}
          <div className="lg:col-span-2">
            {selectedVow ? (
              <VowDetail vow={selectedVow} onUpdate={fetchVows} />
            ) : (
              <div className="separation-card bg-[#1A1C1F] border border-[#E3C27D]/20 rounded-xl p-12 text-center">
                <div className="text-4xl mb-4">👈</div>
                <p className="observation-text">Select a vow to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function VowDetail({ vow, onUpdate }) {
  const router = useRouter();
  const progress = calculateVowProgress(vow);

  return (
    <div className="separation-card bg-[#1A1C1F] border border-[#E3C27D]/20 rounded-xl p-6">
      {/* Progress Ring */}
      <div className="text-center mb-6">
        <div className="inline-block relative">
          <svg width="120" height="120" className="transform -rotate-90">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#C6A664"
              strokeWidth="8"
              strokeDasharray={`${(progress / 100) * 314} 314`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold awareness-text">{progress}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Vow Statement */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-amber-50 to-amber-100">
        <p className="text-lg awareness-text text-center font-medium">
          {vow.statement}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 rounded-lg separation-card">
          <div className="text-2xl font-bold awareness-text">{vow.currentDay}</div>
          <div className="text-xs observation-text">Current Day</div>
        </div>
        <div className="text-center p-3 rounded-lg separation-card">
          <div className="text-2xl font-bold awareness-text">{vow.duration}</div>
          <div className="text-xs observation-text">Total Days</div>
        </div>
        <div className="text-center p-3 rounded-lg separation-card">
          <div className="text-2xl font-bold awareness-text">{vow.currentStreak || 0}</div>
          <div className="text-xs observation-text">Streak</div>
        </div>
      </div>

      {/* Why It Matters */}
      {vow.whyMatters && (
        <div className="mb-6">
          <h4 className="text-sm font-medium awareness-text mb-2">Why This Matters</h4>
          <p className="text-sm observation-text">{vow.whyMatters}</p>
        </div>
      )}

      {/* Details */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span className="observation-text">Category</span>
          <span className="awareness-text capitalize">{vow.category}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="observation-text">Created</span>
          <span className="awareness-text">{formatDate(vow.createdAt, 'short')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="observation-text">Status</span>
          <span className="awareness-text">{getVowStatusDisplay(vow)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={() => router.push('/reflection')}
          className="w-full py-3 rounded-lg font-medium text-white"
          style={{ backgroundColor: '#C6A664' }}
        >
          Daily Reflection
        </button>
        <button
          onClick={() => router.push('/log-trigger')}
          className="w-full py-3 rounded-lg font-medium border-2"
          style={{ borderColor: '#C6A664', color: '#C6A664' }}
        >
          Log Trigger
        </button>
      </div>
    </div>
  );
}
