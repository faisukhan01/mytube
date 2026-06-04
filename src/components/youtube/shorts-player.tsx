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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// YouTube IFrame API types
interface YTPlayerEvent {
  data: number;
  target: unknown;
}

interface YTPlayer {
  destroy: () => void;
}

declare global {
  interface Window {
    YT?: {
      Player: new (elementId: string, config: {
        events: {
          onReady: () => void;
          onStateChange: (event: YTPlayerEvent) => void;
        };
      }) => YTPlayer;
      PlayerState: {
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

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
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const playerRef = useRef<YTPlayer | null>(null);

  const totalShorts = shortsVideos.length;
  const currentShort = shortsVideos[currentShortIndex];

  const goNext = useCallback(() => {
    if (currentShortIndex < totalShorts - 1) {
      setCurrentShortIndex(currentShortIndex + 1);
      setShowSwipeHint(false);
    }
  }, [currentShortIndex, totalShorts, setCurrentShortIndex]);

  const goPrev = useCallback(() => {
    if (currentShortIndex > 0) {
      setCurrentShortIndex(currentShortIndex - 1);
      setShowSwipeHint(false);
    }
  }, [currentShortIndex, setCurrentShortIndex]);

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
              // Player is ready
            },
            onStateChange: (event: YTPlayerEvent) => {
              // Auto-advance when video ends (state 0)
              if (event.data === 0) {
                setCurrentShortIndex((prev: number) => {
                  if (prev < totalShorts - 1) return prev + 1;
                  return prev;
                });
              }
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
        goHome();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, goHome]);

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
    const timer = setTimeout(() => setShowSwipeHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!currentShort) return null;

  const isLiked = likedVideos.includes(currentShort.id);
  const isSaved = watchLater.includes(currentShort.id);

  // Extract video ID (remove any "dup-" prefix used for deduplication)
  const videoId = currentShort.id.replace(/^dup-\d+-/, '');

  const handleLike = () => {
    toggleLike(currentShort.id);
    if (!isLiked) {
      toast.success('Added to Liked videos');
    } else {
      toast.info('Removed from Liked videos');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${videoId}`).then(() => {
      toast.success('Link copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const handleRemix = () => {
    toast.info('Remix feature coming soon');
  };

  const handleComment = () => {
    toast.info('Comments panel coming soon');
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    toast.success(isSubscribed ? 'Unsubscribed' : 'Subscribed!');
  };

  const handleSave = () => {
    toggleWatchLater(currentShort.id);
    toast.success(isSaved ? 'Removed from Watch later' : 'Saved to Watch later');
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#0f0f0f] dark:bg-[#0f0f0f] flex items-start justify-center">
      {/* Back button */}
      <button
        onClick={goHome}
        className="fixed top-16 left-2 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

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
          <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl">
            {/* YouTube iframe embed */}
            <iframe
              id="shorts-yt-player"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={currentShort.title}
              key={currentShort.id}
            />

            {/* Bottom gradient overlay for text readability */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
              {/* Channel info and title */}
              <div className="p-3 pb-4">
                {/* Channel row */}
                <div className="flex items-center gap-2 mb-2">
                  <button
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0"
                    style={{ backgroundColor: currentShort.channelColor }}
                    onClick={() => openChannel(currentShort.channelTitle)}
                    aria-label={`Go to ${currentShort.channelTitle} channel`}
                  >
                    {currentShort.channelInitial}
                  </button>
                  <span
                    className="text-white text-sm font-medium cursor-pointer hover:opacity-80 truncate max-w-[160px]"
                    onClick={() => openChannel(currentShort.channelTitle)}
                  >
                    {currentShort.channelTitle}
                  </span>
                  <Button
                    size="sm"
                    variant={isSubscribed ? 'outline' : 'default'}
                    className={`h-7 text-xs px-3 rounded-full font-medium shrink-0 ${
                      isSubscribed
                        ? 'bg-transparent text-white border-white/30 hover:bg-white/10'
                        : 'bg-white text-black hover:bg-gray-200'
                    }`}
                    onClick={handleSubscribe}
                  >
                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                  </Button>
                </div>
                {/* Title */}
                <p className="text-white text-sm line-clamp-2 leading-5">
                  {currentShort.title}
                </p>
              </div>
            </div>

            {/* Navigation arrows (center) */}
            {currentShortIndex > 0 && (
              <button
                onClick={goPrev}
                className="absolute top-3 left-1/2 -translate-x-1/2 z-10 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white/80 hover:text-white"
                aria-label="Previous short"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            )}
            {currentShortIndex < totalShorts - 1 && (
              <button
                onClick={goNext}
                className="absolute bottom-[140px] left-1/2 -translate-x-1/2 z-10 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white/80 hover:text-white"
                aria-label="Next short"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            )}

            {/* Swipe up indicator */}
            {showSwipeHint && currentShortIndex < totalShorts - 1 && (
              <div className="absolute bottom-[160px] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 animate-bounce">
                <ChevronDown className="w-4 h-4 text-white/60" />
                <span className="text-white/60 text-[11px] font-medium">Swipe up</span>
              </div>
            )}
          </div>

          {/* Right-side action bar */}
          <div className="flex flex-col items-center gap-4 ml-2 pt-4 sm:ml-3">
            {/* Like */}
            <button
              onClick={handleLike}
              className="flex flex-col items-center gap-0.5 group"
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              <div className={`p-2 rounded-full transition-colors ${isLiked ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                <ThumbsUp className={`w-6 h-6 ${isLiked ? 'text-white' : 'text-white/80 group-hover:text-white'}`} fill={isLiked ? 'white' : 'none'} />
              </div>
              <span className="text-white/80 text-[11px]">{currentShort.likes || '0'}</span>
            </button>

            {/* Dislike */}
            <button
              className="flex flex-col items-center gap-0.5 group"
              aria-label="Dislike"
            >
              <div className="p-2 rounded-full hover:bg-white/10 transition-colors">
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
              <div className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <MessageCircle className="w-6 h-6 text-white/80 group-hover:text-white" />
              </div>
              <span className="text-white/80 text-[11px]">Comments</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-0.5 group"
              aria-label="Share"
            >
              <div className="p-2 rounded-full hover:bg-white/10 transition-colors">
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
              <div className="p-2 rounded-full hover:bg-white/10 transition-colors">
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
              <div className={`p-2 rounded-full transition-colors ${isSaved ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                <svg className={`w-6 h-6 ${isSaved ? 'text-white' : 'text-white/80 group-hover:text-white'}`} viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <span className="text-white/80 text-[11px]">Save</span>
            </button>

            {/* Channel avatar (rounded with ring) */}
            <div className="mt-1">
              <button
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ring-2 ring-white/30 overflow-hidden"
                style={{ backgroundColor: currentShort.channelColor }}
                onClick={() => openChannel(currentShort.channelTitle)}
                aria-label={`Go to ${currentShort.channelTitle} channel`}
              >
                {currentShort.channelInitial}
              </button>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
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
                className={`h-0.5 rounded-full transition-all duration-300 ${
                  visualIndex === currentShortIndex
                    ? 'w-4 bg-white'
                    : 'w-1.5 bg-white/30'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
