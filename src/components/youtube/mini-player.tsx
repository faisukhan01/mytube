'use client';

import { useEffect, useState, useRef } from 'react';
import { useYouTubeStore } from '@/store/youtube-store';
import { X, Maximize2 } from 'lucide-react';

export default function MiniPlayer() {
  const { miniPlayerVideo, closeMiniPlayer, expandMiniPlayer } = useYouTubeStore();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Handle dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      setPosition((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!miniPlayerVideo) return null;

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <div
      className="fixed z-50 group animate-in slide-in-from-bottom-4 fade-in duration-300"
      style={{
        bottom: position.y !== 0 ? undefined : 16,
        right: position.x !== 0 ? undefined : 16,
        transform: position.x !== 0 || position.y !== 0
          ? `translate(${position.x}px, ${position.y}px)`
          : undefined,
      }}
    >
      <div
        className="w-[300px] bg-white dark:bg-[#212121] rounded-lg shadow-2xl overflow-hidden cursor-move border border-gray-200 dark:border-gray-700"
        onMouseDown={handleDragStart}
      >
        {/* Video embed */}
        <div className="relative w-full" style={{ height: '168px' }}>
          <iframe
            src={`https://www.youtube.com/embed/${miniPlayerVideo.id}?autoplay=1&rel=0`}
            title={miniPlayerVideo.title}
            className="w-full h-full pointer-events-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Info overlay */}
        <div className="p-2">
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                {miniPlayerVideo.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                {miniPlayerVideo.channelTitle}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  expandMiniPlayer();
                }}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] rounded-full transition-colors"
                aria-label="Expand player"
              >
                <Maximize2 className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeMiniPlayer();
                }}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] rounded-full transition-colors"
                aria-label="Close mini player"
              >
                <X className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
