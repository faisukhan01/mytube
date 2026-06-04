'use client';

import { useEffect } from 'react';
import { useYouTubeStore } from '@/store/youtube-store';
import YouTubeHeader from '@/components/youtube/header';
import YouTubeSidebar from '@/components/youtube/sidebar';
import CategoryChips from '@/components/youtube/category-chips';
import VideoGrid from '@/components/youtube/video-grid';
import VideoPlayerView from '@/components/youtube/video-player-view';
import SearchResults from '@/components/youtube/search-results';
import ShortsPlayer from '@/components/youtube/shorts-player';
import TrendingView from '@/components/youtube/trending-view';
import ChannelView from '@/components/youtube/channel-view';
import MiniPlayer from '@/components/youtube/mini-player';
import PlaylistView from '@/components/youtube/playlist-view';
import {
  HistoryView,
  LikedView,
  WatchLaterView,
  SubscriptionsView,
} from '@/components/youtube/library-views';
import KeyboardShortcutsDialog from '@/components/youtube/keyboard-shortcuts-dialog';

export default function Home() {
  const { currentView, sidebarOpen, sidebarMini, checkSession } = useYouTubeStore();

  const showCategoryChips = currentView === 'home';
  const showSidebar = currentView !== 'player' && currentView !== 'shorts';

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Build class names for the main content based on sidebar state
  const getMainClasses = () => {
    if (!showSidebar) return 'ml-0';
    if (sidebarMini && !sidebarOpen) return 'md:ml-[72px]';
    if (sidebarOpen) return 'md:ml-[240px]';
    return '';
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <CategoryChips />
            <VideoGrid />
          </>
        );
      case 'player':
        return <VideoPlayerView />;
      case 'search':
        return <SearchResults />;
      case 'shorts':
        return <ShortsPlayer />;
      case 'trending':
        return <TrendingView />;
      case 'history':
        return <HistoryView />;
      case 'liked':
        return <LikedView />;
      case 'watchlater':
        return <WatchLaterView />;
      case 'subscriptions':
        return <SubscriptionsView />;
      case 'channel':
        return <ChannelView />;
      case 'playlist':
        return <PlaylistView />;
      default:
        return (
          <>
            <CategoryChips />
            <VideoGrid />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] flex flex-col">
      {/* Header */}
      <YouTubeHeader />

      {/* Sidebar */}
      {showSidebar && <YouTubeSidebar />}

      {/* Main content */}
      <main
        className={`flex-1 pt-14 sidebar-transition ${getMainClasses()}`}
      >
        <div key={currentView} className="page-transition">
          {renderContent()}
        </div>
      </main>

      {/* Mini Player */}
      <MiniPlayer />

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog />

      {/* Footer - hidden in shorts and player view */}
      {currentView !== 'shorts' && currentView !== 'player' && (
      <footer
        className={`border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f0f0f] py-4 px-4 md:px-6 mt-auto sidebar-transition ${getMainClasses()}`}
      >
        <div className="max-w-[2000px] mx-auto">
          {/* Section 1: About, Press, Copyright, Contact us, Creators, Advertise, Developers */}
          <div className="flex flex-wrap gap-x-3 md:gap-x-4 gap-y-1 md:gap-y-1.5 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-2 md:mb-3 justify-center md:justify-start">
            <a href="#" className="footer-link">About</a>
            <a href="#" className="footer-link">Press</a>
            <a href="#" className="footer-link">Copyright</a>
            <a href="#" className="footer-link">Contact us</a>
            <a href="#" className="footer-link">Creators</a>
            <a href="#" className="footer-link">Advertise</a>
            <a href="#" className="footer-link">Developers</a>
          </div>
          {/* Section 2: Terms, Privacy, Policy & Safety, How YouTube works, Test new features */}
          <div className="flex flex-wrap gap-x-3 md:gap-x-4 gap-y-1 md:gap-y-1.5 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-3 md:mb-4 justify-center md:justify-start">
            <a href="#" className="footer-link">Terms</a>
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Policy & Safety</a>
            <a href="#" className="footer-link">How YouTube works</a>
            <a href="#" className="footer-link">Test new features</a>
          </div>
          {/* Copyright line */}
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 justify-center md:justify-start">
            <div className="w-5 h-3.5 flex items-center">
              <svg viewBox="0 0 28.571 20" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 0 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"/>
                <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"/>
              </svg>
            </div>
            <span>© 2025 Google LLC</span>
          </div>
          {/* Location */}
          <div className="mt-1 text-xs text-gray-400 dark:text-gray-500 flex justify-center md:justify-start">
            <a href="#" className="footer-link">Location: Pakistan</a>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
}
