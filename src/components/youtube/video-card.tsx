'use client';

import { Video, shortsVideos } from '@/lib/youtube-data';
import { useYouTubeStore } from '@/store/youtube-store';
import { MoreVertical, Play, Clock, ListPlus, Share2, BookmarkPlus, Ban, EyeOff, Flag } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import ChannelHoverCard from './channel-hover-card';
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
  const { openVideo, openShort, toggleWatchLater, toggleLike, watchLater, likedVideos, openChannel, watchProgress, addToQueue, currentVideo, hideVideo, unhideVideo, hiddenVideos } = useYouTubeStore();
  const [imageError, setImageError] = useState(false);
  const [fallbackAttempted, setFallbackAttempted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isWatchLater = watchLater.includes(video.id);
  const isLiked = likedVideos.includes(video.id);

  // Get watch progress from store
  const progress = watchProgress[video.id] || 0;

  // Check if this is the currently playing video
  const isCurrentlyPlaying = currentVideo?.id === video.id;

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Show enhanced preview after 1.5s for grid layout
    if (layout === 'grid') {
      previewTimeoutRef.current = setTimeout(() => {
        setShowPreview(true);
      }, 1500);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowPreview(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }
  };

  const handleChannelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openChannel(video.channelTitle);
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(video);
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

  const handleNotInterested = () => {
    hideVideo(video.id);
    toast('Video removed', {
      action: {
        label: 'Undo',
        onClick: () => {
          unhideVideo(video.id);
        },
      },
      duration: 5000,
    });
  };

  const handleDontRecommendChannel = () => {
    hideVideo(video.id);
    toast(`We won't recommend videos from ${video.channelTitle}`, {
      action: {
        label: 'Undo',
        onClick: () => {
          unhideVideo(video.id);
        },
      },
      duration: 5000,
    });
  };

  const handleShare = () => {
    const link = `https://www.youtube.com/watch?v=${video.id}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success('Link copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const handleSaveToPlaylist = () => {
    toggleWatchLater(video.id);
    toast.success('Saved to Watch later');
  };

  const handleReport = () => {
    toast.success('Report submitted. Thank you for your feedback.');
  };

  const handleShortClick = () => {
    const index = shortsVideos.findIndex((v) => v.id === video.id);
    if (index >= 0) {
      openShort(index);
    } else {
      openVideo(video);
    }
  };

  // Check if video is recently uploaded (less than 1 month)
  const isRecentlyUploaded = (() => {
    const t = video.publishedAt.toLowerCase();
    return (t.includes('hours ago') || t.includes('days ago') || t.includes('weeks ago') || t.includes('hour ago') || t.includes('day ago') || t.includes('week ago')) && !t.includes('month') && !t.includes('year');
  })();

  // Don't render if video is hidden
  if (hiddenVideos.includes(video.id)) return null;

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
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
              onError={(e) => {
                const img = e.currentTarget;
                if (!fallbackAttempted && img.src.includes('hqdefault.jpg')) {
                  setFallbackAttempted(true);
                  img.src = img.src.replace('hqdefault.jpg', 'mqdefault.jpg');
                } else {
                  setImageError(true);
                }
              }}
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
        className="flex gap-4 cursor-pointer group py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors px-2 video-card-hover"
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
              className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
              onError={(e) => {
                const img = e.currentTarget;
                if (!fallbackAttempted && img.src.includes('hqdefault.jpg')) {
                  setFallbackAttempted(true);
                  img.src = img.src.replace('hqdefault.jpg', 'mqdefault.jpg');
                } else {
                  setImageError(true);
                }
              }}
              loading="lazy"
            />
          ) : (
            <FallbackThumbnail color={video.channelColor} initial={video.channelInitial} />
          )}
          {video.duration !== 'LIVE' && (
            <span className={`absolute bottom-1 right-1 bg-black/80 duration-badge-blur text-white text-[12px] font-medium px-1 py-0.5 rounded-[4px] transition-all duration-200 ${
              isHovered ? 'bg-black scale-105 shadow-lg' : ''
            }`}>
              {video.duration}
            </span>
          )}
          {video.duration === 'LIVE' && (
            <span className="absolute top-1 left-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
            </span>
          )}
          {/* Playing now indicator */}
          {isCurrentlyPlaying && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] flex items-end justify-center bg-black/30">
              <div className="playing-indicator mb-1">
                <span /><span /><span />
              </div>
            </div>
          )}
          {/* Watch progress bar */}
          {progress > 0 && !isCurrentlyPlaying ? (
            <div className="absolute bottom-0 left-0 watched-progress-thin" style={{ width: `${progress}%` }} />
          ) : !isCurrentlyPlaying ? (
            <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gray-200 dark:bg-gray-700" />
          ) : null}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 py-0.5">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-5 flex items-start gap-1.5">
            <span className="flex-1">{video.title}</span>
            {isRecentlyUploaded && (
              <span className="shrink-0 inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full" />
                NEW
              </span>
            )}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <button
              className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-[11px] transition-all duration-200 hover:scale-110 hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-500"
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

  // Grid layout (default) - wrapped with ContextMenu
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className="cursor-pointer group video-card-hover relative"
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
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
            onError={(e) => {
              const img = e.currentTarget;
              if (!fallbackAttempted && img.src.includes('hqdefault.jpg')) {
                setFallbackAttempted(true);
                img.src = img.src.replace('hqdefault.jpg', 'mqdefault.jpg');
              } else {
                setImageError(true);
              }
            }}
            loading="lazy"
          />
        ) : (
          <FallbackThumbnail color={video.channelColor} initial={video.channelInitial} />
        )}
        {/* Animated duration badge */}
        <span className={`absolute bottom-1.5 right-1.5 bg-black/80 duration-badge-blur text-white text-[12px] font-medium px-1 py-0.5 rounded-[4px] transition-all duration-200 ${
          isHovered ? 'bg-black scale-110 shadow-lg' : ''
        }`}>
          {video.duration}
        </span>
        {video.duration === 'LIVE' && (
          <span className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
          </span>
        )}
        {/* Playing now indicator */}
        {isCurrentlyPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] flex items-end justify-center bg-black/30">
            <div className="playing-indicator mb-1">
              <span /><span /><span />
            </div>
          </div>
        )}
        {/* Subtle hover brightness change */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.03] transition-colors duration-300 rounded-xl" />
        {/* Quick action overlay buttons */}
        <div className="absolute top-1.5 right-1.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleWatchLater}
            className="p-1.5 bg-black/70 hover:bg-black/90 rounded-md transition-all duration-200 hover:scale-105"
            aria-label={isWatchLater ? 'Remove from Watch later' : 'Watch later'}
          >
            <Clock className={`w-4 h-4 ${isWatchLater ? 'text-blue-400' : 'text-white'} transition-colors duration-200`} />
          </button>
          <button
            onClick={handleAddToQueue}
            className="p-1.5 bg-black/70 hover:bg-black/90 rounded-md transition-all duration-200 hover:scale-105"
            aria-label="Add to queue"
          >
            <ListPlus className="w-4 h-4 text-white" />
          </button>
        </div>
        {/* Watch progress bar */}
        {progress > 0 && !isCurrentlyPlaying ? (
          <div className="absolute bottom-0 left-0 watched-progress-thin" style={{ width: `${progress}%` }} />
        ) : !isCurrentlyPlaying ? (
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gray-200 dark:bg-gray-700" />
        ) : null}
      </div>

      {/* Hover preview card (appears after 1.5s) */}
      {showPreview && layout === 'grid' && (
        <div className="absolute z-50 left-0 right-0 -bottom-2 translate-y-full pointer-events-none animate-fade-in">
          <div className="bg-white dark:bg-[#282828] border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl p-2 text-sm">
            {/* Mini thumbnail with play icon overlay */}
            <div className="relative aspect-video rounded-md overflow-hidden mb-2">
              {!imageError ? (
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <FallbackThumbnail color={video.channelColor} initial={video.channelInitial} />
              )}
              {/* Play icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-10 h-10 rounded-full bg-black/70 flex items-center justify-center">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
              </div>
              {/* Duration badge */}
              <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[11px] font-medium px-1 py-0.5 rounded-[3px]">
                {video.duration}
              </span>
            </div>
            {/* Video info */}
            <p className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-[13px] leading-4">
              {video.title}
            </p>
            <p className="text-[11px] text-[#606060] dark:text-[#aaa] mt-1">
              {video.channelTitle}
            </p>
            <p className="text-[11px] text-[#606060] dark:text-[#aaa]">
              {video.views} • {video.publishedAt}
            </p>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-3">
        {/* Channel avatar */}
        <ChannelHoverCard
          channelTitle={video.channelTitle}
          channelInitial={video.channelInitial}
          channelColor={video.channelColor}
        >
          <button
            className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm transition-all duration-200 hover:scale-110 hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-500"
            style={{ backgroundColor: video.channelColor }}
            onClick={handleChannelClick}
            aria-label={`Go to ${video.channelTitle} channel`}
          >
            {video.channelInitial}
          </button>
        </ChannelHoverCard>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] sm:text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-4 sm:leading-5 flex items-start gap-1.5">
            <span className="flex-1">{video.title}</span>
            {isRecentlyUploaded && (
              <span className="shrink-0 inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full" />
                NEW
              </span>
            )}
          </h3>
          <ChannelHoverCard
            channelTitle={video.channelTitle}
            channelInitial={video.channelInitial}
            channelColor={video.channelColor}
          >
            <p
              className="text-[11px] sm:text-[12px] text-[#606060] dark:text-[#aaa] mt-0.5 sm:mt-1 hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer transition-colors"
              onClick={handleChannelClick}
            >
              {video.channelTitle}
            </p>
          </ChannelHoverCard>
          <p className="text-[11px] sm:text-[12px] text-[#606060] dark:text-[#aaa]">
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
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleSaveToPlaylist(); }}>
              <BookmarkPlus className="w-4 h-4 mr-2" />
              Save to playlist
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleShare(); }}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleNotInterested(); }}>
              <EyeOff className="w-4 h-4 mr-2" />
              Not interested
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDontRecommendChannel(); }}>
              <Ban className="w-4 h-4 mr-2" />
              Don&apos;t recommend channel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleReport(); }}>
              <Flag className="w-4 h-4 mr-2" />
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={handleAddToQueue}>
          <ListPlus className="w-4 h-4 mr-2" />
          Add to queue
        </ContextMenuItem>
        <ContextMenuItem onClick={() => { toggleWatchLater(video.id); toast.success(isWatchLater ? 'Removed from Watch later' : 'Added to Watch later'); }}>
          <Clock className="w-4 h-4 mr-2" />
          {isWatchLater ? 'Remove from Watch later' : 'Save to Watch later'}
        </ContextMenuItem>
        <ContextMenuItem onClick={handleSaveToPlaylist}>
          <BookmarkPlus className="w-4 h-4 mr-2" />
          Save to playlist
        </ContextMenuItem>
        <ContextMenuItem onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleNotInterested}>
          <EyeOff className="w-4 h-4 mr-2" />
          Not interested
        </ContextMenuItem>
        <ContextMenuItem onClick={handleDontRecommendChannel}>
          <Ban className="w-4 h-4 mr-2" />
          Don&apos;t recommend channel
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleReport} variant="destructive">
          <Flag className="w-4 h-4 mr-2" />
          Report
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
