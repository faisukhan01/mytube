'use client';

import { useYouTubeStore } from '@/store/youtube-store';
import { searchVideos } from '@/lib/youtube-data';
import VideoCard from './video-card';
import { Search, Filter } from 'lucide-react';
import { useEffect, useMemo, useState, useCallback } from 'react';

function SearchResultSkeleton() {
  return (
    <div className="flex gap-4 py-2 px-2">
      {/* Thumbnail skeleton */}
      <div className="relative shrink-0 w-[168px] h-[94px] rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gray-200 dark:bg-[#272727] animate-shimmer rounded-lg" />
        {/* Duration badge skeleton */}
        <div className="absolute bottom-1 right-1 w-10 h-4 bg-gray-300 dark:bg-[#3f3f3f] rounded animate-shimmer" />
        {/* Live badge skeleton */}
        <div className="absolute top-1 left-1 w-12 h-4 bg-gray-300 dark:bg-[#3f3f3f] rounded animate-shimmer" />
        {/* Progress bar skeleton */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300 dark:bg-[#3f3f3f]" />
        <div className="absolute bottom-0 left-0 h-1 w-2/3 bg-gray-400 dark:bg-[#555] animate-shimmer" />
      </div>
      {/* Info skeleton */}
      <div className="flex-1 space-y-2 py-0.5">
        <div className="h-4 bg-gray-200 dark:bg-[#272727] rounded animate-shimmer w-full" />
        <div className="h-4 bg-gray-200 dark:bg-[#272727] rounded animate-shimmer w-3/4" />
        <div className="flex items-center gap-2 mt-2">
          <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-[#272727] animate-shimmer" />
          <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded animate-shimmer w-1/3" />
        </div>
        <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded animate-shimmer w-1/2" />
        <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded animate-shimmer w-2/3" />
      </div>
      {/* Menu skeleton */}
      <div className="shrink-0 w-6 h-6 rounded-full bg-gray-200 dark:bg-[#272727] animate-shimmer self-center" />
    </div>
  );
}

export default function SearchResults() {
  const { searchQuery, searchResults, setSearchResults } = useYouTubeStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [error, setError] = useState<string | null>(null);

  const filters = ['All', 'Videos', 'Channels', 'Playlists', 'Live'];

  const performSearch = useCallback(async (query: string) => {
    if (!query) return;
    setIsLoading(true);
    setError(null);
    try {
      // Try the API first
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      if (data.videos && data.videos.length > 0) {
        setSearchResults(data.videos);
      } else {
        // Fallback to local search
        const localResults = searchVideos(query);
        setSearchResults(localResults);
      }
    } catch {
      // Fallback to local search
      try {
        const localResults = searchVideos(query);
        setSearchResults(localResults);
      } catch {
        setError('Something went wrong. Please try again.');
        setSearchResults([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [setSearchResults]);

  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    }
  }, [searchQuery, performSearch]);

  const results = useMemo(() => {
    // Deduplicate by video ID to prevent React key warnings
    const seen = new Set<string>();
    const deduped = searchResults.filter((v: { id: string }) => {
      if (seen.has(v.id)) return false;
      seen.add(v.id);
      return true;
    });
    if (selectedFilter === 'Live') {
      return deduped.filter((v: { duration: string }) => v.duration === 'LIVE');
    }
    if (selectedFilter === 'Videos') {
      return deduped.filter((v: { duration: string }) => v.duration !== 'LIVE');
    }
    return deduped;
  }, [searchResults, selectedFilter]);

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto page-transition">
      {/* Search header */}
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedFilter === filter
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
                  : 'bg-gray-100 dark:bg-[#272727] text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#3f3f3f]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state - enhanced skeletons */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`stagger-${Math.min(i + 1, 8)} animate-fade-in`}>
              <SearchResultSkeleton />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 animate-scale-in">
          <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <Search className="w-12 h-12 text-red-400 dark:text-red-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Search error</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{error}</p>
          <button
            onClick={() => performSearch(searchQuery)}
            className="mt-4 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {/* Results */}
      {!isLoading && !error && results.length > 0 && (
        <div className="space-y-2">
          {results.map((video: { id: string }, index: number) => (
            <div key={`${video.id}-${index}`} className={`stagger-${Math.min((index % 8) + 1, 8)} animate-slide-up`}>
              <VideoCard video={video} layout="list" />
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {!isLoading && !error && results.length === 0 && searchQuery && (
        <div className="flex flex-col items-center justify-center py-20 animate-scale-in">
          <div className="w-24 h-24 bg-gray-100 dark:bg-[#272727] rounded-full flex items-center justify-center mb-4">
            <Search className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">No results found</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Try different keywords or remove search filter
          </p>
        </div>
      )}
    </div>
  );
}
