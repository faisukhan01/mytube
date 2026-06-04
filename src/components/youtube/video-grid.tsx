'use client';

import { useYouTubeStore } from '@/store/youtube-store';
import { getVideosByCategory } from '@/lib/youtube-data';
import VideoCard from './video-card';
import { useMemo } from 'react';

export default function VideoGrid() {
  const { selectedCategory } = useYouTubeStore();

  const videos = useMemo(() => {
    return getVideosByCategory(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="p-4 md:p-6">
      {/* Category heading */}
      {selectedCategory !== 'All' && (
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{selectedCategory}</h2>
      )}

      {/* Video grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} layout="grid" />
        ))}
      </div>

      {videos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 bg-gray-100 dark:bg-[#272727] rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">No videos found in this category</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
}
