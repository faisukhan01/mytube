'use client';

import { homeVideos } from '@/lib/youtube-data';
import VideoCard from './video-card';
import { Flame, TrendingUp } from 'lucide-react';

export default function TrendingView() {
  const trendingVideos = homeVideos.slice(0, 20);

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
          <Flame className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trending</h1>
          <p className="text-sm text-gray-600">See what&apos;s trending on YouTube right now</p>
        </div>
      </div>

      <div className="space-y-2">
        {trendingVideos.map((video, index) => (
          <div key={video.id} className="flex gap-4">
            <span className="text-2xl font-light text-gray-400 w-8 shrink-0 pt-1 text-right">
              {index + 1}
            </span>
            <div className="flex-1">
              <VideoCard video={video} layout="list" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
