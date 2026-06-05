'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useYouTubeStore } from '@/store/youtube-store';
import { homeVideos } from '@/lib/youtube-data';

interface ChannelInfo {
  channelTitle: string;
  channelInitial: string;
  channelColor: string;
  channelId: string;
}

export default function ChannelStories() {
  const { openChannel, user, selectedCategory, currentView } = useYouTubeStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Extract unique channels from homeVideos
  const channels = useMemo(() => {
    const seen = new Set<string>();
    const unique: ChannelInfo[] = [];
    for (const video of homeVideos) {
      if (!seen.has(video.channelTitle) && video.channelTitle) {
        seen.add(video.channelTitle);
        unique.push({
          channelTitle: video.channelTitle,
          channelInitial: video.channelInitial,
          channelColor: video.channelColor,
          channelId: video.channelId,
        });
      }
    }
    return unique.slice(0, 18); // Show about 18 channels
  }, []);

  // Randomly assign "new content" ring to some channels (simulated)
  const newContentChannels = useMemo(() => {
    const set = new Set<string>();
    // Mark ~40% of channels as having new content
    channels.forEach((ch, i) => {
      if (i % 3 === 1 || i % 5 === 0) {
        set.add(ch.channelTitle);
      }
    });
    return set;
  }, [channels]);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 400;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(checkScroll, 350);
  };

  const handleChannelClick = (channelTitle: string) => {
    openChannel(channelTitle);
  };

  // Only show on home view when 'All' category is selected
  if (currentView !== 'home' || selectedCategory !== 'All') {
    return null;
  }

  return (
    <div className="py-4 mb-2 border-b border-gray-200 dark:border-gray-800">
      <div className="relative">
        {/* Left arrow - hidden on mobile, visible on desktop */}
        {showLeftArrow && (
          <div className="hidden md:flex absolute left-0 z-10 items-center h-full bg-gradient-to-r from-white dark:from-[#0f0f0f] via-white/95 dark:via-[#0f0f0f]/95 to-transparent pr-6">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-full transition-all duration-200 active:scale-95"
              aria-label="Scroll stories left"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        )}

        {/* Stories container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex items-start gap-3 sm:gap-4 overflow-x-auto px-4 md:px-6 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* "Your story" / Create story item */}
          <button
            className="flex flex-col items-center gap-1.5 shrink-0 w-[72px] sm:w-[80px] group"
            onClick={() => {
              if (!user) {
                useYouTubeStore.getState().setShowAuthDialog(true);
              }
            }}
          >
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              {user ? (
                <>
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center text-white font-medium text-lg"
                    style={{ backgroundColor: user.color || '#FF0000' }}
                  >
                    {user.initials || user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white dark:border-[#0f0f0f]">
                    <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full h-full rounded-full bg-gray-200 dark:bg-[#272727] flex items-center justify-center">
                    <Plus className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  </div>
                </>
              )}
            </div>
            <span className="text-[11px] sm:text-[12px] text-gray-700 dark:text-gray-300 line-clamp-1 text-center w-full">
              {user ? 'Your story' : 'Create'}
            </span>
          </button>

          {/* Channel story items */}
          {channels.map((channel) => {
            const hasNewContent = newContentChannels.has(channel.channelTitle);
            return (
              <button
                key={channel.channelId}
                className="flex flex-col items-center gap-1.5 shrink-0 w-[72px] sm:w-[80px] group"
                onClick={() => handleChannelClick(channel.channelTitle)}
              >
                {/* Avatar with ring */}
                <div className="transition-transform duration-200 group-hover:scale-105">
                  {hasNewContent ? (
                    /* New content ring - gradient from red-500 to orange-500 */
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[3px] bg-gradient-to-br from-red-500 to-orange-500">
                      <div
                        className="w-full h-full rounded-full flex items-center justify-center text-white font-medium text-base sm:text-lg border-2 border-white dark:border-[#0f0f0f]"
                        style={{ backgroundColor: channel.channelColor }}
                      >
                        {channel.channelInitial}
                      </div>
                    </div>
                  ) : (
                    /* Normal ring */
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2px] border-2 border-gray-200 dark:border-gray-700">
                      <div
                        className="w-full h-full rounded-full flex items-center justify-center text-white font-medium text-base sm:text-lg"
                        style={{ backgroundColor: channel.channelColor }}
                      >
                        {channel.channelInitial}
                      </div>
                    </div>
                  )}
                </div>
                {/* Channel name */}
                <span className="text-[11px] sm:text-[12px] text-gray-700 dark:text-gray-300 line-clamp-1 text-center w-full">
                  {channel.channelTitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right arrow - hidden on mobile, visible on desktop */}
        {showRightArrow && (
          <div className="hidden md:flex absolute right-0 z-10 items-center h-full bg-gradient-to-l from-white dark:from-[#0f0f0f] via-white/95 dark:via-[#0f0f0f]/95 to-transparent pl-6">
            <button
              onClick={() => scroll('right')}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-full transition-all duration-200 active:scale-95"
              aria-label="Scroll stories right"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
