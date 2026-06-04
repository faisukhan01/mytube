'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { shortsVideos } from '@/lib/youtube-data';
import { useYouTubeStore } from '@/store/youtube-store';
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  Repeat2,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  Play,
  ExternalLink,
  Music2,
  Send,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// YouTube IFrame API types
interface YTPlayerEvent {
  data: number;
  target: unknown;
}

interface YTPlayer {
  destroy: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  pauseVideo: () => void;
  playVideo: () => void;
}

declare global {
  interface Window {
    YT?: {
      Player: new (elementId: string, config: {
        events: {
          onReady: () => void;
          onStateChange: (event: YTPlayerEvent) => void;
          onError: (event: YTPlayerEvent) => void;
        };
      }) => YTPlayer;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// Sample comments for Shorts
const sampleShortComments = [
  { author: 'ShortsFan42', text: 'This is insane! 🔥🔥🔥', likes: 12400, time: '2 hours ago' },
  { author: 'ViralKing', text: 'How does nobody talk about this?!', likes: 8900, time: '5 hours ago' },
  { author: 'DailyScroll', text: 'I\'ve watched this 100 times already 😂', likes: 5600, time: '1 day ago' },
  { author: 'TrendSetter', text: 'POV: you can\'t stop scrolling back to this', likes: 3200, time: '2 days ago' },
  { author: 'MemeLord99', text: 'This broke the internet fr fr', likes: 2100, time: '3 days ago' },
];

export default function ShortsPlayer() {
  const {
    currentShortIndex,
    setCurrentShortIndex,
    toggleLike,
    toggleWatchLater,
    likedVideos,
    watchLater,
    goHome,
    openChannel,
  } = useYouTubeStore();

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(sampleShortComments);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const playerRef = useRef<YTPlayer | null>(null);
  const swipeHintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTapRef = useRef<number>(0);
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalShorts = shortsVideos.length;
  const currentShort = shortsVideos[currentShortIndex];

  const goNext = useCallback(() => {
    if (currentShortIndex < totalShorts - 1) {
      setCurrentShortIndex(currentShortIndex + 1);
      setVideoError(false);
      setIsVideoReady(false);
      setIsPaused(false);
      setCurrentTime(0);
      setDuration(0);
      setShowSwipeHint(false);
    }
  }, [currentShortIndex, totalShorts, setCurrentShortIndex]);

  const goPrev = useCallback(() => {
    if (currentShortIndex > 0) {
      setCurrentShortIndex(currentShortIndex - 1);
      setVideoError(false);
      setIsVideoReady(false);
      setIsPaused(false);
      setCurrentTime(0);
      setDuration(0);
      setShowSwipeHint(false);
    }
  }, [currentShortIndex, setCurrentShortIndex]);

  // Auto-advance when video errors or doesn't load
  useEffect(() => {
    if (videoError) {
      autoAdvanceTimerRef.current = setTimeout(() => {
        goNext();
      }, 3000);
    }
    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    };
  }, [videoError, goNext]);

  // Clean up progress interval on unmount or index change
  useEffect(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentShortIndex]);

  // Load YouTube IFrame API and set up auto-advance
  useEffect(() => {
    // Clean up previous player
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch {
        // ignore
      }
      playerRef.current = null;
    }

    const initPlayer = () => {
      if (!window.YT?.Player) return;
      try {
        playerRef.current = new window.YT.Player('shorts-yt-player', {
          events: {
            onReady: () => {
              setIsVideoReady(true);
              // Start tracking progress
              if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = setInterval(() => {
                try {
                  const player = playerRef.current;
                  if (player && typeof player.getCurrentTime === 'function') {
                    setCurrentTime(player.getCurrentTime());
                    setDuration(player.getDuration());
                  }
                } catch {
                  // ignore
                }
              }, 200);
            },
            onStateChange: (event: YTPlayerEvent) => {
              // Auto-advance when video ends (state 0)
              if (event.data === 0) {
                if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
                setCurrentShortIndex((prev: number) => {
                  if (prev < totalShorts - 1) return prev + 1;
                  return prev;
                });
              }
              // Video is playing
              if (event.data === 1) {
                setIsVideoReady(true);
                setIsPaused(false);
                setVideoError(false);
              }
              // Video is paused
              if (event.data === 2) {
                setIsPaused(true);
              }
            },
            onError: () => {
              setVideoError(true);
            },
          },
        });
      } catch {
        // Player creation may fail if iframe not yet ready
      }
    };

    // Load YouTube IFrame API if not already loaded
    if (!window.YT?.Player) {
      const existingScript = document.getElementById('yt-iframe-api');
      if (!existingScript) {
        window.onYouTubeIframeAPIReady = () => {
          initPlayer();
        };
        const script = document.createElement('script');
        script.id = 'yt-iframe-api';
        script.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(script);
      } else {
        // Script is loading, wait for it
        const originalCallback = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (originalCallback) originalCallback();
          initPlayer();
        };
      }
    } else {
      // API already loaded, init player after a small delay for iframe to mount
      const timer = setTimeout(initPlayer, 500);
      return () => clearTimeout(timer);
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
        playerRef.current = null;
      }
    };
  }, [currentShortIndex, totalShorts, setCurrentShortIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'Escape') {
        if (showComments) {
          setShowComments(false);
        } else {
          goHome();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, goHome, showComments]);

  // Touch / swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  };

  // Mouse wheel handling
  const wheelTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (wheelTimeout.current) return;
      if (e.deltaY > 30) {
        goNext();
      } else if (e.deltaY < -30) {
        goPrev();
      }
      wheelTimeout.current = setTimeout(() => {
        wheelTimeout.current = null;
      }, 600);
    },
    [goNext, goPrev]
  );

  // Hide swipe hint after 3 seconds
  useEffect(() => {
    if (swipeHintTimeoutRef.current) clearTimeout(swipeHintTimeoutRef.current);
    swipeHintTimeoutRef.current = setTimeout(() => setShowSwipeHint(false), 3000);
    return () => {
      if (swipeHintTimeoutRef.current) clearTimeout(swipeHintTimeoutRef.current);
    };
  }, [currentShortIndex]);

  if (!currentShort) return null;

  const isLiked = likedVideos.includes(currentShort.id);
  const isSaved = watchLater.includes(currentShort.id);

  // Extract video ID (remove any "dup-" prefix used for deduplication)
  const videoId = currentShort.id.replace(/^dup-\d+-/, '');

  const handleLike = () => {
    toggleLike(currentShort.id);
    if (!isLiked) {
      setLikeAnimating(true);
      setTimeout(() => setLikeAnimating(false), 600);
      toast.success('Added to Liked videos');
    } else {
      toast.info('Removed from Liked videos');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`https://www.youtube.com/shorts/${videoId}`).then(() => {
      toast.success('Link copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const handleRemix = () => {
    toast.info('Remix this Short with your own creative spin!');
  };

  const handleComment = () => {
    setShowComments(true);
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    setComments(prev => [{
      author: 'You',
      text: commentText,
      likes: 0,
      time: 'Just now',
    }, ...prev]);
    setCommentText('');
    toast.success('Comment posted');
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    toast.success(isSubscribed ? 'Unsubscribed' : 'Subscribed!');
  };

  const handleSave = () => {
    toggleWatchLater(currentShort.id);
    toast.success(isSaved ? 'Removed from Watch later' : 'Saved to Watch later');
  };

  const formatNumber = (num: string) => {
    return num;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Tap-to-pause and double-tap-to-like
  const handleVideoTap = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;

    if (timeSinceLastTap < 300) {
      // Double tap - like
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
        tapTimeoutRef.current = null;
      }
      if (!isLiked) {
        toggleLike(currentShort.id);
        setShowHeartAnimation(true);
        setTimeout(() => setShowHeartAnimation(false), 800);
      } else {
        // Show heart animation even if already liked
        setShowHeartAnimation(true);
        setTimeout(() => setShowHeartAnimation(false), 800);
      }
      lastTapRef.current = 0;
    } else {
      // Single tap - wait to see if second tap comes
      lastTapRef.current = now;
      tapTimeoutRef.current = setTimeout(() => {
        // Single tap confirmed - toggle pause
        try {
          const player = playerRef.current;
          if (player && typeof player.pauseVideo === 'function') {
            if (isPaused) {
              player.playVideo();
            } else {
              player.pauseVideo();
            }
          }
        } catch {
          // ignore
        }
        lastTapRef.current = 0;
      }, 300);
    }
  };

  // Progress percentage
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#0f0f0f] dark:bg-[#0f0f0f] flex items-start justify-center">
      {/* Back button */}
      <button
        onClick={goHome}
        className="fixed top-16 left-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-150 text-white active:scale-95"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Pulsing red recording dot indicator */}
      <div className="fixed top-[68px] left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse-red" />
        <span className="text-white text-xs font-medium">Shorts</span>
      </div>

      <div
        ref={containerRef}
        className="relative flex items-start justify-center w-full max-w-[600px] mx-auto py-4 px-2 sm:px-4"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Main short container */}
        <div className="relative flex w-full max-w-[400px]">
          {/* Video container - 9:16 aspect ratio */}
          <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-black shadow-2xl animate-scale-in">
            {/* YouTube iframe embed */}
            <iframe
              id="shorts-yt-player"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&fs=0&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={currentShort.title}
              key={currentShort.id}
            />

            {/* Tap overlay for pause/play and double-tap like */}
            <div
              className="absolute inset-0 z-10 cursor-pointer"
              onClick={handleVideoTap}
            />

            {/* Heart animation for double-tap like */}
            {showHeartAnimation && (
              <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                <svg className="w-24 h-24 text-white animate-scale-in" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1" style={{ filter: 'drop-shadow(0 0 8px rgba(255,0,0,0.5))' }}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
            )}

            {/* Paused indicator */}
            {isPaused && !videoError && (
              <div className="absolute inset-0 z-15 flex items-center justify-center pointer-events-none bg-black/20">
                <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
            )}

            {/* Progress bar at top with time display */}
            <div className="absolute top-0 left-0 right-0 z-20 px-3 pt-2 flex items-center gap-2">
              <span className="text-white/70 text-[10px] font-medium tabular-nums">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 h-[3px] bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/80 rounded-full transition-all duration-200 ease-linear"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-white/70 text-[10px] font-medium tabular-nums">
                {formatTime(duration)}
              </span>
            </div>

            {/* Video unavailable fallback overlay */}
            {videoError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <Play className="w-10 h-10 text-white/60 ml-1" />
                </div>
                <p className="text-white/80 text-sm mb-2">Video unavailable</p>
                <a
                  href={`https://www.youtube.com/shorts/${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-blue-400 text-xs hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Watch on YouTube
                </a>
                <p className="text-white/40 text-[10px] mt-3">Skipping in 3s...</p>
              </div>
            )}

            {/* Loading indicator */}
            {!isVideoReady && !videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            )}

            {/* Bottom gradient overlay for text readability */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30 pointer-events-none">
              {/* Channel info and title */}
              <div className="p-3 pb-4">
                {/* Music info if available */}
                <div className="flex items-center gap-1.5 mb-2">
                  <Music2 className="w-3 h-3 text-white/60" />
                  <span className="text-white/60 text-[11px]">Original sound - {currentShort.channelTitle}</span>
                </div>
                {/* Channel row */}
                <div className="flex items-center gap-2 mb-1.5">
                  <button
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0 border border-white/20"
                    style={{ backgroundColor: currentShort.channelColor }}
                    onClick={() => openChannel(currentShort.channelTitle)}
                    aria-label={`Go to ${currentShort.channelTitle} channel`}
                  >
                    {currentShort.channelInitial}
                  </button>
                  <span
                    className="text-white text-[13px] font-medium cursor-pointer hover:opacity-80 truncate max-w-[140px]"
                    onClick={() => openChannel(currentShort.channelTitle)}
                  >
                    {currentShort.channelTitle}
                  </span>
                  <Button
                    size="sm"
                    className={`h-7 text-[11px] px-3 rounded-full font-medium shrink-0 transition-all duration-200 ${
                      isSubscribed
                        ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                        : 'bg-[#ff0000] text-white hover:bg-[#cc0000]'
                    }`}
                    onClick={handleSubscribe}
                  >
                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                  </Button>
                </div>
                {/* Title */}
                <p className="text-white text-[13px] line-clamp-2 leading-4">
                  {currentShort.title}
                </p>
              </div>
            </div>

            {/* Navigation arrows (center) */}
            {currentShortIndex > 0 && (
              <button
                onClick={goPrev}
                className="absolute top-3 left-1/2 -translate-x-1/2 z-10 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-150 text-white/80 hover:text-white active:scale-90"
                aria-label="Previous short"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            )}
            {currentShortIndex < totalShorts - 1 && (
              <button
                onClick={goNext}
                className="absolute bottom-[120px] left-1/2 -translate-x-1/2 z-10 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-150 text-white/80 hover:text-white active:scale-90"
                aria-label="Next short"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            )}

            {/* Swipe up indicator */}
            {showSwipeHint && currentShortIndex < totalShorts - 1 && (
              <div className="absolute bottom-[140px] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 animate-swipe-hint">
                <ChevronDown className="w-4 h-4 text-white/60" />
                <span className="text-white/60 text-[11px] font-medium">Swipe up</span>
              </div>
            )}

            {/* Paused overlay */}
          </div>

          {/* Right-side action bar */}
          <div className="flex flex-col items-center gap-3 ml-2 pt-4 sm:ml-3">
            {/* Like */}
            <button
              onClick={handleLike}
              className="flex flex-col items-center gap-0.5 group relative"
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              <div className={`p-2 rounded-full transition-all duration-200 active:scale-90 ${isLiked ? 'bg-white/20 scale-110' : 'hover:bg-white/10'}`}>
                <ThumbsUp className={`w-6 h-6 transition-colors duration-200 ${isLiked ? 'text-white' : 'text-white/80 group-hover:text-white'}`} fill={isLiked ? 'white' : 'none'} />
              </div>
              <span className="text-white/80 text-[11px] relative">
                {formatNumber(isLiked ? (parseInt(currentShort.likes || '0', 10) + 1).toString() : currentShort.likes || '0')}
                {likeAnimating && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-[11px] font-bold animate-fly-up">
                    +1
                  </span>
                )}
              </span>
            </button>

            {/* Dislike */}
            <button
              className="flex flex-col items-center gap-0.5 group"
              aria-label="Dislike"
            >
              <div className="p-2 rounded-full hover:bg-white/10 transition-all duration-200 active:scale-90">
                <ThumbsDown className="w-6 h-6 text-white/80 group-hover:text-white" />
              </div>
              <span className="text-white/80 text-[11px]">Dislike</span>
            </button>

            {/* Comment */}
            <button
              onClick={handleComment}
              className="flex flex-col items-center gap-0.5 group"
              aria-label="Comments"
            >
              <div className="p-2 rounded-full hover:bg-white/10 transition-all duration-200 active:scale-90">
                <MessageCircle className="w-6 h-6 text-white/80 group-hover:text-white" />
              </div>
              <span className="text-white/80 text-[11px]">{comments.length > 5 ? `${comments.length - 5}K` : comments.length}</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-0.5 group"
              aria-label="Share"
            >
              <div className="p-2 rounded-full hover:bg-white/10 transition-all duration-200 active:scale-90">
                <Share2 className="w-6 h-6 text-white/80 group-hover:text-white" />
              </div>
              <span className="text-white/80 text-[11px]">Share</span>
            </button>

            {/* Remix */}
            <button
              onClick={handleRemix}
              className="flex flex-col items-center gap-0.5 group"
              aria-label="Remix"
            >
              <div className="p-2 rounded-full hover:bg-white/10 transition-all duration-200 active:scale-90">
                <Repeat2 className="w-6 h-6 text-white/80 group-hover:text-white" />
              </div>
              <span className="text-white/80 text-[11px]">Remix</span>
            </button>

            {/* Save / Watch Later */}
            <button
              onClick={handleSave}
              className="flex flex-col items-center gap-0.5 group"
              aria-label={isSaved ? 'Remove from Watch later' : 'Save'}
            >
              <div className={`p-2 rounded-full transition-all duration-200 active:scale-90 ${isSaved ? 'bg-white/20 scale-110' : 'hover:bg-white/10'}`}>
                <svg className={`w-6 h-6 transition-colors duration-200 ${isSaved ? 'text-white' : 'text-white/80 group-hover:text-white'}`} viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <span className="text-white/80 text-[11px]">Save</span>
            </button>

            {/* Channel avatar (rounded with ring) */}
            <div className="mt-1 relative">
              <button
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ring-2 ring-white/30 overflow-hidden transition-transform duration-200 hover:scale-110"
                style={{ backgroundColor: currentShort.channelColor }}
                onClick={() => openChannel(currentShort.channelTitle)}
                aria-label={`Go to ${currentShort.channelTitle} channel`}
              >
                {currentShort.channelInitial}
              </button>
              {!isSubscribed && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#ff0000] rounded-full flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">+</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress indicator dots */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
          {Array.from({ length: Math.min(totalShorts, 10) }).map((_, i) => {
            const visualIndex = currentShortIndex < 5
              ? i
              : currentShortIndex >= totalShorts - 5
                ? totalShorts - 10 + i
                : currentShortIndex - 5 + i;
            if (visualIndex < 0 || visualIndex >= totalShorts) return null;
            return (
              <div
                key={visualIndex}
                className={`h-[2px] rounded-full transition-all duration-300 ${
                  visualIndex === currentShortIndex
                    ? 'w-4 bg-white animate-dot-glow'
                    : 'w-1.5 bg-white/30'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Comments Dialog */}
      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="sm:max-w-md bg-[#282828] border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Comments</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {comments.map((comment, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-medium shrink-0">
                  {comment.author.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-white">{comment.author}</span>
                    <span className="text-[11px] text-gray-400">{comment.time}</span>
                  </div>
                  <p className="text-[13px] text-gray-300 mt-0.5">{comment.text}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <button className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                      <ThumbsUp className="w-3 h-3" />
                      <span className="text-[11px]">{comment.likes > 1000 ? `${(comment.likes / 1000).toFixed(1)}K` : comment.likes}</span>
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                    <button className="text-[11px] text-gray-400 hover:text-white transition-colors">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-700">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-medium shrink-0">
              U
            </div>
            <div className="flex-1 flex gap-2">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="min-h-[36px] max-h-[80px] resize-none bg-transparent border-gray-600 text-white placeholder-gray-500 text-[13px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handlePostComment();
                  }
                }}
              />
              <Button
                size="sm"
                onClick={handlePostComment}
                disabled={!commentText.trim()}
                className="bg-[#3ea6ff] hover:bg-[#65b8ff] text-black rounded-full px-4 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
