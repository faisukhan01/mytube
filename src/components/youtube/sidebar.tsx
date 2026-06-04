'use client';

import { useYouTubeStore } from '@/store/youtube-store';
import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  Flame,
  ShoppingBag,
  Music2,
  Film,
  Radio,
  Gamepad2,
  Newspaper,
  Trophy,
  Lightbulb,
  Shirt,
  Youtube,
  Settings,
  Flag,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  History,
  ListVideo,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  view?: string;
  active?: boolean;
}

const mainItems: SidebarItem[] = [
  { icon: <Home className="w-5 h-5" />, label: 'Home', view: 'home' },
  { icon: <Compass className="w-5 h-5" />, label: 'Explore', view: 'trending' },
  { icon: <PlaySquare className="w-5 h-5" />, label: 'Shorts', view: 'shorts' },
  { icon: <ListVideo className="w-5 h-5" />, label: 'Subscriptions', view: 'subscriptions' },
];

const youItems: SidebarItem[] = [
  { icon: <History className="w-5 h-5" />, label: 'History', view: 'history' },
  { icon: <PlaySquare className="w-5 h-5" />, label: 'Your videos', view: 'home' },
  { icon: <Clock className="w-5 h-5" />, label: 'Watch later', view: 'watchlater' },
  { icon: <ThumbsUp className="w-5 h-5" />, label: 'Liked videos', view: 'liked' },
];

const exploreItems: SidebarItem[] = [
  { icon: <Flame className="w-5 h-5" />, label: 'Trending', view: 'trending' },
  { icon: <ShoppingBag className="w-5 h-5" />, label: 'Shopping' },
  { icon: <Music2 className="w-5 h-5" />, label: 'Music' },
  { icon: <Film className="w-5 h-5" />, label: 'Movies' },
  { icon: <Radio className="w-5 h-5" />, label: 'Live' },
  { icon: <Gamepad2 className="w-5 h-5" />, label: 'Gaming' },
  { icon: <Newspaper className="w-5 h-5" />, label: 'News' },
  { icon: <Trophy className="w-5 h-5" />, label: 'Sports' },
  { icon: <Lightbulb className="w-5 h-5" />, label: 'Learning' },
  { icon: <Shirt className="w-5 h-5" />, label: 'Fashion & Beauty' },
];

const moreItems: SidebarItem[] = [
  { icon: <Youtube className="w-5 h-5" />, label: 'YouTube Premium' },
  { icon: <Settings className="w-5 h-5" />, label: 'Settings' },
  { icon: <Flag className="w-5 h-5" />, label: 'Report history' },
  { icon: <HelpCircle className="w-5 h-5" />, label: 'Help' },
  { icon: <MessageSquare className="w-5 h-5" />, label: 'Send feedback' },
];

export default function YouTubeSidebar() {
  const { sidebarOpen, currentView, setCurrentView, goHome, sidebarMini } = useYouTubeStore();

  const handleItemClick = (view?: string) => {
    if (!view) return;
    if (view === 'home') {
      goHome();
    } else {
      setCurrentView(view as Parameters<typeof setCurrentView>[0]);
    }
  };

  // Mini sidebar (collapsed)
  if (sidebarMini && !sidebarOpen) {
    return (
      <aside className="fixed left-0 top-14 bottom-0 w-[72px] bg-white dark:bg-[#0f0f0f] z-40 overflow-y-auto hidden md:flex flex-col items-center pt-1 pb-4">
        {mainItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleItemClick(item.view)}
            className={`flex flex-col items-center justify-center w-full py-4 px-1 hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors ${
              currentView === item.view ? 'font-medium' : ''
            }`}
          >
            <div className={`${currentView === item.view ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-400'}`}>
              {item.icon}
            </div>
            <span className="text-[10px] mt-1.5 text-gray-700 dark:text-gray-400 leading-tight">{item.label}</span>
          </button>
        ))}
      </aside>
    );
  }

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => useYouTubeStore.getState().toggleSidebar()}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-14 bottom-0 w-[240px] bg-white dark:bg-[#0f0f0f] z-40 overflow-y-auto transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:hidden'
        }`}
      >
        <div className="py-3 px-3">
          {/* Main items */}
          {mainItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item.view)}
              className={`flex items-center gap-6 w-full px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors ${
                currentView === item.view ? 'bg-gray-100 dark:bg-[#272727] font-medium' : ''
              }`}
            >
              <span className={currentView === item.view ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-400'}>
                {item.icon}
              </span>
              <span className="text-sm text-gray-800 dark:text-gray-200">{item.label}</span>
            </button>
          ))}

          <Separator className="my-3 dark:bg-gray-700" />

          {/* You section */}
          <div className="flex items-center gap-1 px-3 mb-1">
            <span className="text-base text-gray-800 dark:text-gray-200 font-medium">You</span>
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
          {youItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item.view)}
              className={`flex items-center gap-6 w-full px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors ${
                currentView === item.view ? 'bg-gray-100 dark:bg-[#272727] font-medium' : ''
              }`}
            >
              <span className={currentView === item.view ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-400'}>
                {item.icon}
              </span>
              <span className="text-sm text-gray-800 dark:text-gray-200">{item.label}</span>
            </button>
          ))}

          <Separator className="my-3 dark:bg-gray-700" />

          {/* Explore section */}
          <h3 className="px-3 mb-1 text-base text-gray-800 dark:text-gray-200 font-medium">Explore</h3>
          {exploreItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item.view)}
              className="flex items-center gap-6 w-full px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors"
            >
              <span className="text-gray-700 dark:text-gray-400">{item.icon}</span>
              <span className="text-sm text-gray-800 dark:text-gray-200">{item.label}</span>
            </button>
          ))}

          <Separator className="my-3 dark:bg-gray-700" />

          {/* More from YouTube */}
          <h3 className="px-3 mb-1 text-base text-gray-800 dark:text-gray-200 font-medium">More from YouTube</h3>
          {moreItems.map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-6 w-full px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors"
            >
              <span className="text-gray-700 dark:text-gray-400">{item.icon}</span>
              <span className="text-sm text-gray-800 dark:text-gray-200">{item.label}</span>
            </button>
          ))}

          <Separator className="my-3 dark:bg-gray-700" />

          {/* Footer */}
          <div className="px-3 py-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              About Press Copyright Contact us Creators Advertise Developers
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-2">
              Terms Privacy Policy & Safety How YouTube works Test new features
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">© 2024 Google LLC</p>
          </div>
        </div>
      </aside>
    </>
  );
}
