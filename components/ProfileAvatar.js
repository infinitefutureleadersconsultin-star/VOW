import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ProfileAvatar({ userData, onLogout }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [router.pathname]);

  const handleLogout = () => {
    setIsOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getSubscriptionBadge = (status) => {
    const badges = {
      trial: { text: 'Trial', color: 'bg-amber-100 text-amber-700' },
      active: { text: 'Pro', color: 'bg-green-100 text-green-700' },
      premium: { text: 'Premium', color: 'bg-purple-100 text-purple-700' },
      executive: { text: 'Executive', color: 'bg-blue-100 text-blue-700' }
    };
    
    return badges[status] || null;
  };

  const badge = getSubscriptionBadge(userData?.subscriptionStatus);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-amber-600 rounded-lg p-1 transition-all"
        aria-label="Profile menu"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-medium text-sm shadow-sm">
            {getInitials(userData?.name)}
          </div>
          
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-900 leading-tight">
              {userData?.name || 'User'}
            </p>
            {badge && (
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${badge.color}`}>
                {badge.text}
              </span>
            )}
          </div>
          
          <svg 
            className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{userData?.name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{userData?.email || ''}</p>
            {badge && (
              <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${badge.color}`}>
                {badge.text}
              </span>
            )}
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/dashboard');
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <span>🏠</span>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/profile');
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <span>👤</span>
              <span>Profile</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/settings');
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <span>⚙️</span>
              <span>Settings</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/pricing');
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <span>💳</span>
              <span>Subscription</span>
            </button>
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                window.location.href = 'mailto:support@vowapp.com';
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <span>📧</span>
              <span>Help & Support</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/terms');
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <span>📄</span>
              <span>Terms & Privacy</span>
            </button>
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 font-medium"
            >
              <span>🚪</span>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
