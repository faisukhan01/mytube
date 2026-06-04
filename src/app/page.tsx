'use client';

import { useYouTubeStore } from '@/store/youtube-store';
import YouTubeHeader from '@/components/youtube/header';
import YouTubeSidebar from '@/components/youtube/sidebar';
import CategoryChips from '@/components/youtube/category-chips';
import VideoGrid from '@/components/youtube/video-grid';
import VideoPlayerView from '@/components/youtube/video-player-view';
import SearchResults from '@/components/youtube/search-results';
import ShortsSection from '@/components/youtube/shorts-section';
import TrendingView from '@/components/youtube/trending-view';
import ChannelView from '@/components/youtube/channel-view';
import {
  HistoryView,
  LikedView,
  WatchLaterView,
  SubscriptionsView,
} from '@/components/youtube/library-views';
import { shortsVideos } from '@/lib/youtube-data';
import VideoCard from '@/components/youtube/video-card';

export default function Home() {
  const { currentView, sidebarOpen, sidebarMini } = useYouTubeStore();

  const showCategoryChips = currentView === 'home';
  const showSidebar = currentView !== 'player';

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
        return (
          <div className="p-4 md:p-6">
            <ShortsSection />
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">More Shorts</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {shortsVideos.map((video) => (
                  <VideoCard key={video.id} video={video} layout="shorts" />
                ))}
              </div>
            </div>
          </div>
        );
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
        className={`flex-1 pt-14 transition-all duration-200 ${getMainClasses()}`}
      >
        {renderContent()}
      </main>

      {/* Footer */}
      <footer
        className={`border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f0f0f] py-4 px-6 mt-auto transition-all duration-200 ${getMainClasses()}`}
      >
        <div className="max-w-[2000px] mx-auto">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">About</span>
            <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">Press</span>
            <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">Copyright</span>
            <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">Contact us</span>
            <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">Creators</span>
            <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">Advertise</span>
            <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">Developers</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">Terms</span>
            <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">Privacy</span>
            <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">Policy & Safety</span>
            <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">How YouTube works</span>
            <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">Test new features</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <div className="w-5 h-3 flex items-center">
              <svg viewBox="0 0 28.571 20" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"/>
                <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"/>
              </svg>
            </div>
            <span>© 2024 Google LLC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
