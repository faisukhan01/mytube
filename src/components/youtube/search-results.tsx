'use client';

import { useYouTubeStore } from '@/store/youtube-store';
import { searchVideos, homeVideos } from '@/lib/youtube-data';
import VideoCard from './video-card';
import { Search, Filter, Clock, Eye, Play } from 'lucide-react';
import { useEffect, useMemo, useState, useCallback } from 'react';

function SearchResultSkeleton() {
  return (
    <div className="flex gap-4 py-3 px-2">
      {/* Thumbnail skeleton - larger */}
      <div className="relative shrink-0 w-[246px] h-[138px] rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gray-200 dark:bg-[#272727] animate-shimmer rounded-xl" />
        {/* Duration badge skeleton */}
        <div className="absolute bottom-2 right-2 w-12 h-5 bg-gray-300 dark:bg-[#3f3f3f] rounded animate-shimmer" />
        {/* Live badge skeleton */}
        <div className="absolute top-2 left-2 w-14 h-5 bg-gray-300 dark:bg-[#3f3f3f] rounded animate-shimmer" />
        {/* Progress bar skeleton */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300 dark:bg-[#3f3f3f]" />
        <div className="absolute bottom-0 left-0 h-1 w-2/3 bg-gray-400 dark:bg-[#555] animate-shimmer" />
      </div>
      {/* Info skeleton */}
      <div className="flex-1 space-y-2 py-1">
        <div className="h-5 bg-gray-200 dark:bg-[#272727] rounded animate-shimmer w-full" />
        <div className="h-5 bg-gray-200 dark:bg-[#272727] rounded animate-shimmer w-3/4" />
        <div className="flex items-center gap-2 mt-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#272727] animate-shimmer" />
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

// Search filter button options like real YouTube
const searchFilters = [
  { id: 'All', icon: Search },
  { id: 'Videos', icon: Play },
  { id: 'Channels', icon: Eye },
  { id: 'Playlists', icon: Clock },
];

export default function SearchResults() {
  const { searchQuery, searchResults, setSearchResults } = useYouTubeStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [error, setError] = useState<string | null>(null);

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

  // Generate "Search instead for" suggestion when results are limited
  const searchSuggestion = useMemo(() => {
    if (!searchQuery || results.length > 5) return null;
    // Simple suggestion by modifying the search query
    const words = searchQuery.split(' ');
    if (words.length > 1) {
      return words.slice(0, -1).join(' ');
    }
    // Try adding "video" or "official"
    if (!searchQuery.toLowerCase().includes('official')) {
      return `${searchQuery} official`;
    }
    return null;
  }, [searchQuery, results.length]);

  // Get channel results for the "Channels" filter
  const channelResults = useMemo(() => {
    const seen = new Set<string>();
    const channels: { name: string; color: string; initial: string; videoCount: number }[] = [];
    for (const v of searchResults) {
      if (!seen.has(v.channelTitle)) {
        seen.add(v.channelTitle);
        channels.push({
          name: v.channelTitle,
          color: v.channelColor,
          initial: v.channelInitial,
          videoCount: homeVideos.filter(hv => hv.channelTitle === v.channelTitle).length,
        });
      }
    }
    return channels;
  }, [searchResults]);

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto page-transition">
      {/* Search filter buttons - like real YouTube */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 transition-opacity duration-200" style={{ scrollbarWidth: 'none' }}>
        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors shrink-0">
          <Filter className="w-4 h-4" />
          Filters
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 shrink-0" />
        {searchFilters.map((filter) => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedFilter === filter.id
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
                  : 'bg-[#f2f2f2] dark:bg-[#272727] text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#3f3f3f]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {filter.id}
            </button>
          );
        })}
      </div>

      {/* "Did you mean" spelling correction */}
      {!isLoading && results.length > 0 && searchQuery && (
        <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          Showing results for <span className="font-medium text-gray-900 dark:text-white">{searchQuery}</span>
          {searchQuery.includes(' ') && (
            <>
              {' '}Did you mean{' '}
              <button
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                onClick={() => {
                  const { setSearchQuery } = useYouTubeStore.getState();
                  setSearchQuery(searchQuery.split(' ').slice(0, -1).join(' '));
                }}
              >
                {searchQuery.split(' ').slice(0, -1).join(' ')}
              </button>
              ?
            </>
          )}
        </div>
      )}

      {/* "Search instead for" suggestion */}
      {searchSuggestion && !isLoading && results.length > 0 && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Search instead for{' '}
          <button
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            onClick={() => {
              const { setSearchQuery } = useYouTubeStore.getState();
              setSearchQuery(searchSuggestion);
            }}
          >
            {searchSuggestion}
          </button>
        </div>
      )}

      {/* Loading state - enhanced skeletons matching search result layout */}
      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`stagger-${Math.min(i + 1, 8)} animate-fade-in`}>
              <SearchResultSkeleton />
            </div>
          ))}
          <div className="flex items-center justify-center py-4 gap-3">
            <div className="relative w-5 h-5">
              <div className="absolute inset-0 rounded-full border-2 border-gray-300 dark:border-gray-600" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-red-600 animate-spin" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Searching...</span>
          </div>
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

      {/* Channel results when "Channels" filter is selected */}
      {selectedFilter === 'Channels' && !isLoading && !error && channelResults.length > 0 && (
        <div className="space-y-3 mb-6">
          {channelResults.map((channel) => (
            <div key={channel.name} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272727] hover:shadow-sm transition-all duration-150 cursor-pointer">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: channel.color }}
              >
                {channel.initial}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">{channel.name}
                  <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </p>
                <p className="text-[12px] text-[#606060] dark:text-[#aaa]">{channel.videoCount} videos</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results - using list layout with larger thumbnails */}
      {!isLoading && !error && results.length > 0 && selectedFilter !== 'Channels' && (
        <div className="space-y-2">
          {results.map((video: { id: string }, index: number) => (
            <div key={`${video.id}-${index}`} className={`stagger-${Math.min((index % 8) + 1, 8)} animate-slide-up`}>
              <VideoCard video={video} layout="list" />
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {!isLoading && !error && results.length === 0 && searchQuery && selectedFilter !== 'Channels' && (
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
