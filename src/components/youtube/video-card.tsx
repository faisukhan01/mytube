'use client';

import { Video, shortsVideos } from '@/lib/youtube-data';
import { useYouTubeStore } from '@/store/youtube-store';
import { MoreVertical, Play, Clock, ListPlus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

interface VideoCardProps {
  video: Video;
  layout?: 'grid' | 'list' | 'shorts';
}

function FallbackThumbnail({ color, initial }: { color: string; initial: string }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ backgroundColor: color + '22' }}
    >
      <div className="flex flex-col items-center gap-1">
        <Play className="w-8 h-8" style={{ color }} />
        <span className="text-xs font-medium" style={{ color }}>
          {initial}
        </span>
      </div>
    </div>
  );
}

export default function VideoCard({ video, layout = 'grid' }: VideoCardProps) {
  const { openVideo, openShort, toggleWatchLater, toggleLike, watchLater, likedVideos, openChannel } = useYouTubeStore();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isWatchLater = watchLater.includes(video.id);
  const isLiked = likedVideos.includes(video.id);

  // Random watched progress (persisted in state per card)
  const [watchedProgress] = useState(() => Math.random() < 0.3 ? Math.floor(Math.random() * 80) + 10 : 0);

  const handleMouseEnter = () => {
    setIsHovered(true);
    hoverTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 600);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowTooltip(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handleChannelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openChannel(video.channelTitle);
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success(`"${video.title}" added to queue`);
  };

  const handleWatchLater = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWatchLater(video.id);
    if (!isWatchLater) {
      toast.success('Added to Watch later');
    } else {
      toast.info('Removed from Watch later');
    }
  };

  const handleShortClick = () => {
    const index = shortsVideos.findIndex((v) => v.id === video.id);
    if (index >= 0) {
      openShort(index);
    } else {
      openVideo(video);
    }
  };

  if (layout === 'shorts') {
    return (
      <div
        className="cursor-pointer group shrink-0 w-[170px] sm:w-[190px]"
        onClick={handleShortClick}
      >
        <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
          {!imageError ? (
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <FallbackThumbnail color={video.channelColor} initial={video.channelInitial} />
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <p className="text-white text-xs font-medium line-clamp-2">{video.title}</p>
            <p className="text-gray-300 text-[11px] mt-0.5">{video.views}</p>
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'list') {
    return (
      <div
        className="flex gap-4 cursor-pointer group py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors px-2"
        onClick={() => openVideo(video)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Thumbnail */}
        <div className="relative shrink-0 w-[168px] h-[94px] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          {!imageError ? (
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <FallbackThumbnail color={video.channelColor} initial={video.channelInitial} />
          )}
          <span className={`absolute bottom-1 right-1 bg-black/80 text-white text-[12px] font-medium px-1 py-0.5 rounded-[4px] transition-all duration-200 ${
            isHovered ? 'bg-black scale-105' : ''
          }`}>
            {video.duration}
          </span>
          {video.duration === 'LIVE' && (
            <span className="absolute top-1 left-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              LIVE
            </span>
          )}
          {/* Watched progress bar */}
          {watchedProgress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-400/30">
              <div className="h-full bg-red-600 watched-progress" style={{ width: `${watchedProgress}%` }} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 py-0.5">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-5">
            {video.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <button
              className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-[11px] transition-transform duration-200 hover:scale-110"
              style={{ backgroundColor: video.channelColor }}
              onClick={handleChannelClick}
              aria-label={`Go to ${video.channelTitle} channel`}
            >
              {video.channelInitial}
            </button>
            <div>
              <p
                className="text-[12px] text-[#606060] dark:text-[#aaa] hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer transition-colors"
                onClick={handleChannelClick}
              >
                {video.channelTitle}
              </p>
              <p className="text-[12px] text-[#606060] dark:text-[#aaa]">
                {video.views} • {video.publishedAt}
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleAddToQueue(e); }}>
              <ListPlus className="w-4 h-4 mr-2" />
              Add to queue
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleWatchLater(e); }}>
              <Clock className="w-4 h-4 mr-2" />
              {isWatchLater ? '✓ Remove from Watch later' : 'Add to Watch later'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleLike(video.id); }}>
              {isLiked ? '✓ Unlike' : '👍 Like'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Grid layout (default)
  return (
    <div
      className="cursor-pointer group relative"
      onClick={() => openVideo(video)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
        {!imageError ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <FallbackThumbnail color={video.channelColor} initial={video.channelInitial} />
        )}
        {/* Animated duration badge */}
        <span className={`absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[12px] font-medium px-1 py-0.5 rounded-[4px] transition-all duration-200 ${
          isHovered ? 'bg-black scale-110 shadow-lg' : ''
        }`}>
          {video.duration}
        </span>
        {video.duration === 'LIVE' && (
          <span className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
          </span>
        )}
        {/* Hover overlay with action buttons */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        {/* Quick action overlay buttons */}
        <div className="absolute top-1.5 right-1.5 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
          <button
            onClick={handleWatchLater}
            className="p-1.5 bg-black/70 hover:bg-black/90 rounded-md transition-colors"
            aria-label={isWatchLater ? 'Remove from Watch later' : 'Watch later'}
          >
            <Clock className={`w-4 h-4 ${isWatchLater ? 'text-blue-400' : 'text-white'}`} />
          </button>
          <button
            onClick={handleAddToQueue}
            className="p-1.5 bg-black/70 hover:bg-black/90 rounded-md transition-colors"
            aria-label="Add to queue"
          >
            <ListPlus className="w-4 h-4 text-white" />
          </button>
        </div>
        {/* Watched progress bar */}
        {watchedProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-400/30">
            <div className="h-full bg-red-600 watched-progress" style={{ width: `${watchedProgress}%` }} />
          </div>
        )}
      </div>

      {/* Hover tooltip */}
      {showTooltip && layout === 'grid' && (
        <div className="absolute z-50 left-0 right-0 -bottom-2 translate-y-full pointer-events-none animate-scale-in">
          <div className="bg-gray-900 dark:bg-[#3f3f3f] text-white rounded-lg px-3 py-2 shadow-xl text-xs">
            <p className="font-medium line-clamp-1">{video.title}</p>
            <p className="text-gray-300 mt-0.5">{video.channelTitle} • {video.duration}</p>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="flex gap-3 mt-3">
        {/* Channel avatar */}
        <button
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-sm transition-transform duration-200 hover:scale-110"
          style={{ backgroundColor: video.channelColor }}
          onClick={handleChannelClick}
          aria-label={`Go to ${video.channelTitle} channel`}
        >
          {video.channelInitial}
        </button>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-5">
            {video.title}
          </h3>
          <p
            className="text-[12px] text-[#606060] dark:text-[#aaa] mt-1 hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer transition-colors"
            onClick={handleChannelClick}
          >
            {video.channelTitle}
          </p>
          <p className="text-[12px] text-[#606060] dark:text-[#aaa]">
            {video.views} • {video.publishedAt}
          </p>
        </div>

        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shrink-0 h-fit"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleAddToQueue(e); }}>
              <ListPlus className="w-4 h-4 mr-2" />
              Add to queue
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleWatchLater(e); }}>
              <Clock className="w-4 h-4 mr-2" />
              {isWatchLater ? '✓ Remove from Watch later' : 'Add to Watch later'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleLike(video.id); }}>
              {isLiked ? '✓ Unlike' : '👍 Like'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
