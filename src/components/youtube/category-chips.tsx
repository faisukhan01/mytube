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
  const [animatingChip, setAnimatingChip] = useState<string | null>(null);

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

  const handleChipClick = (category: string) => {
    if (category !== selectedCategory) {
      setAnimatingChip(category);
      setSelectedCategory(category);
      // Remove animation class after it completes
      setTimeout(() => setAnimatingChip(null), 400);
    }
  };

  return (
    <div className="sticky top-14 z-30 bg-white dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-gray-800">
      <div className="relative flex items-center h-12">
        {/* Left arrow with enhanced gradient fade */}
        {showLeftArrow && (
          <div className="absolute left-0 z-10 flex items-center h-full bg-gradient-to-r from-white dark:from-[#0f0f0f] via-white/95 dark:via-[#0f0f0f]/95 to-transparent pr-8">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-full transition-all duration-200 active:scale-95 hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
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
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            const isAnimating = animatingChip === category;
            return (
              <button
                key={category}
                onClick={() => handleChipClick(category)}
                className={`shrink-0 px-3 rounded-full text-sm font-medium transition-all duration-200 h-8 flex items-center justify-center border ${
                  isActive
                    ? 'bg-[#0f0f0f] text-white dark:bg-white dark:text-black hover:bg-[#272727] dark:hover:bg-gray-200 shadow-sm border-[#0f0f0f] dark:border-white'
                    : 'bg-[#f2f2f2] text-[#0f0f0f] dark:bg-[#272727] dark:text-[#f1f1f1] hover:bg-[#e5e5e5] dark:hover:bg-[#3f3f3f] border-[#f2f2f2] dark:border-[#272727]'
                } ${isAnimating ? 'animate-bounce-in' : ''}`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Right arrow with enhanced gradient fade */}
        {showRightArrow && (
          <div className="absolute right-0 z-10 flex items-center h-full bg-gradient-to-l from-white dark:from-[#0f0f0f] via-white/95 dark:via-[#0f0f0f]/95 to-transparent pl-8">
            <button
              onClick={() => scroll('right')}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-full transition-all duration-200 active:scale-95 hover:scale-110"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
