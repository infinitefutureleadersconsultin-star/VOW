import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { User, LogOut } from 'lucide-react';

export default function ProfileAvatar({ userData, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 focus:outline-none"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-500 flex items-center justify-center text-gray-900 font-semibold shadow-lg">
          {getInitials(userData?.name)}
        </div>
        <span className="text-gray-100 font-medium hidden sm:block">
          {userData?.name || 'User'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 glass-card rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="p-4 border-b border-gray-700">
            <p className="text-sm font-medium text-gray-100">{userData?.name}</p>
            <p className="text-xs text-gray-400 mt-1">{userData?.email}</p>
          </div>

          <div className="py-2">
            <button
              onClick={() => {
                router.push('/profile');
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-100 hover:bg-gray-700/50 flex items-center space-x-2 transition-colors"
            >
              <User size={16} className="text-yellow-600" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-100 hover:bg-gray-700/50 flex items-center space-x-2 transition-colors"
            >
              <LogOut size={16} className="text-yellow-600" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
