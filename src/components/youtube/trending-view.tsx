'use client';

import { homeVideos } from '@/lib/youtube-data';
import VideoCard from './video-card';
import { Flame, Music, Gamepad2, Film } from 'lucide-react';
import { useState, useMemo } from 'react';

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

  const trendingVideos = useMemo(() => {
    if (activeTab === 'now') return homeVideos.slice(0, 20);
    if (activeTab === 'music') return homeVideos.filter(v => v.category === 'Music').slice(0, 20);
    if (activeTab === 'gaming') return homeVideos.filter(v => v.category === 'Gaming').slice(0, 20);
    if (activeTab === 'movies') return homeVideos.filter(v => v.category === 'Movies').slice(0, 20);
    return homeVideos.slice(0, 20);
  }, [activeTab]);

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
          <Flame className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trending</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">See what&apos;s trending on YouTube right now</p>
        </div>
      </div>

      {/* Trending tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-0">
        {trendingTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        {trendingVideos.map((video, index) => (
          <div key={video.id} className="flex gap-4">
            <span className="text-2xl font-light text-gray-400 dark:text-gray-500 w-8 shrink-0 pt-1 text-right">
              {index + 1}
            </span>
            <div className="flex-1 relative">
              <VideoCard video={video} layout="list" />
              {/* Category badge */}
              {video.category && categoryColors[video.category] && (
                <span className={`absolute top-3 right-10 text-[10px] font-medium px-1.5 py-0.5 rounded ${categoryColors[video.category]}`}>
                  {video.category}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
