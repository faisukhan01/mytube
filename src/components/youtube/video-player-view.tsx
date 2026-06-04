'use client';

import { useYouTubeStore } from '@/store/youtube-store';
import { getCommentsForVideo, getRelatedVideos, type Comment } from '@/lib/youtube-data';
import VideoCard from './video-card';
import PlaylistDialog from './playlist-dialog';
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Bell,
  Check,
  Clock,
  ListVideo,
  Plus,
  Tag,
  Shield,
  ExternalLink,
  ListPlus,
  Copy,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Chapter marker interface
interface ChapterMarker {
  time: string;
  seconds: number;
  label: string;
}

// Helper function to parse chapter markers from description
function parseChapters(description: string): ChapterMarker[] {
  const lines = description.split('\n');
  const chapters: ChapterMarker[] = [];
  // Match patterns like "0:00 Intro", "3:33 Chorus", "1:02:15 Outro"
  const timestampRegex = /^(\d{1,2}:\d{2}(?::\d{2})?)\s+(.+)$/;

  for (const line of lines) {
    const match = line.trim().match(timestampRegex);
    if (match) {
      const timeStr = match[1];
      const label = match[2].trim();
      const parts = timeStr.split(':').map(Number);
      let seconds = 0;
      if (parts.length === 3) {
        seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
      } else if (parts.length === 2) {
        seconds = parts[0] * 60 + parts[1];
      }
      chapters.push({ time: timeStr, seconds, label });
    }
  }
  return chapters;
}

// Helper function to format description text with clickable hashtags and URLs
function formatDescriptionText(text: string): React.ReactNode[] {
  const parts = text.split(/(\s+)/);
  return parts.map((part, index) => {
    // Check if it's a URL
    const urlRegex = /^https?:\/\/[^\s]+$/;
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline break-all"
        >
          {part}
        </a>
      );
    }

    // Check if it contains a hashtag (#word)
    const hashtagRegex = /^(#\S+)$/;
    const hashtagMatch = part.match(hashtagRegex);
    if (hashtagMatch) {
      return (
        <a
          key={index}
          href="#"
          onClick={(e) => e.preventDefault()}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {hashtagMatch[1]}
        </a>
      );
    }

    // Check if it contains a URL within text
    const urlInTextRegex = /(https?:\/\/[^\s]+)/g;
    const urlMatches = part.match(urlInTextRegex);
    if (urlMatches) {
      const elements: React.ReactNode[] = [];
      let remaining = part;
      urlMatches.forEach((url, i) => {
        const idx = remaining.indexOf(url);
        if (idx > 0) {
          elements.push(remaining.substring(0, idx));
        }
        elements.push(
          <a
            key={`${index}-url-${i}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline break-all"
          >
            {url}
          </a>
        );
        remaining = remaining.substring(idx + url.length);
      });
      if (remaining) {
        elements.push(remaining);
      }
      return <span key={index}>{elements}</span>;
    }

    // Regular text
    return part;
  });
}

function RelatedVideoSkeleton() {
  return (
    <div className="flex gap-2 py-1">
      {/* Thumbnail skeleton */}
      <div className="relative shrink-0 w-[168px] h-[94px] rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gray-200 dark:bg-[#272727] animate-shimmer rounded-lg" />
        <div className="absolute bottom-1 right-1 w-9 h-3 bg-gray-300 dark:bg-[#3f3f3f] rounded animate-shimmer" />
      </div>
      {/* Info skeleton */}
      <div className="flex-1 space-y-1.5 py-0.5">
        <div className="h-3.5 bg-gray-200 dark:bg-[#272727] rounded animate-shimmer w-full" />
        <div className="h-3.5 bg-gray-200 dark:bg-[#272727] rounded animate-shimmer w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded animate-shimmer w-1/2" />
        <div className="h-3 bg-gray-200 dark:bg-[#272727] rounded animate-shimmer w-1/3" />
      </div>
    </div>
  );
}

export default function VideoPlayerView() {
  const { currentVideo, toggleLike, toggleWatchLater, likedVideos, watchLater, openChannel, user, playlists } = useYouTubeStore();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [sortComments, setSortComments] = useState<'top' | 'newest'>('top');
  const [commentText, setCommentText] = useState('');
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [commentLikes, setCommentLikes] = useState<Record<string, boolean>>({});

  const baseComments = useMemo(() => {
    if (!currentVideo) return [];
    return getCommentsForVideo(currentVideo.id);
  }, [currentVideo]);

  const comments = useMemo(() => {
    const sorted = [...userComments, ...baseComments];
    if (sortComments === 'newest') {
      return sorted.reverse();
    }
    return sorted;
  }, [userComments, baseComments, sortComments]);

  const relatedVideos = useMemo(() => {
    if (!currentVideo) return [];
    return getRelatedVideos(currentVideo.id);
  }, [currentVideo]);

  // Parse chapters from description
  const chapters = useMemo(() => {
    if (!currentVideo) return [];
    return parseChapters(currentVideo.description);
  }, [currentVideo]);

  const isLiked = currentVideo ? likedVideos.includes(currentVideo.id) : false;
  const isWatchLater = currentVideo ? watchLater.includes(currentVideo.id) : false;

  const setBaseCommentReply = useCallback((commentId: string) => {
    // This handles replies to base comments from the data layer
    // We just expand the replies for that comment
    setExpandedReplies(prev => new Set(prev).add(commentId));
  }, []);

  if (!currentVideo) return null;

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleCopyLink = () => {
    const link = `https://www.youtube.com/watch?v=${currentVideo.id}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success('Link copied to clipboard');
      setShowShareDialog(false);
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const handleDownload = () => {
    toast.success('Download started');
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (!isDisliked) {
      toast('Disliked', { icon: '👎' });
    }
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    if (!isSubscribed) {
      toast.success(`Subscribed to ${currentVideo.channelTitle}`);
    } else {
      toast.info(`Unsubscribed from ${currentVideo.channelTitle}`);
    }
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: `user-${Date.now()}`,
      author: user?.name || 'User',
      authorAvatar: user?.avatar || '',
      authorInitial: user?.initials?.charAt(0) || 'U',
      text: commentText.trim(),
      likes: 0,
      timeAgo: 'Just now',
      replies: [],
    };
    setUserComments([newComment, ...userComments]);
    setCommentText('');
    toast.success('Comment posted');
  };

  const handlePostReply = (commentId: string) => {
    if (!replyText.trim()) return;
    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      author: user?.name || 'User',
      authorAvatar: user?.avatar || '',
      authorInitial: user?.initials?.charAt(0) || 'U',
      text: replyText.trim(),
      likes: 0,
      timeAgo: 'Just now',
    };

    setUserComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return { ...c, replies: [...(c.replies || []), newReply] };
      }
      return c;
    }));

    setBaseCommentReply(commentId);
    setReplyText('');
    setReplyingTo(null);
    toast.success('Reply posted');
  };

  const handleToggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  const handleChannelClick = () => {
    if (currentVideo) {
      openChannel(currentVideo.channelTitle);
    }
  };

  const handleChapterClick = (seconds: number) => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.src = `https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&rel=0&start=${seconds}`;
    }
    toast.info(`Jumped to ${formatSeconds(seconds)}`);
  };

  const formatSeconds = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const toggleCommentLike = (commentId: string) => {
    setCommentLikes(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 max-w-[1800px] mx-auto">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Video player */}
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
          {isVideoLoading && (
            <div className="absolute inset-0 bg-gray-900 z-10 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-800 animate-pulse flex items-center justify-center">
                <svg className="w-8 h-8 text-white/60" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
          <iframe
            src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&rel=0`}
            title={currentVideo.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={() => setIsVideoLoading(false)}
          />
        </div>

        {/* Video title */}
        <h1 className="text-[20px] font-semibold text-gray-900 dark:text-white mt-3 leading-7">
          {currentVideo.title}
        </h1>

        {/* Chapter markers - horizontal scrollable row */}
        {chapters.length > 0 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {chapters.map((chapter, index) => (
              <button
                key={index}
                onClick={() => handleChapterClick(chapter.seconds)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-full transition-colors text-sm"
              >
                <span className="text-blue-600 dark:text-blue-400 font-medium text-[12px]">{chapter.time}</span>
                <span className="text-gray-800 dark:text-gray-200 text-[12px]">{chapter.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Channel info and actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
          {/* Channel info */}
          <div className="flex items-center gap-3">
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0"
              style={{ backgroundColor: currentVideo.channelColor }}
              onClick={handleChannelClick}
              aria-label={`Go to ${currentVideo.channelTitle} channel`}
            >
              {currentVideo.channelInitial}
            </button>
            <div>
              <div className="flex items-center gap-1">
                <span
                  className="text-[14px] font-medium text-gray-900 dark:text-white cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={handleChannelClick}
                >
                  {currentVideo.channelTitle}
                </span>
                <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{currentVideo.subscribers} subscribers</p>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <Button
                variant="default"
                onClick={handleSubscribe}
                className={`rounded-full text-sm font-medium px-4 h-9 transition-colors ${
                  isSubscribed
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                    : 'bg-[#ff0000] hover:bg-[#cc0000] text-white'
                }`}
              >
                {isSubscribed ? (
                  <span className="flex items-center gap-1"><Check className="w-4 h-4" /> Subscribed</span>
                ) : (
                  'Subscribe'
                )}
              </Button>
              {isSubscribed && (
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#272727] rounded-full transition-colors" aria-label="Notifications">
                  <Bell className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </button>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Like/Dislike */}
            <div className="flex items-center bg-gray-100 dark:bg-[#272727] rounded-full">
              <button
                onClick={() => toggleLike(currentVideo.id)}
                className={`flex items-center gap-1.5 pl-4 pr-2.5 py-2 hover:bg-gray-200 dark:hover:bg-[#3f3f3f] transition-colors rounded-l-full ${
                  isLiked ? 'text-blue-600' : 'text-gray-800 dark:text-gray-200'
                }`}
              >
                <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-[12px] font-medium">{currentVideo.likes || '0'}</span>
              </button>
              <div className="h-6 w-[1px] bg-gray-300 dark:bg-gray-600 mx-2" />
              <button
                onClick={handleDislike}
                className={`flex items-center pl-2.5 pr-4 py-2 hover:bg-gray-200 dark:hover:bg-[#3f3f3f] transition-colors rounded-r-full ${
                  isDisliked ? 'text-blue-600' : 'text-gray-800 dark:text-gray-200'
                }`}
              >
                <ThumbsDown className={`w-5 h-5 ${isDisliked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-full transition-colors"
            >
              <Share2 className="w-5 h-5 text-gray-800 dark:text-gray-200" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Share</span>
            </button>

            {/* Download button */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-full transition-colors"
            >
              <Download className="w-5 h-5 text-gray-800 dark:text-gray-200" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Download</span>
            </button>

            {/* Save button with dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-colors ${
                    isWatchLater ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#3f3f3f] text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <ListPlus className="w-5 h-5" />
                  <span className="text-sm font-medium">Save</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={() => {
                    toggleWatchLater(currentVideo.id);
                    if (!isWatchLater) {
                      toast.success('Saved to Watch later');
                    } else {
                      toast.info('Removed from Watch later');
                    }
                  }}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  {isWatchLater ? 'Remove from Watch later' : 'Save to Watch later'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowPlaylistDialog(true)}
                >
                  <ListVideo className="w-4 h-4 mr-2" />
                  Save to playlist
                </DropdownMenuItem>
                {playlists.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    {playlists.map((pl) => (
                      <DropdownMenuItem
                        key={pl.id}
                        onClick={() => {
                          const { addToPlaylist } = useYouTubeStore.getState();
                          if (pl.videos.includes(currentVideo.id)) {
                            toast.info('Already in this playlist');
                          } else {
                            addToPlaylist(pl.id, currentVideo.id);
                            toast.success(`Saved to "${pl.name}"`);
                          }
                        }}
                      >
                        <div className="w-4 h-4 mr-2 border border-gray-400 dark:border-gray-500 rounded-sm flex items-center justify-center shrink-0">
                          {pl.videos.includes(currentVideo.id) && (
                            <svg className="w-3 h-3 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <path d="M5 12l5 5L20 7" />
                            </svg>
                          )}
                        </div>
                        <span className="truncate">{pl.name}</span>
                        <span className="ml-auto text-xs text-gray-500">{pl.videos.length}</span>
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowPlaylistDialog(true)}
                  className="text-blue-600 dark:text-blue-400"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create new playlist
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* More options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-full transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => toast.success('Report submitted')}>
                  <Shield className="w-4 h-4 mr-2" />
                  Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success('Transcript opening...')}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Show transcript
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 bg-gray-100 dark:bg-[#272727] rounded-xl p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
            <span>{currentVideo.views}</span>
            <span>{currentVideo.publishedAt}</span>
          </div>
          <div className={`mt-2 text-sm text-gray-800 dark:text-gray-300 whitespace-pre-line overflow-hidden transition-all duration-300 ${!showFullDescription ? 'max-h-[60px]' : ''}`}>
            {formatDescriptionText(currentVideo.description)}
            {showFullDescription && (
              <>
                {'\n\n'}
                {currentVideo.channelTitle}
                {'\n'}
                {currentVideo.views} • {currentVideo.publishedAt}
                {'\n\n'}
                <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 dark:text-blue-400 hover:underline">#{currentVideo.category.toLowerCase().replace(/\s+/g, '')}</a>
                {' '}
                <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 dark:text-blue-400 hover:underline">#{currentVideo.channelTitle.toLowerCase().replace(/\s+/g, '')}</a>
              </>
            )}
          </div>
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="flex items-center gap-1 text-sm font-medium text-gray-800 dark:text-gray-300 mt-2 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {showFullDescription ? (
              <>
                Show less
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show more
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Video metadata in expanded description */}
          {showFullDescription && (
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Tag className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">Category</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                  {currentVideo.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">License</span>
                <span className="text-gray-800 dark:text-gray-200">Standard YouTube License</span>
              </div>
              {currentVideo.channelTitle && (
                <div className="flex items-center gap-2 text-sm">
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">Source</span>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {currentVideo.channelTitle} (YouTube)
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comments section */}
        <div className="mt-6">
          <div className="flex items-center gap-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {comments.length} Comments
            </h3>
            <div className="flex items-center gap-2">
              <Select value={sortComments} onValueChange={(v) => setSortComments(v as 'top' | 'newest')}>
                <SelectTrigger className="h-8 w-auto gap-1 border-none bg-transparent shadow-none px-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#272727]">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
                  </svg>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top comments</SelectItem>
                  <SelectItem value="newest">Newest first</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Add comment */}
          <div className="flex gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0"
              style={{ backgroundColor: user?.color || '#7C3AED' }}
            >
              {user?.initials || 'U'}
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && commentText.trim()) {
                    handlePostComment();
                  }
                }}
                placeholder="Add a comment..."
                className="w-full border-b border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white outline-none pb-1 text-sm bg-transparent dark:text-white dark:placeholder-gray-400 transition-colors"
              />
              {commentText && (
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCommentText('')}
                    className="dark:text-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handlePostComment}
                    className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!commentText.trim()}
                  >
                    Post
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Comments list */}
          <div className="space-y-5">
            {comments.map((comment) => {
              const hasReplies = comment.replies && comment.replies.length > 0;
              const isExpanded = expandedReplies.has(comment.id);
              const isLikedComment = commentLikes[comment.id] || false;

              return (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-[13px] shrink-0"
                    style={{ backgroundColor: comment.authorInitial === 'T' ? '#2196F3' : comment.authorInitial === 'D' ? '#FF9800' : comment.authorInitial === 'C' ? '#4CAF50' : comment.authorInitial === 'U' ? '#9C27B0' : comment.authorInitial === 'M' ? '#E91E63' : comment.authorInitial === 'R' ? '#009688' : comment.authorInitial === 'N' ? '#FF5722' : '#9C27B0' }}
                  >
                    {comment.authorInitial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-gray-900 dark:text-white">@{comment.author}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{comment.timeAgo}</span>
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-300 mt-0.5 whitespace-pre-line">{comment.text}</p>
                    <div className="flex items-center gap-4 mt-1.5">
                      <button
                        onClick={() => toggleCommentLike(comment.id)}
                        className={`flex items-center gap-1 transition-colors ${isLikedComment ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${isLikedComment ? 'fill-current' : ''}`} />
                        <span className="text-xs">{isLikedComment ? comment.likes + 1 : comment.likes}</span>
                      </button>
                      <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="text-xs text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        Reply
                      </button>
                    </div>

                    {/* Reply input */}
                    {replyingTo === comment.id && (
                      <div className="flex gap-2 mt-3 ml-0">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white font-medium text-[10px] shrink-0"
                          style={{ backgroundColor: user?.color || '#7C3AED' }}
                        >
                          {user?.initials?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && replyText.trim()) {
                                handlePostReply(comment.id);
                              }
                            }}
                            placeholder="Add a reply..."
                            autoFocus
                            className="w-full border-b border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white outline-none pb-1 text-sm bg-transparent dark:text-white dark:placeholder-gray-400"
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => { setReplyingTo(null); setReplyText(''); }}
                              className="dark:text-gray-300 h-7 text-xs"
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handlePostReply(comment.id)}
                              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs"
                              disabled={!replyText.trim()}
                            >
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Replies toggle */}
                    {hasReplies && (
                      <div className="mt-3 ml-0">
                        <button
                          onClick={() => handleToggleReplies(comment.id)}
                          className="flex items-center gap-1 text-blue-700 dark:text-blue-400 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded-full -ml-2 transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                          {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}
                        </button>
                        {isExpanded && (
                          <div className="mt-2 space-y-4">
                            {comment.replies!.map((reply) => (
                              <div key={reply.id} className="flex gap-3">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-medium text-[10px] shrink-0"
                                  style={{ backgroundColor: reply.authorInitial === 'N' ? '#FF5722' : reply.authorInitial === 'M' ? '#E91E63' : reply.authorInitial === 'R' ? '#009688' : '#607D8B' }}
                                >
                                  {reply.authorInitial}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[13px] font-medium text-gray-900 dark:text-white">@{reply.author}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{reply.timeAgo}</span>
                                  </div>
                                  <p className="text-sm text-gray-800 dark:text-gray-300 mt-0.5">{reply.text}</p>
                                  <div className="flex items-center gap-4 mt-1">
                                    <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                      <ThumbsUp className="w-3 h-3" />
                                      <span className="text-xs">{reply.likes}</span>
                                    </button>
                                    <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                      <ThumbsDown className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                      className="text-xs text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-white"
                                    >
                                      Reply
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Related videos sidebar */}
      <div className="lg:w-[400px] shrink-0">
        {/* Chips for related */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {['All', 'Related', 'Recently uploaded', 'Watched'].map((chip) => (
            <button
              key={chip}
              className="shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-[#272727] text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#3f3f3f] transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Related videos list with skeleton loading */}
        <div className="space-y-2">
          {isVideoLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`stagger-${Math.min(i + 1, 8)} animate-fade-in`}>
                <RelatedVideoSkeleton />
              </div>
            ))
          ) : (
            relatedVideos.map((video) => (
              <VideoCard key={video.id} video={video} layout="list" />
            ))
          )}
        </div>
      </div>

      {/* Playlist Dialog */}
      <PlaylistDialog
        open={showPlaylistDialog}
        onOpenChange={setShowPlaylistDialog}
        videoIdToSave={currentVideo?.id || null}
      />

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <input
                type="text"
                value={`https://www.youtube.com/watch?v=${currentVideo.id}`}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none"
              />
              <Button
                onClick={handleCopyLink}
                size="sm"
                className="shrink-0 gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy
              </Button>
            </div>
            <div className="flex gap-4 justify-center pt-2">
              <button
                onClick={() => {
                  const url = `https://www.youtube.com/watch?v=${currentVideo.id}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(currentVideo.title + ' ' + url)}`, '_blank');
                }}
                className="flex flex-col items-center gap-1.5 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">WhatsApp</span>
              </button>
              <button
                onClick={() => {
                  const url = `https://www.youtube.com/watch?v=${currentVideo.id}`;
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(currentVideo.title)}&url=${encodeURIComponent(url)}`, '_blank');
                }}
                className="flex flex-col items-center gap-1.5 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Twitter</span>
              </button>
              <button
                onClick={() => {
                  const url = `https://www.youtube.com/watch?v=${currentVideo.id}`;
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                }}
                className="flex flex-col items-center gap-1.5 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <div className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center text-white">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Facebook</span>
              </button>
              <button
                onClick={() => {
                  const url = `https://www.youtube.com/watch?v=${currentVideo.id}`;
                  window.open(`mailto:?subject=${encodeURIComponent(currentVideo.title)}&body=${encodeURIComponent(url)}`);
                }}
                className="flex flex-col items-center gap-1.5 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <div className="w-12 h-12 bg-gray-500 dark:bg-gray-600 rounded-full flex items-center justify-center text-white">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Email</span>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
