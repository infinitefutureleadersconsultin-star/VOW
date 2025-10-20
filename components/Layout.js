/**
 * Layout Component
 * App shell with navigation, header, and footer
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { loadAuthToken, removeAuthToken } from '../lib/storage';
import { getTierBadge, getUserTier } from '../lib/featureAccess';

export default function Layout({ children, userData = null, showNav = true }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    removeAuthToken();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showNav && (
        <Header
          userData={userData}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          userMenuOpen={userMenuOpen}
          setUserMenuOpen={setUserMenuOpen}
          onLogout={handleLogout}
        />
      )}
      
      <main className="flex-1">
        {children}
      </main>
      
      {showNav && <Footer />}
    </div>
  );
}

function Header({ userData, mobileMenuOpen, setMobileMenuOpen, userMenuOpen, setUserMenuOpen, onLogout }) {
  const router = useRouter();
  const currentTier = getUserTier(userData);
  const tierBadge = getTierBadge(currentTier);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { name: 'Vows', path: '/vow', icon: '📜' },
    { name: 'Reflect', path: '/reflection', icon: '💭' },
    { name: 'Learn', path: '/learn', icon: '📚' }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push('/dashboard')}
          >
            <div className="text-2xl">📿</div>
            <span className="text-xl font-bold" style={{ color: '#C6A664' }}>VOW</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  router.pathname === item.path
                    ? 'bg-gradient-to-r from-amber-100 to-amber-50'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span className="text-sm font-medium awareness-text">{item.name}</span>
              </button>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Quick Vow Button */}
            <button
              onClick={() => router.push('/create-vow')}
              className="hidden md:flex items-center px-4 py-2 rounded-lg font-medium text-white text-sm"
              style={{ backgroundColor: '#C6A664' }}
            >
              <span className="mr-2">+</span>
              New Vow
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" 
                     style={{ backgroundColor: tierBadge.color }}>
                  {tierBadge.icon}
                </div>
                <span className="hidden md:inline text-sm font-medium awareness-text">
                  {userData?.firstName || 'User'}
                </span>
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <button
                    onClick={() => {
                      router.push('/profile');
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      router.push('/settings');
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      router.push('/pricing');
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Upgrade
                  </button>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={() => {
                      onLogout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    router.push(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                    router.pathname === item.path
                      ? 'bg-gradient-to-r from-amber-100 to-amber-50'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium awareness-text">{item.name}</span>
                </button>
              ))}
              <button
                onClick={() => {
                  router.push('/create-vow');
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 rounded-lg font-medium text-white"
                style={{ backgroundColor: '#C6A664' }}
              >
                + Create New Vow
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function Footer() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="text-2xl">📿</div>
              <span className="text-xl font-bold" style={{ color: '#C6A664' }}>VOW</span>
            </div>
            <p className="text-sm observation-text">
              Daily remembrance creates lasting change.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium awareness-text mb-3">Quick Links</h4>
            <div className="space-y-2">
              <button
                onClick={() => router.push('/learn')}
                className="block text-sm observation-text hover:text-gray-900"
              >
                Learn VOW Theory
              </button>
              <button
                onClick={() => router.push('/pricing')}
                className="block text-sm observation-text hover:text-gray-900"
              >
                Pricing
              </button>
              <button
                onClick={() => router.push('/terms')}
                className="block text-sm observation-text hover:text-gray-900"
              >
                Terms
              </button>
              <button
                onClick={() => router.push('/privacy')}
                className="block text-sm observation-text hover:text-gray-900"
              >
                Privacy
              </button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium awareness-text mb-3">Support</h4>
            <p className="text-sm observation-text mb-2">
              Need help? We're here for you.
            </p>
            <a 
              href="mailto:support@vowtheory.com"
              className="text-sm hover:underline"
              style={{ color: '#C6A664' }}
            >
              support@vowtheory.com
            </a>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm observation-text">
            © {currentYear} VOW Theory. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/**
 * Simple Layout (no nav)
 */
export function SimpleLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
