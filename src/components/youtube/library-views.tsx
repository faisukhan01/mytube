'use client';

import { useYouTubeStore } from '@/store/youtube-store';
import { homeVideos } from '@/lib/youtube-data';
import VideoCard from './video-card';
import { Clock, ThumbsUp, ListVideo } from 'lucide-react';

export function HistoryView() {
  const { watchHistory } = useYouTubeStore();
  const historyVideos = watchHistory
    .map(id => homeVideos.find(v => v.id === id))
    .filter(Boolean);

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-7 h-7 text-gray-700" />
        <h1 className="text-2xl font-bold text-gray-900">Watch history</h1>
      </div>

      {historyVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {historyVideos.map((video) => video && (
            <VideoCard key={video.id} video={video} layout="grid" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-20">
          <Clock className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-600 text-lg font-medium">No watch history</p>
          <p className="text-gray-500 text-sm mt-1">Videos you watch will show up here</p>
        </div>
      )}
    </div>
  );
}

export function LikedView() {
  const { likedVideos } = useYouTubeStore();
  const liked = likedVideos
    .map(id => homeVideos.find(v => v.id === id))
    .filter(Boolean);

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <ThumbsUp className="w-7 h-7 text-gray-700" />
        <h1 className="text-2xl font-bold text-gray-900">Liked videos</h1>
      </div>

      {liked.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {liked.map((video) => video && (
            <VideoCard key={video.id} video={video} layout="grid" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-20">
          <ThumbsUp className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-600 text-lg font-medium">No liked videos</p>
          <p className="text-gray-500 text-sm mt-1">Use the 👍 button to like videos</p>
        </div>
      )}
    </div>
  );
}

export function WatchLaterView() {
  const { watchLater } = useYouTubeStore();
  const videos = watchLater
    .map(id => homeVideos.find(v => v.id === id))
    .filter(Boolean);

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <ListVideo className="w-7 h-7 text-gray-700" />
        <h1 className="text-2xl font-bold text-gray-900">Watch later</h1>
      </div>

      {videos.length > 0 ? (
        <div className="space-y-2">
          {videos.map((video) => video && (
            <VideoCard key={video.id} video={video} layout="list" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-20">
          <ListVideo className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-600 text-lg font-medium">No videos in Watch later</p>
          <p className="text-gray-500 text-sm mt-1">Save videos to watch later</p>
        </div>
      )}
    </div>
  );
}

export function SubscriptionsView() {
  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Subscriptions</h1>
      <div className="flex flex-col items-center py-20">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <ListVideo className="w-12 h-12 text-gray-400" />
        </div>
        <p className="text-gray-600 text-lg font-medium">Channels you subscribe to will show up here</p>
        <p className="text-gray-500 text-sm mt-1">Subscribe to your favorite channels</p>
      </div>
    </div>
  );
}
