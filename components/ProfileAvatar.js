/**
 * Profile Avatar Component
 * Profile dropdown with quick settings and user info
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { removeAuthToken } from '../lib/storage';
import { getTierBadge, getUserTier } from '../lib/featureAccess';

export default function ProfileAvatar({ userData, compact = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const dropdownRef = useRef(null);
  const router = useRouter();

  const currentTier = getUserTier(userData);
  const tierBadge = getTierBadge(currentTier);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    router.push('/login');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  if (compact) {
    return <CompactAvatar userData={userData} tierBadge={tierBadge} onClick={() => setIsOpen(!isOpen)} />;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#2A2C2F] transition-all"
      >
        <Avatar userData={userData} tierBadge={tierBadge} size="md" />
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium awareness-text">
            {userData?.firstName || 'User'}
          </div>
          <div className="text-xs observation-text">
            {tierBadge.icon} {currentTier}
          </div>
        </div>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <Dropdown
          userData={userData}
          currentTier={currentTier}
          tierBadge={tierBadge}
          theme={theme}
          onToggleTheme={toggleTheme}
          onLogout={handleLogout}
          onNavigate={(path) => {
            router.push(path);
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
}

function Avatar({ userData, tierBadge, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const initials = userData?.firstName && userData?.lastName
    ? `${userData.firstName[0]}${userData.lastName[0]}`
    : userData?.email?.[0]?.toUpperCase() || '?';

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white ring-2 ring-white`}
      style={{ backgroundColor: tierBadge.color }}
    >
      {tierBadge.icon}
    </div>
  );
}

function CompactAvatar({ userData, tierBadge, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative group"
    >
      <Avatar userData={userData} tierBadge={tierBadge} size="sm" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full corrective-bg flex items-center justify-center text-xs">
        {tierBadge.icon}
      </div>
    </button>
  );
}

function Dropdown({ userData, currentTier, tierBadge, theme, onToggleTheme, onLogout, onNavigate }) {
  return (
    <div className="absolute right-0 mt-2 w-72 corrective-bg rounded-xl shadow-xl border border-[#E3C27D]/20 py-2 z-50">
      {/* User Info */}
      <div className="px-4 py-3 border-b border-[#E3C27D]/20">
        <div className="flex items-center space-x-3">
          <Avatar userData={userData} tierBadge={tierBadge} size="lg" />
          <div className="flex-1">
            <div className="font-medium awareness-text">
              {userData?.firstName} {userData?.lastName}
            </div>
            <div className="text-sm observation-text">
              {userData?.email}
            </div>
          </div>
        </div>
        
        {/* Tier Badge */}
        <div 
          className="mt-3 inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm"
          style={{ 
            backgroundColor: `${tierBadge.color}20`,
            color: tierBadge.color 
          }}
        >
          <span>{tierBadge.icon}</span>
          <span className="font-medium capitalize">{currentTier}</span>
        </div>
      </div>

      {/* Quick Stats */}
      {userData?.stats && (
        <div className="px-4 py-3 border-b border-[#E3C27D]/20">
          <div className="grid grid-cols-3 gap-2 text-center">
            <QuickStat label="Vows" value={userData.stats.totalVows || 0} />
            <QuickStat label="Streak" value={userData.stats.currentStreak || 0} icon="🔥" />
            <QuickStat label="Level" value={userData.level || 1} icon="⭐" />
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="py-2">
        <MenuItem
          icon="👤"
          label="Profile"
          onClick={() => onNavigate('/profile')}
        />
        <MenuItem
          icon="⚙️"
          label="Settings"
          onClick={() => onNavigate('/settings')}
        />
        <MenuItem
          icon="📊"
          label="Progress"
          onClick={() => onNavigate('/dashboard')}
        />
        <MenuItem
          icon="📚"
          label="Learn"
          onClick={() => onNavigate('/learn')}
        />
        
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="w-full flex items-center justify-between px-4 py-2 hover:bg-[#2A2C2F] transition-all"
        >
          <div className="flex items-center space-x-3">
            <span className="text-lg">{theme === 'light' ? '🌙' : '☀️'}</span>
            <span className="text-sm observation-text">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
          <div className={`w-10 h-6 rounded-full p-1 transition-all ${
            theme === 'dark' ? 'bg-amber-500' : 'bg-gray-300'
          }`}>
            <div className={`w-4 h-4 rounded-full corrective-bg transition-transform ${
              theme === 'dark' ? 'transform translate-x-4' : ''
            }`} />
          </div>
        </button>

        {currentTier === 'trial' && (
          <MenuItem
            icon="⬆️"
            label="Upgrade"
            onClick={() => onNavigate('/pricing')}
            highlight={true}
          />
        )}
      </div>

      {/* Logout */}
      <div className="border-t border-[#E3C27D]/20 pt-2">
        <MenuItem
          icon="🚪"
          label="Logout"
          onClick={onLogout}
          danger={true}
        />
      </div>
    </div>
  );
}

function QuickStat({ label, value, icon }) {
  return (
    <div className="text-center">
      <div className="text-lg font-bold awareness-text">
        {icon ? `${icon} ${value}` : value}
      </div>
      <div className="text-xs observation-text">{label}</div>
    </div>
  );
}

function MenuItem({ icon, label, onClick, highlight = false, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-2 transition-all ${
        highlight
          ? 'bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200'
          : danger
          ? 'hover:bg-red-50'
          : 'hover:bg-[#2A2C2F]'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className={`text-sm ${
        danger ? 'text-red-600' : highlight ? 'font-medium' : 'observation-text'
      }`}>
        {label}
      </span>
    </button>
  );
}

/**
 * Mini Profile Display
 */
export function MiniProfile({ userData }) {
  const currentTier = getUserTier(userData);
  const tierBadge = getTierBadge(currentTier);

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg separation-card">
      <Avatar userData={userData} tierBadge={tierBadge} size="md" />
      <div className="flex-1">
        <div className="text-sm font-medium awareness-text">
          {userData?.firstName} {userData?.lastName}
        </div>
        <div className="flex items-center space-x-1 text-xs">
          <span>{tierBadge.icon}</span>
          <span className="observation-text capitalize">{currentTier}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Profile Card (for settings page)
 */
export function ProfileCard({ userData, onEdit }) {
  const currentTier = getUserTier(userData);
  const tierBadge = getTierBadge(currentTier);

  return (
    <div className="separation-card bg-[#1A1C1F] border border-[#E3C27D]/20 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Avatar userData={userData} tierBadge={tierBadge} size="lg" />
          <div>
            <h3 className="text-lg font-bold awareness-text">
              {userData?.firstName} {userData?.lastName}
            </h3>
            <p className="text-sm observation-text">{userData?.email}</p>
          </div>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-sm font-medium"
            style={{ color: '#C6A664' }}
          >
            Edit
          </button>
        )}
      </div>

      {/* Tier Info */}
      <div 
        className="p-3 rounded-lg mb-4"
        style={{ backgroundColor: `${tierBadge.color}20` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{tierBadge.icon}</span>
            <div>
              <div className="font-medium" style={{ color: tierBadge.color }}>
                {currentTier === 'trial' ? 'Free Trial' : `${currentTier} Plan`}
              </div>
              <div className="text-xs observation-text">
                {currentTier === 'trial' ? 'Limited features' : 'Full access'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-2 gap-3">
        <InfoBox label="Member Since" value={formatDate(userData?.createdAt)} />
        <InfoBox label="Total Vows" value={userData?.stats?.totalVows || 0} />
        <InfoBox label="Current Streak" value={`${userData?.stats?.currentStreak || 0} days`} />
        <InfoBox label="Level" value={userData?.level || 1} />
      </div>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="p-3 rounded-lg bg-[#1A1C1F]">
      <div className="text-xs observation-text mb-1">{label}</div>
      <div className="font-medium awareness-text">{value}</div>
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
