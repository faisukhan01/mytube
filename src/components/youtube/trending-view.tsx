'use client';

import { homeVideos } from '@/lib/youtube-data';
import { useYouTubeStore } from '@/store/youtube-store';
import { Flame, Music, Gamepad2, Film, Play, Clock, ListPlus, MoreVertical } from 'lucide-react';
import { useState, useMemo } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const trendingTabs = [
  { id: 'now', label: 'Now', icon: Flame },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'movies', label: 'Movies', icon: Film },
];

const categoryColors: Record<string, string> = {
  Music: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Gaming: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Programming: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Science: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  Cooking: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Sports: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Entertainment: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  Comedy: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  News: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  Podcasts: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  Live: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Movies: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Fitness: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
  Fashion: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-400',
  Travel: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  Learning: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
};

export default function TrendingView() {
  const [activeTab, setActiveTab] = useState('now');
  const { openVideo, openChannel, toggleWatchLater, watchLater } = useYouTubeStore();

  const trendingVideos = useMemo(() => {
    if (activeTab === 'now') return homeVideos.slice(0, 20);
    if (activeTab === 'music') return homeVideos.filter(v => v.category === 'Music').slice(0, 20);
    if (activeTab === 'gaming') return homeVideos.filter(v => v.category === 'Gaming').slice(0, 20);
    if (activeTab === 'movies') return homeVideos.filter(v => v.category === 'Movies').slice(0, 20);
    return homeVideos.slice(0, 20);
  }, [activeTab]);

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      {/* Trending header with flame icon and description */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
          <Flame className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trending</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">See what&apos;s trending on YouTube right now</p>
        </div>
      </div>

      {/* Trending tabs with underline indicator */}
      <div className="relative mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          {trendingTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {/* Underline indicator */}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[3px] bg-gray-900 dark:bg-white rounded-full animate-underline-slide" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trending video list */}
      <div className="space-y-1">
        {trendingVideos.map((video, index) => {
          const isWatchLater = watchLater.includes(video.id);
          return (
            <div
              key={video.id}
              className="flex gap-4 items-start group rounded-lg hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors duration-150 px-2 py-2 cursor-pointer border-l-2 border-transparent hover:border-[#ff0000]"
              onClick={() => openVideo(video)}
            >
              {/* Large ranking number */}
              <span className="text-lg font-bold text-[#ff0000] w-8 shrink-0 pt-3 text-right select-none">
                {index + 1}
              </span>

              {/* Thumbnail */}
              <div className="relative shrink-0 w-[168px] h-[94px] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                {video.duration !== 'LIVE' ? (
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[12px] font-medium px-1 py-0.5 rounded-[4px]">
                    {video.duration}
                  </span>
                ) : (
                  <span className="absolute top-1 left-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
                  </span>
                )}
              </div>

              {/* Video info with channel avatar */}
              <div className="flex-1 min-w-0 py-0.5">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-5">
                  {video.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {/* Channel avatar */}
                  <button
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white font-medium text-[9px] transition-transform duration-200 hover:scale-110"
                    style={{ backgroundColor: video.channelColor }}
                    onClick={(e) => { e.stopPropagation(); openChannel(video.channelTitle); }}
                    aria-label={`Go to ${video.channelTitle} channel`}
                  >
                    {video.channelInitial}
                  </button>
                  <p
                    className="text-[12px] text-[#606060] dark:text-[#aaa] hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer transition-colors"
                    onClick={(e) => { e.stopPropagation(); openChannel(video.channelTitle); }}
                  >
                    {video.channelTitle}
                  </p>
                </div>
                <p className="text-[12px] text-[#606060] dark:text-[#aaa]">
                  {video.views} • {video.publishedAt}
                </p>
              </div>

              {/* Category badge + Menu */}
              <div className="flex items-center gap-2 shrink-0 pt-1">
                {video.category && categoryColors[video.category] && (
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${categoryColors[video.category]}`}>
                    {video.category}
                  </span>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openVideo(video); }}>
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchLater(video.id);
                      toast.success(isWatchLater ? 'Removed from Watch later' : 'Added to Watch later');
                    }}>
                      <Clock className="w-4 h-4 mr-2" />
                      {isWatchLater ? '✓ Remove from Watch later' : 'Add to Watch later'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.success(`"${video.title}" added to queue`); }}>
                      <ListPlus className="w-4 h-4 mr-2" />
                      Add to queue
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
