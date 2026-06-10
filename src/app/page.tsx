'use client';

import { useEffect, useCallback } from 'react';
import { useYouTubeStore, parseHash } from '@/store/youtube-store';
import { getVideoById, shortsVideos, getShuffledShorts } from '@/lib/youtube-data';
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
import MobileBottomNav from '@/components/youtube/mobile-bottom-nav';
import { Globe } from 'lucide-react';

export default function Home() {
  const {
    currentView,
    sidebarOpen,
    sidebarMini,
    currentVideo,
    searchQuery,
    checkSession,
    user,
  } = useYouTubeStore();

  const showCategoryChips = currentView === 'home';
  const showSidebar = currentView !== 'player' && currentView !== 'shorts';
  const showMobileBottomNav = currentView !== 'player' && currentView !== 'shorts';
  const showFooter = currentView !== 'shorts' && currentView !== 'player' && currentView !== 'channel';

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Handle hash-based URL routing: parse initial hash and listen for popstate
  const applyHashView = useCallback((isPopstate = false) => {
    const hashInfo = parseHash();
    void isPopstate; // Used to indicate browser navigation vs initial load
    const store = useYouTubeStore.getState();

    if (hashInfo.view === 'home') {
      store.setCurrentView('home');
    } else if (hashInfo.view === 'player' && hashInfo.videoId) {
      const video = getVideoById(hashInfo.videoId);
      if (video) {
        store.openVideo(video);
      }
    } else if (hashInfo.view === 'shorts') {
      if (hashInfo.videoId) {
        // When opening a specific short via URL, just open Shorts view
        // The ShortsPlayer will show from the beginning with shuffled order
        store.setCurrentView('shorts');
      } else {
        store.setCurrentView('shorts');
      }
    } else if (hashInfo.view === 'search' && hashInfo.query) {
      store.search(hashInfo.query);
    } else if (hashInfo.view === 'trending') {
      store.setCurrentView('trending');
    } else if (hashInfo.view === 'channel' && hashInfo.channel) {
      store.openChannel(hashInfo.channel);
    } else if (hashInfo.view === 'history') {
      store.setCurrentView('history');
    } else if (hashInfo.view === 'liked') {
      store.setCurrentView('liked');
    } else if (hashInfo.view === 'watchlater') {
      store.setCurrentView('watchlater');
    } else if (hashInfo.view === 'subscriptions') {
      store.setCurrentView('subscriptions');
    } else if (hashInfo.view === 'playlist' && hashInfo.playlistId) {
      store.openPlaylist(hashInfo.playlistId);
    }
  }, []);

  // Parse initial hash on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash !== '#' && hash !== '#/') {
      // Use requestAnimationFrame to ensure React has finished initial render
      requestAnimationFrame(() => {
        applyHashView();
      });
    }
  }, [applyHashView]);

  // Listen for popstate events (browser back/forward) and hashchange
  useEffect(() => {
    const handlePopState = () => {
      applyHashView(true);
    };
    const handleHashChange = () => {
      applyHashView(true);
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [applyHashView]);

  // Update page title based on current view
  useEffect(() => {
    if (currentView === 'player' && currentVideo) {
      document.title = `${currentVideo.title} - MyTube`;
    } else if (currentView === 'search' && searchQuery) {
      document.title = `${searchQuery} - MyTube`;
    } else {
      document.title = 'MyTube';
    }
  }, [currentView, currentVideo, searchQuery]);

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
        className={`flex-1 pt-14 sidebar-transition ${getMainClasses()} ${showMobileBottomNav ? 'pb-14 md:pb-0' : ''}`}
      >
        <div key={currentView} className="page-transition">
          {renderContent()}
        </div>
      </main>

      {/* Mini Player */}
      <MiniPlayer />

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog />

      {/* Footer - hidden in shorts, player, and channel views */}
      {showFooter && (
      <footer
        className={`border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f0f0f] py-3 px-4 md:px-6 mt-auto sidebar-transition ${getMainClasses()} hidden md:block`}
      >
        <div className="max-w-[2000px] mx-auto">
          {/* Section 1 */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-gray-500 dark:text-gray-400 mb-2 justify-start">
            <a href="#" className="footer-link hover:text-gray-900 dark:hover:text-gray-200">About</a>
            <a href="#" className="footer-link hover:text-gray-900 dark:hover:text-gray-200">Press</a>
            <a href="#" className="footer-link hover:text-gray-900 dark:hover:text-gray-200">Copyright</a>
            <a href="#" className="footer-link hover:text-gray-900 dark:hover:text-gray-200">Contact us</a>
            <a href="#" className="footer-link hover:text-gray-900 dark:hover:text-gray-200">Creators</a>
            <a href="#" className="footer-link hover:text-gray-900 dark:hover:text-gray-200">Advertise</a>
            <a href="#" className="footer-link hover:text-gray-900 dark:hover:text-gray-200">Developers</a>
          </div>
          {/* Section 2 */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-gray-500 dark:text-gray-400 mb-2 justify-start">
            <a href="#" className="footer-link hover:text-gray-900 dark:hover:text-gray-200">Terms</a>
            <a href="#" className="footer-link hover:text-gray-900 dark:hover:text-gray-200">Privacy</a>
            <a href="#" className="footer-link hover:text-gray-900 dark:hover:text-gray-200">Policy & Safety</a>
            <a href="#" className="footer-link hover:text-gray-900 dark:hover:text-gray-200">How MyTube works</a>
            <a href="#" className="footer-link hover:text-gray-900 dark:hover:text-gray-200">Test new features</a>
          </div>
          {/* Section 3: Restricted Mode, etc */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-gray-500 dark:text-gray-400 mb-3 justify-start">
            <a href="#" className="footer-link hover:text-gray-900 dark:hover:text-gray-200">Restricted Mode: Off</a>
          </div>
          {/* Copyright + Location */}
          <div className="flex items-center gap-3 text-[12px] text-gray-400 dark:text-gray-500 justify-start">
            <div className="flex items-center gap-2">
              <div className="w-5 h-3.5 flex items-center">
                <svg viewBox="0 0 28.571 20" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                  <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 0 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"/>
                  <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"/>
                </svg>
              </div>
              <span>© 2025 Google LLC</span>
            </div>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <a href="#" className="footer-link hover:text-gray-900 dark:hover:text-gray-200 flex items-center gap-1">
              <Globe className="w-3 h-3" />
              Pakistan
            </a>
          </div>
        </div>
      </footer>
      )}

      {/* Mobile Bottom Navigation */}
      {showMobileBottomNav && <MobileBottomNav />}
    </div>
  );
}
