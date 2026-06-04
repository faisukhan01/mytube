'use client';

import { useYouTubeStore } from '@/store/youtube-store';
import { categories } from '@/lib/youtube-data';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

export default function CategoryChips() {
  const { selectedCategory, setSelectedCategory } = useYouTubeStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

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
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(checkScroll, 300);
  };

  return (
    <div className="sticky top-14 z-30 bg-white dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-gray-700">
      <div className="relative flex items-center h-12">
        {/* Left arrow */}
        {showLeftArrow && (
          <div className="absolute left-0 z-10 flex items-center h-full bg-gradient-to-r from-white dark:from-[#0f0f0f] via-white dark:via-[#0f0f0f] to-transparent pr-6">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#272727] rounded-full"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        )}

        {/* Chips container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex items-center gap-3 overflow-x-auto px-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
                  : 'bg-gray-100 dark:bg-[#272727] text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#3f3f3f]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Right arrow */}
        {showRightArrow && (
          <div className="absolute right-0 z-10 flex items-center h-full bg-gradient-to-l from-white dark:from-[#0f0f0f] via-white dark:via-[#0f0f0f] to-transparent pl-6">
            <button
              onClick={() => scroll('right')}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#272727] rounded-full"
            >
              <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
