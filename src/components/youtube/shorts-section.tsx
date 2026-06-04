'use client';

import { shortsVideos } from '@/lib/youtube-data';
import VideoCard from './video-card';

export default function ShortsSection() {
  return (
    <div className="p-4 md:p-6">
      {/* Shorts header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25z"/>
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Shorts</h2>
      </div>

      {/* Shorts grid */}
      <div className="flex gap-3 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
        {shortsVideos.map((video) => (
          <VideoCard key={video.id} video={video} layout="shorts" />
        ))}
      </div>
    </div>
  );
}
