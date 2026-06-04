'use client';

import { useYouTubeStore } from '@/store/youtube-store';
import { getVideosByCategory } from '@/lib/youtube-data';
import VideoCard from './video-card';
import { useMemo, useState, useEffect } from 'react';

function VideoCardSkeleton() {
  return (
    <div className="animate-fade-in">
      {/* Thumbnail skeleton */}
      <div className="relative aspect-video rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gray-200 dark:bg-[#272727] animate-shimmer rounded-xl" />
        {/* Duration badge skeleton */}
        <div className="absolute bottom-1.5 right-1.5 w-10 h-4 bg-gray-300 dark:bg-[#3f3f3f] rounded animate-shimmer" />
      </div>
      {/* Info skeleton */}
      <div className="flex gap-3 mt-3">
        {/* Avatar skeleton */}
        <div className="shrink-0 w-9 h-9 rounded-full bg-gray-200 dark:bg-[#272727] animate-shimmer" />
        {/* Text skeletons */}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-[#272727] rounded animate-shimmer w-full" />
          <div className="h-4 bg-gray-200 dark:bg-[#272727] rounded animate-shimmer w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded animate-shimmer w-1/2" />
          <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded animate-shimmer w-1/3" />
        </div>
      </div>
    </div>
  );
}

function VideoGridSkeleton() {
  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`stagger-${Math.min(i + 1, 8)}`}>
            <VideoCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function VideoGrid() {
  const { selectedCategory } = useYouTubeStore();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const videos = useMemo(() => {
    return getVideosByCategory(selectedCategory);
  }, [selectedCategory]);

  // Initial load only
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return (
      <div className="page-transition">
        {selectedCategory !== 'All' && (
          <div className="p-4 md:p-6 pb-0">
            <div className="h-6 w-32 bg-gray-200 dark:bg-[#272727] rounded animate-shimmer" />
          </div>
        )}
        <VideoGridSkeleton />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 page-transition" key={selectedCategory}>
      {/* Category heading */}
      {selectedCategory !== 'All' && (
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 animate-fade-in">{selectedCategory}</h2>
      )}

      {/* Video grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {videos.map((video, index) => (
          <div key={video.id} className={`stagger-${Math.min((index % 8) + 1, 8)} animate-slide-up`}>
            <VideoCard video={video} layout="grid" />
          </div>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 animate-scale-in">
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
