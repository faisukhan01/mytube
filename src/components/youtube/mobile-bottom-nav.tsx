'use client';

import { useYouTubeStore } from '@/store/youtube-store';
import { Home, Plus, Users, Library } from 'lucide-react';

function ShortsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="2" width="12" height="20" rx="4" fill="currentColor" />
      <path d="M10 8.5L15 12L10 15.5V8.5Z" fill="white" />
    </svg>
  );
}

export default function MobileBottomNav() {
  const { currentView, setCurrentView, goHome, toggleAuthDialog, user } = useYouTubeStore();

  const navItems = [
    {
      icon: <Home className="w-5 h-5" />,
      label: 'Home',
      action: () => goHome(),
      active: currentView === 'home',
    },
    {
      icon: <ShortsIcon className="w-5 h-5" />,
      label: 'Shorts',
      action: () => setCurrentView('shorts'),
      active: currentView === 'shorts',
    },
    {
      icon: <Plus className="w-6 h-6" />,
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
      label: 'Library',
      action: () => setCurrentView('history'),
      active: ['history', 'liked', 'watchlater', 'playlist'].includes(currentView),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0f0f0f] border-t border-gray-200 dark:border-gray-800 z-50 md:hidden flex items-center justify-around px-1 safe-area-bottom">
      {navItems.map((item, index) => (
        <button
          key={index}
          onClick={item.isCreate ? item.action : item.action}
          className={`flex flex-col items-center justify-center min-w-[48px] py-1.5 ${
            item.isCreate
              ? ''
              : item.active
                ? 'text-black dark:text-white'
                : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {item.isCreate ? (
            <div className="w-10 h-7 bg-gray-100 dark:bg-[#272727] rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#3f3f3f] transition-colors">
              {item.icon}
            </div>
          ) : (
            <>
              <div className="relative">
                {item.icon}
                {/* Active dot indicator */}
                {item.active && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-black dark:bg-white" />
                )}
              </div>
              {item.label && (
                <span className={`text-[10px] mt-0.5 leading-none ${
                  item.active ? 'font-medium' : ''
                }`}>
                  {item.label}
                </span>
              )}
            </>
          )}
        </button>
      ))}
    </nav>
  );
}
