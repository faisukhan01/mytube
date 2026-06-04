'use client';

import { useYouTubeStore } from '@/store/youtube-store';
import { searchVideos } from '@/lib/youtube-data';
import VideoCard from './video-card';
import { Search, Filter } from 'lucide-react';
import { useEffect, useMemo, useState, useCallback } from 'react';

export default function SearchResults() {
  const { searchQuery, searchResults, setSearchResults } = useYouTubeStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Videos', 'Channels', 'Playlists', 'Live'];

  const performSearch = useCallback(async (query: string) => {
    if (!query) return;
    setIsLoading(true);
    try {
      // Try the API first
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`);
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
      const localResults = searchVideos(query);
      setSearchResults(localResults);
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
    if (selectedFilter === 'Live') {
      return searchResults.filter((v: { duration: string }) => v.duration === 'LIVE');
    }
    return searchResults;
  }, [searchResults, selectedFilter]);

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      {/* Search header */}
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === filter
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                  : 'bg-gray-100 dark:bg-[#272727] text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#3f3f3f]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-[168px] h-[94px] bg-gray-200 dark:bg-[#272727] rounded-lg" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-200 dark:bg-[#272727] rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded w-1/2" />
                <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {!isLoading && results.length > 0 && (
        <div className="space-y-2">
          {results.map((video: { id: string }) => (
            <VideoCard key={video.id} video={video} layout="list" />
          ))}
        </div>
      )}

      {/* No results */}
      {!isLoading && results.length === 0 && searchQuery && (
        <div className="flex flex-col items-center justify-center py-20">
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
