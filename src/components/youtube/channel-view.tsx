'use client';

import { useYouTubeStore } from '@/store/youtube-store';
import { homeVideos } from '@/lib/youtube-data';
import VideoCard from './video-card';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import { Bell, Link as LinkIcon, MapPin, ChevronRight } from 'lucide-react';

type ChannelTab = 'Home' | 'Videos' | 'Shorts' | 'Live';

export default function ChannelView() {
  const { selectedChannel } = useYouTubeStore();
  const [activeTab, setActiveTab] = useState<ChannelTab>('Home');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const channelVideos = useMemo(() => {
    return homeVideos.filter((v) => v.channelTitle === selectedChannel);
  }, [selectedChannel]);

  const channelInfo = useMemo(() => {
    if (channelVideos.length > 0) {
      return channelVideos[0];
    }
    return null;
  }, [channelVideos]);

  const channelColor = channelInfo?.channelColor || '#FF0000';
  const channelInitial = channelInfo?.channelInitial || selectedChannel.charAt(0).toUpperCase();
  const subscribers = channelInfo?.subscribers || '0';

  const shortsVideos = useMemo(() => {
    return channelVideos.filter((v) => {
      const parts = v.duration.split(':');
      if (parts.length === 2) {
        const minutes = parseInt(parts[0], 10);
        return minutes === 0;
      }
      return false;
    });
  }, [channelVideos]);

  const liveVideos = useMemo(() => {
    return channelVideos.filter((v) => v.duration === 'LIVE');
  }, [channelVideos]);

  const displayVideos = useMemo(() => {
    switch (activeTab) {
      case 'Shorts':
        return shortsVideos.length > 0 ? shortsVideos : [];
      case 'Live':
        return liveVideos.length > 0 ? liveVideos : [];
      case 'Videos':
        return channelVideos;
      default:
        return channelVideos;
    }
  }, [activeTab, channelVideos, shortsVideos, liveVideos]);

  const tabs: ChannelTab[] = ['Home', 'Videos', 'Shorts', 'Live'];

  const bannerGradients: Record<string, string> = {
    '#FF0000': 'from-red-600 via-red-500 to-orange-400',
    '#FF4500': 'from-orange-600 via-orange-400 to-yellow-300',
    '#2196F3': 'from-blue-600 via-blue-400 to-cyan-300',
    '#4CAF50': 'from-green-600 via-green-400 to-emerald-300',
    '#FF9800': 'from-amber-600 via-amber-400 to-yellow-300',
    '#9C27B0': 'from-purple-700 via-purple-500 to-pink-400',
    '#00BCD4': 'from-cyan-600 via-cyan-400 to-teal-300',
    '#E91E63': 'from-pink-600 via-pink-400 to-rose-300',
    '#3F51B5': 'from-indigo-600 via-indigo-400 to-blue-300',
    '#009688': 'from-teal-600 via-teal-400 to-green-300',
    '#FF5722': 'from-red-700 via-orange-500 to-amber-400',
    '#607D8B': 'from-gray-600 via-gray-400 to-slate-300',
    '#795548': 'from-amber-800 via-amber-600 to-yellow-500',
    '#673AB7': 'from-violet-700 via-violet-500 to-purple-300',
    '#F44336': 'from-red-600 via-red-400 to-orange-300',
    '#8BC34A': 'from-lime-600 via-lime-400 to-green-300',
    '#CDDC39': 'from-lime-500 via-yellow-400 to-amber-300',
    '#FFEB3B': 'from-yellow-500 via-yellow-300 to-amber-200',
    '#FFC107': 'from-amber-500 via-amber-300 to-yellow-200',
    '#03A9F4': 'from-sky-600 via-sky-400 to-cyan-300',
  };

  const gradientClass = bannerGradients[channelColor] || 'from-red-600 via-rose-500 to-orange-400';

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Channel Banner */}
      <div className={`h-[150px] md:h-[200px] bg-gradient-to-r ${gradientClass} relative`}>
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Channel Info */}
      <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Avatar */}
          <div
            className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full flex items-center justify-center text-white font-bold text-3xl md:text-4xl shrink-0 -mt-12 sm:-mt-8 border-4 border-white dark:border-[#0f0f0f]"
            style={{ backgroundColor: channelColor }}
          >
            {channelInitial}
          </div>

          {/* Name & Stats */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {selectedChannel}
              </h1>
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
              <span>@{selectedChannel.toLowerCase().replace(/\s+/g, '')}</span>
              <span>•</span>
              <span>{subscribers} subscribers</span>
              <span>•</span>
              <span>{channelVideos.length} videos</span>
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

          {/* Subscribe button */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={() => setIsSubscribed(!isSubscribed)}
              variant="default"
              className={`rounded-full text-sm font-medium px-6 h-10 ${
                isSubscribed
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                  : 'bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
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
        {activeTab === 'Home' && (
          <>
            {/* Featured video */}
            {channelVideos.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Featured</h2>
                <div className="flex flex-col md:flex-row gap-4 bg-gray-50 dark:bg-[#272727] rounded-xl p-4">
                  <div className="md:w-[360px] shrink-0">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <img
                        src={channelVideos[0].thumbnail}
                        alt={channelVideos[0].title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-2">
                      {channelVideos[0].title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {channelVideos[0].views} • {channelVideos[0].publishedAt}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-3">
                      {channelVideos[0].description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* All videos grid */}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
              {channelVideos.map((video) => (
                <VideoCard key={video.id} video={video} layout="grid" />
              ))}
            </div>
          </>
        )}

        {activeTab === 'Videos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {channelVideos.map((video) => (
              <VideoCard key={video.id} video={video} layout="grid" />
            ))}
          </div>
        )}

        {activeTab === 'Shorts' && (
          <>
            {shortsVideos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {shortsVideos.map((video) => (
                  <VideoCard key={video.id} video={video} layout="shorts" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-20">
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No shorts available</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">This channel hasn&apos;t posted any shorts yet</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'Live' && (
          <>
            {liveVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                {liveVideos.map((video) => (
                  <VideoCard key={video.id} video={video} layout="grid" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-20">
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No live streams</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">This channel has no active or past live streams</p>
              </div>
            )}
          </>
        )}

        {channelVideos.length === 0 && (
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
