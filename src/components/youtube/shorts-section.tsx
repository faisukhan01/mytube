'use client';

import { shortsVideos } from '@/lib/youtube-data';
import { useYouTubeStore } from '@/store/youtube-store';
import { ChevronRight } from 'lucide-react';

export default function ShortsSection() {
  const { setCurrentView } = useYouTubeStore();

  return (
    <div className="p-4 md:p-6">
      {/* Shorts header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-500 rounded-md flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Shorts</h2>
        </div>
        <button
          onClick={() => setCurrentView('shorts')}
          className="flex items-center gap-0.5 text-sm font-medium text-[#065fd4] dark:text-[#3ea6ff] hover:text-[#0556bf] dark:hover:text-[#7fc3ff] transition-colors"
        >
          Show more
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Shorts grid - each short is clickable via VideoCard */}
      <div className="flex gap-3 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
        {shortsVideos.map((video) => (
          <div key={video.id} className="shrink-0 w-[180px] group/short">
            <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer transition-all duration-300 group-hover/short:scale-[1.02] group-hover/short:brightness-95 dark:group-hover/short:brightness-110">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src.includes('maxresdefault.jpg')) {
                    target.src = target.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                  } else if (target.src.includes('hqdefault.jpg')) {
                    target.src = target.src.replace('hqdefault.jpg', 'mqdefault.jpg');
                  } else {
                    target.style.display = 'none';
                  }
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="text-white text-xs font-medium line-clamp-2">{video.title}</p>
                <p className="text-gray-300 text-[11px] mt-0.5">{video.views}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
