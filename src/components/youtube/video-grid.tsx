'use client';

import { useYouTubeStore } from '@/store/youtube-store';
import { getVideosByCategory } from '@/lib/youtube-data';
import type { Video } from '@/lib/youtube-data';
import VideoCard from './video-card';
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={`stagger-${Math.min(i + 1, 8)}`}>
          <VideoCardSkeleton />
        </div>
      ))}
    </div>
  );
}

// Category labels for dynamic fetching section headers
const dynamicCategoryLabels: Record<string, string> = {
  'Music': 'Trending Music Videos',
  'Gaming': 'Popular Gaming Videos',
  'Programming': 'Latest Programming Tutorials',
  'Science': 'Popular Science Videos',
  'Cooking': 'Trending Cooking Videos',
  'Sports': 'Sports Highlights',
  'Entertainment': 'Trending Entertainment',
  'Comedy': 'Popular Comedy Videos',
  'News': 'Latest News Videos',
  'Podcasts': 'Trending Podcasts',
  'Live': 'Live Now',
  'Movies': 'Movie Trailers',
  'Fashion': 'Fashion & Beauty',
  'Fitness': 'Fitness & Workouts',
  'Learning': 'Educational Videos',
  'Travel': 'Travel Vlogs',
  'Recently uploaded': 'Newly Uploaded',
};

export default function VideoGrid() {
  const { selectedCategory } = useYouTubeStore();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Dynamic videos from discover API
  const [dynamicVideos, setDynamicVideos] = useState<Video[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingDynamic, setIsLoadingDynamic] = useState(false);
  const [hasMoreDynamic, setHasMoreDynamic] = useState(true);
  const [dynamicPage, setDynamicPage] = useState(0);
  const [dynamicError, setDynamicError] = useState<string | null>(null);

  // Ref for intersection observer
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Local hardcoded videos
  const localVideos = useMemo(() => {
    return getVideosByCategory(selectedCategory);
  }, [selectedCategory]);

  // Combine local + dynamic videos (deduplicated)
  const allVideos = useMemo(() => {
    const seen = new Set<string>();
    const combined: Video[] = [];

    for (const v of localVideos) {
      if (!seen.has(v.id)) {
        seen.add(v.id);
        combined.push(v);
      }
    }
    for (const v of dynamicVideos) {
      if (!seen.has(v.id)) {
        seen.add(v.id);
        combined.push(v);
      }
    }
    return combined;
  }, [localVideos, dynamicVideos]);

  // Fetch dynamic videos for a category
  const fetchDynamicVideos = useCallback(async (category: string, page: number) => {
    if (!category || category === 'All') return;

    setIsLoadingDynamic(true);
    setDynamicError(null);

    try {
      const res = await fetch(
        `/api/youtube/discover?category=${encodeURIComponent(category)}&limit=20`
      );
      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      if (data.videos && data.videos.length > 0) {
        setDynamicVideos((prev) => {
          // Deduplicate
          const seen = new Set(prev.map((v) => v.id));
          const newVideos = data.videos.filter((v: Video) => !seen.has(v.id));
          return [...prev, ...newVideos];
        });
        setHasMoreDynamic(data.videos.length >= 10);
      } else {
        setHasMoreDynamic(false);
      }
    } catch {
      setDynamicError('Could not load more videos');
      setHasMoreDynamic(false);
    } finally {
      setIsLoadingDynamic(false);
    }
  }, []);

  // Load more dynamic videos
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMoreDynamic || selectedCategory === 'All') return;

    setIsLoadingMore(true);
    setDynamicError(null);

    try {
      const nextPage = dynamicPage + 1;
      const res = await fetch(
        `/api/youtube/discover?category=${encodeURIComponent(selectedCategory)}&limit=20`
      );
      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      if (data.videos && data.videos.length > 0) {
        setDynamicVideos((prev) => {
          const seen = new Set(prev.map((v) => v.id));
          const newVideos = data.videos.filter((v: Video) => !seen.has(v.id));
          return [...prev, ...newVideos];
        });
        setDynamicPage(nextPage);
        setHasMoreDynamic(data.videos.length >= 5);
      } else {
        setHasMoreDynamic(false);
      }
    } catch {
      setDynamicError('Could not load more videos');
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMoreDynamic, selectedCategory, dynamicPage]);

  // Reset dynamic videos when category changes
  useEffect(() => {
    setDynamicVideos([]);
    setDynamicPage(0);
    setHasMoreDynamic(true);
    setDynamicError(null);
  }, [selectedCategory]);

  // Fetch dynamic videos for category (not "All")
  useEffect(() => {
    if (selectedCategory !== 'All') {
      fetchDynamicVideos(selectedCategory, 0);
    }
  }, [selectedCategory, fetchDynamicVideos]);

  // Initial load only
  useEffect(() => {
    setIsInitialLoading(true);
    const timer = setTimeout(() => setIsInitialLoading(false), 600);
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  // IntersectionObserver for auto-loading when scrolling to bottom
  useEffect(() => {
    if (!loadMoreRef.current || selectedCategory === 'All') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreDynamic && !isLoadingMore) {
          loadMore();
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMoreDynamic, isLoadingMore, loadMore, selectedCategory]);

  if (isInitialLoading) {
    return (
      <div className="page-transition">
        {selectedCategory !== 'All' && (
          <div className="p-4 md:p-6 pb-0">
            <div className="h-6 w-32 bg-gray-200 dark:bg-[#272727] rounded animate-shimmer" />
          </div>
        )}
        <div className="p-4 md:p-6">
          <VideoGridSkeleton />
        </div>
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
        {allVideos.map((video, index) => (
          <div key={`${video.id}-${index}`} className={`stagger-${Math.min((index % 8) + 1, 8)} animate-slide-up`}>
            <VideoCard video={video} layout="grid" />
          </div>
        ))}
      </div>

      {/* Dynamic loading indicator (loading new category videos) */}
      {isLoadingDynamic && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Loading more {dynamicCategoryLabels[selectedCategory] || 'videos'}...
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`dyn-skel-${i}`} className={`stagger-${Math.min(i + 1, 8)}`}>
                <VideoCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Load More section with IntersectionObserver sentinel */}
      {selectedCategory !== 'All' && allVideos.length > 0 && (
        <div className="mt-8 flex flex-col items-center gap-4">
          {/* Error message */}
          {dynamicError && (
            <p className="text-sm text-red-500 dark:text-red-400">{dynamicError}</p>
          )}

          {/* Load More button */}
          {hasMoreDynamic && !isLoadingDynamic && (
            <Button
              variant="outline"
              onClick={loadMore}
              disabled={isLoadingMore}
              className="flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#272727] transition-all duration-200"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Load more
                </>
              )}
            </Button>
          )}

          {/* No more results indicator */}
          {!hasMoreDynamic && !isLoadingDynamic && dynamicVideos.length > 0 && (
            <p className="text-sm text-gray-400 dark:text-gray-500 py-4">
              No more videos to load
            </p>
          )}

          {/* Intersection observer sentinel element */}
          <div ref={loadMoreRef} className="h-4 w-full" aria-hidden="true" />
        </div>
      )}

      {/* Empty state */}
      {allVideos.length === 0 && !isLoadingDynamic && (
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
