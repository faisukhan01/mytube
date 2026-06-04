'use client';

import { useYouTubeStore } from '@/store/youtube-store';
import { homeVideos, shortsVideos } from '@/lib/youtube-data';
import VideoCard from './video-card';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import { Bell, Link as LinkIcon, MapPin, ChevronRight, Calendar, Eye, Users, Globe, Youtube, ListVideo, Info, Film } from 'lucide-react';

type ChannelTab = 'Videos' | 'Shorts' | 'Playlists' | 'About';

export default function ChannelView() {
  const { selectedChannel } = useYouTubeStore();
  const [activeTab, setActiveTab] = useState<ChannelTab>('Videos');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Get channel videos from both homeVideos and shortsVideos
  const channelHomeVideos = useMemo(() => {
    return homeVideos.filter((v) => v.channelTitle === selectedChannel);
  }, [selectedChannel]);

  const channelShortsVideos = useMemo(() => {
    return shortsVideos.filter((v) => v.channelTitle === selectedChannel);
  }, [selectedChannel]);

  const allChannelVideos = useMemo(() => {
    return [...channelHomeVideos, ...channelShortsVideos];
  }, [channelHomeVideos, channelShortsVideos]);

  const channelInfo = useMemo(() => {
    if (allChannelVideos.length > 0) {
      return allChannelVideos[0];
    }
    return null;
  }, [allChannelVideos]);

  const channelColor = channelInfo?.channelColor || '#FF0000';
  const channelInitial = channelInfo?.channelInitial || selectedChannel.charAt(0).toUpperCase();
  const subscribers = channelInfo?.subscribers || '0';

  // Filter shorts (videos with duration under 1 minute)
  const channelShorts = useMemo(() => {
    return allChannelVideos.filter((v) => {
      const parts = v.duration.split(':');
      if (parts.length === 2) {
        const minutes = parseInt(parts[0], 10);
        return minutes === 0;
      }
      return false;
    });
  }, [allChannelVideos]);

  // Regular videos (not shorts, not live)
  const channelRegularVideos = useMemo(() => {
    return channelHomeVideos.filter((v) => {
      const parts = v.duration.split(':');
      if (parts.length === 2) {
        const minutes = parseInt(parts[0], 10);
        return minutes > 0;
      }
      return v.duration !== 'LIVE';
    });
  }, [channelHomeVideos]);

  const tabs: ChannelTab[] = ['Videos', 'Shorts', 'Playlists', 'About'];

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Channel Banner - Gradient */}
      <div className="h-[120px] sm:h-[150px] md:h-[200px] bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 relative">
        <div className="absolute inset-0 bg-black/10" />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Channel Info */}
      <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Avatar with ring */}
          <div className="relative -mt-12 sm:-mt-8 shrink-0">
            <div
              className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full flex items-center justify-center text-white font-bold text-3xl md:text-4xl ring-4 ring-white dark:ring-[#0f0f0f]"
              style={{ backgroundColor: channelColor }}
            >
              {channelInitial}
            </div>
          </div>

          {/* Name & Stats */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {selectedChannel}
              </h1>
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
              <span>@{selectedChannel.toLowerCase().replace(/\s+/g, '')}</span>
              <span>•</span>
              <span>{subscribers} subscribers</span>
              <span>•</span>
              <span>{allChannelVideos.length} videos</span>
            </div>

            {/* Description snippet */}
            {channelInfo && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                {channelInfo.description}
              </p>
            )}

            {/* Links */}
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <button className="flex items-center gap-1 text-sm text-blue-700 dark:text-blue-400 hover:underline">
                <LinkIcon className="w-3.5 h-3.5" />
                youtube.com
              </button>
              <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-3.5 h-3.5" />
                United States
              </span>
              <button className="flex items-center gap-0.5 text-sm text-blue-700 dark:text-blue-400 hover:underline">
                More about this channel <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Subscribe button - YouTube red */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={() => setIsSubscribed(!isSubscribed)}
              variant="default"
              className={`rounded-full text-sm font-medium px-6 h-10 transition-colors ${
                isSubscribed
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                  : 'bg-[#ff0000] hover:bg-[#cc0000] text-white'
              }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </Button>
            {isSubscribed && (
              <button
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 md:px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-black dark:border-white text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 md:p-6">
        {/* Videos Tab */}
        {activeTab === 'Videos' && (
          <>
            {channelRegularVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                {channelRegularVideos.map((video) => (
                  <VideoCard key={video.id} video={video} layout="grid" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-20">
                <Film className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No videos yet</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">This channel hasn&apos;t uploaded any videos</p>
              </div>
            )}
          </>
        )}

        {/* Shorts Tab */}
        {activeTab === 'Shorts' && (
          <>
            {channelShorts.length > 0 ? (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
                      <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Shorts</h2>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
                  {channelShorts.map((video) => (
                    <div key={video.id} className="shrink-0 w-[180px]">
                      <VideoCard video={video} layout="shorts" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-20">
                <div className="w-16 h-16 bg-red-600 rounded flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
                    <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No shorts available</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">This channel hasn&apos;t posted any shorts yet</p>
              </div>
            )}
          </>
        )}

        {/* Playlists Tab */}
        {activeTab === 'Playlists' && (
          <div className="flex flex-col items-center py-20">
            <ListVideo className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No playlists yet</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">This channel hasn&apos;t created any playlists</p>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'About' && (
          <div className="max-w-[800px] space-y-6">
            {/* Description */}
            <div className="bg-gray-50 dark:bg-[#272727] rounded-xl p-5">
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {channelInfo?.description || 'No description available.'}
              </p>
            </div>

            {/* Stats */}
            <div className="bg-gray-50 dark:bg-[#272727] rounded-xl p-5 space-y-3">
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Stats</h3>
              <div className="flex items-center gap-3 text-sm">
                <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">
                  {allChannelVideos.length > 0 ? `${Math.floor(Math.random() * 500 + 50)}M total views` : '0 total views'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Users className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{subscribers} subscribers</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Joined Jan 15, 2018</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Film className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{allChannelVideos.length} videos</span>
              </div>
            </div>

            {/* Links */}
            <div className="bg-gray-50 dark:bg-[#272727] rounded-xl p-5">
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Links</h3>
              <div className="space-y-2.5">
                <a href="#" className="flex items-center gap-3 text-sm text-blue-700 dark:text-blue-400 hover:underline">
                  <Youtube className="w-4 h-4 shrink-0" />
                  youtube.com/@{selectedChannel.toLowerCase().replace(/\s+/g, '')}
                </a>
                <a href="#" className="flex items-center gap-3 text-sm text-blue-700 dark:text-blue-400 hover:underline">
                  <Globe className="w-4 h-4 shrink-0" />
                  {selectedChannel.toLowerCase().replace(/\s+/g, '')}.com
                </a>
                <a href="#" className="flex items-center gap-3 text-sm text-blue-700 dark:text-blue-400 hover:underline">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  @{selectedChannel.toLowerCase().replace(/\s+/g, '')}
                </a>
                <a href="#" className="flex items-center gap-3 text-sm text-blue-700 dark:text-blue-400 hover:underline">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  @{selectedChannel.toLowerCase().replace(/\s+/g, '')}
                </a>
              </div>
            </div>

            {/* Channel info */}
            <div className="bg-gray-50 dark:bg-[#272727] rounded-xl p-5">
              <div className="flex items-center gap-3 text-sm">
                <Info className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">
                  {Math.floor(Math.random() * 500 + 50)}M views • {allChannelVideos.length} videos • {subscribers} subscribers
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Empty state when no videos at all */}
        {allChannelVideos.length === 0 && activeTab !== 'About' && activeTab !== 'Playlists' && (
          <div className="flex flex-col items-center py-20">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4"
              style={{ backgroundColor: channelColor }}
            >
              {channelInitial}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No videos found for this channel</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">Check back later for new content</p>
          </div>
        )}
      </div>
    </div>
  );
}
