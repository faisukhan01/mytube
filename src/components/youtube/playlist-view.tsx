'use client';

import { useYouTubeStore } from '@/store/youtube-store';
import { getVideoById } from '@/lib/youtube-data';
import VideoCard from './video-card';
import {
  Play,
  Shuffle,
  ArrowLeft,
  ListVideo,
  Trash2,
  X,
  Globe,
  Link2,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function PlaylistView() {
  const { playlists, selectedPlaylistId, openVideo, removeFromPlaylist, deletePlaylist, setCurrentView } = useYouTubeStore();

  const playlist = playlists.find((p) => p.id === selectedPlaylistId);

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ListVideo className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">Playlist not found</p>
        <Button
          variant="outline"
          className="mt-4 rounded-full"
          onClick={() => setCurrentView('home')}
        >
          Go Home
        </Button>
      </div>
    );
  }

  const videos = playlist.videos
    .map((videoId) => getVideoById(videoId))
    .filter((v): v is NonNullable<typeof v> => v !== undefined);

  const handlePlayAll = () => {
    if (videos.length > 0) {
      openVideo(videos[0]);
    }
  };

  const handleShuffle = () => {
    if (videos.length > 0) {
      const randomIndex = Math.floor(Math.random() * videos.length);
      openVideo(videos[randomIndex]);
    }
  };

  const handleRemoveVideo = (videoId: string) => {
    removeFromPlaylist(playlist.id, videoId);
    toast.success('Removed from playlist');
  };

  const handleDeletePlaylist = () => {
    deletePlaylist(playlist.id);
    setCurrentView('home');
    toast.success('Playlist deleted');
  };

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case 'public': return 'Public';
      case 'unlisted': return 'Unlisted';
      case 'private': return 'Private';
      default: return 'Private';
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public': return <Globe className="w-3.5 h-3.5" />;
      case 'unlisted': return <Link2 className="w-3.5 h-3.5" />;
      case 'private': return <Lock className="w-3.5 h-3.5" />;
      default: return <Lock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-6">
      {/* Back button */}
      <button
        onClick={() => setCurrentView('home')}
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Playlist banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 md:p-8 text-white mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnail grid */}
          <div className="w-[200px] h-[112px] bg-black/30 rounded-lg overflow-hidden shrink-0 grid grid-cols-2 grid-rows-2 gap-0.5">
            {videos.slice(0, 4).map((video) => (
              <img
                key={video.id}
                src={video.thumbnail}
                alt=""
                className="w-full h-full object-cover"
              />
            ))}
            {videos.length === 0 && (
              <div className="col-span-2 row-span-2 flex items-center justify-center">
                <ListVideo className="w-8 h-8 text-white/50" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {getVisibilityIcon(playlist.visibility)}
              <span className="text-xs text-white/80">{getVisibilityLabel(playlist.visibility)}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{playlist.name}</h1>
            {playlist.description && (
              <p className="text-sm text-white/80 mb-3 line-clamp-2">{playlist.description}</p>
            )}
            <div className="flex items-center gap-3 text-sm text-white/80">
              <span>{playlist.videos.length} {playlist.videos.length === 1 ? 'video' : 'videos'}</span>
              <span>•</span>
              <span>Created {new Date(playlist.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <Button
                onClick={handlePlayAll}
                disabled={videos.length === 0}
                className="rounded-full bg-white text-red-700 hover:bg-white/90 font-medium"
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                Play all
              </Button>
              <Button
                onClick={handleShuffle}
                disabled={videos.length === 0}
                variant="outline"
                className="rounded-full border-white/30 text-white hover:bg-white/10"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Shuffle
              </Button>
              <Button
                onClick={handleDeletePlaylist}
                variant="outline"
                className="rounded-full border-white/30 text-white hover:bg-white/10 hover:border-red-400"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video list */}
      {videos.length === 0 ? (
        <div className="flex flex-col items-center py-12">
          <ListVideo className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">No videos in this playlist</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Add videos to this playlist by saving them from the video player
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272727] group cursor-pointer transition-colors"
              onClick={() => openVideo(video)}
            >
              {/* Index number */}
              <span className="w-6 text-center text-sm text-gray-500 dark:text-gray-400 shrink-0">
                {index + 1}
              </span>

              {/* Thumbnail */}
              <div className="relative w-[160px] shrink-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full aspect-video object-cover rounded"
                />
                <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded">
                  {video.duration}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {video.channelTitle}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {video.views} • {video.publishedAt}
                </p>
              </div>

              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveVideo(video.id);
                }}
                className="p-2 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-full transition-all shrink-0"
                aria-label="Remove from playlist"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
