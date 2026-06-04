'use client';

import { useYouTubeStore } from '@/store/youtube-store';
import { Home, Plus, Users, Library } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

function ShortsIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="2" width="12" height="20" rx="4" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? 0 : 1.5} />
      <path d="M10 8.5L15 12L10 15.5V8.5Z" fill={filled ? 'white' : 'currentColor'} />
    </svg>
  );
}

export default function MobileBottomNav() {
  const { currentView, setCurrentView, goHome, toggleAuthDialog, user } = useYouTubeStore();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [clickFeedback, setClickFeedback] = useState<string | null>(null);

  // Track scroll progress
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollHeight > 0) {
      const progress = (scrollTop / scrollHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleClick = (itemLabel: string, action: () => void) => {
    setClickFeedback(itemLabel);
    setTimeout(() => setClickFeedback(null), 150);
    action();
  };

  const navItems = [
    {
      icon: <Home className="w-5 h-5" />,
      filledIcon: <Home className="w-5 h-5" fill="currentColor" />,
      label: 'Home',
      action: () => goHome(),
      active: currentView === 'home',
    },
    {
      icon: <ShortsIcon className="w-5 h-5" />,
      filledIcon: <ShortsIcon className="w-5 h-5" filled />,
      label: 'Shorts',
      action: () => setCurrentView('shorts'),
      active: currentView === 'shorts',
    },
    {
      icon: <Plus className="w-6 h-6" />,
      filledIcon: <Plus className="w-6 h-6" />,
      label: '',
      action: () => {
        if (!user) {
          toggleAuthDialog();
        }
      },
      isCreate: true,
    },
    {
      icon: <Users className="w-5 h-5" />,
      filledIcon: <Users className="w-5 h-5" fill="currentColor" />,
      label: 'Subscriptions',
      action: () => {
        if (!user) {
          toggleAuthDialog();
        } else {
          setCurrentView('subscriptions');
        }
      },
      active: currentView === 'subscriptions',
    },
    {
      icon: <Library className="w-5 h-5" />,
      filledIcon: <Library className="w-5 h-5" fill="currentColor" />,
      label: 'Library',
      action: () => setCurrentView('history'),
      active: ['history', 'liked', 'watchlater', 'playlist'].includes(currentView),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-area-bottom">
      {/* Scroll progress indicator */}
      {scrollProgress > 0 && (
        <div className="h-[2px] bg-transparent">
          <div
            className="h-full bg-[#ff0000] transition-[width] duration-100 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}

      <div className="bg-white dark:bg-[#0f0f0f] border-t border-gray-200 dark:border-gray-800 flex items-center justify-around px-1">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleClick(item.label || 'create', item.action)}
            className={`flex flex-col items-center justify-center min-w-[48px] py-1.5 transition-transform duration-100 ${
              clickFeedback === (item.label || 'create') ? 'scale-95' : 'scale-100'
            } ${
              item.isCreate
                ? ''
                : item.active
                  ? 'text-black dark:text-white'
                  : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {item.isCreate ? (
              <div className={`w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-md transition-transform duration-100 ${
                clickFeedback === 'create' ? 'scale-90' : 'scale-100'
              } ${!user ? 'opacity-80' : ''}`}>
                <Plus className="w-6 h-6 text-white" />
              </div>
            ) : (
              <>
                <div className={`relative px-4 py-1 rounded-full transition-all duration-200 ${
                  item.active ? 'bg-gray-100 dark:bg-[#272727]' : ''
                }`}>
                  <div className={`transition-transform duration-200 ${
                    item.active ? 'scale-110' : 'scale-100'
                  }`}>
                    {item.active ? item.filledIcon : item.icon}
                  </div>
                </div>
                {item.label && (
                  <span className={`text-[10px] mt-0.5 leading-none transition-all duration-200 ${
                    item.active ? 'font-medium' : ''
                  }`}>
                    {item.label}
                  </span>
                )}
              </>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
