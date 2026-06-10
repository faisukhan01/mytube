'use client';

import { useState, useMemo } from 'react';
import { useYouTubeStore } from '@/store/youtube-store';
import { homeVideos, shortsVideos } from '@/lib/youtube-data';
import VideoCard from './video-card';
import { Clock, ThumbsUp, Users, Play, X, ChevronDown, Search, Pause, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const allVideos = [...homeVideos, ...shortsVideos];

/* ─────────── Shared Empty State ─────────── */
function EmptyState({
  icon: Icon,
  title,
  description,
  onBrowse,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  onBrowse: () => void;
}) {
  return (
    <div className="flex flex-col items-center py-20 animate-fade-in">
      <div className="w-24 h-24 bg-gray-100 dark:bg-[#272727] rounded-full flex items-center justify-center mb-4">
        <Icon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">{title}</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-6 text-center max-w-xs">{description}</p>
      <Button
        onClick={onBrowse}
        variant="outline"
        className="rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 font-medium px-6"
      >
        Browse videos
      </Button>
    </div>
  );
}

/* ─────────── Auth Gate ─────────── */
function AuthGate({ icon: Icon, title, description, onSignIn }: {
  icon: React.ElementType;
  title: string;
  description: string;
  onSignIn: () => void;
}) {
  return (
    <div className="flex flex-col items-center py-20 animate-fade-in">
      <div className="w-24 h-24 bg-gray-100 dark:bg-[#272727] rounded-full flex items-center justify-center mb-4">
        <Icon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">{title}</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-6">{description}</p>
      <Button
        onClick={onSignIn}
        className="rounded-full bg-red-600 hover:bg-red-700 text-white font-medium px-6"
      >
        Sign in
      </Button>
    </div>
  );
}

function getDateGroup(index: number): string {
  if (index < 3) return 'Today';
  if (index < 7) return 'Yesterday';
  if (index < 15) return 'This week';
  if (index < 30) return 'This month';
  return 'Older';
}

/* ═══════════════════════════════════════════
   HISTORY VIEW
   ═══════════════════════════════════════════ */
export function HistoryView() {
  const { watchHistory, user, toggleAuthDialog, setCurrentView, removeFromHistory, clearHistory, historyPaused, toggleHistoryPaused, watchProgress } = useYouTubeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearDialog, setShowClearDialog] = useState(false);

  const historyVideos = watchHistory
    .map(id => allVideos.find(v => v.id === id))
    .filter(Boolean) as typeof allVideos;

  // Filter by search query
  const filteredVideos = searchQuery.trim()
    ? historyVideos.filter(v =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.channelTitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : historyVideos;

  // Group by date
  const groupedVideos = useMemo(() => {
    const groups: Record<string, typeof allVideos> = {};
    filteredVideos.forEach((video, index) => {
      const group = getDateGroup(index);
      if (!groups[group]) groups[group] = [];
      groups[group].push(video);
    });
    return groups;
  }, [filteredVideos]);

  if (!user) {
    return (
      <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-7 h-7 text-gray-700 dark:text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Watch history</h1>
        </div>
        <AuthGate
          icon={Clock}
          title="Sign in to see your watch history"
          description="Your watch history will show up here"
          onSignIn={toggleAuthDialog}
        />
      </div>
    );
  }

  const groupOrder = ['Today', 'Yesterday', 'This week', 'This month', 'Older'];

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Clock className="w-7 h-7 text-gray-700 dark:text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Watch history</h1>
        {historyVideos.length > 0 && (
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{historyVideos.length} videos</span>
        )}
      </div>

      {/* Controls bar */}
      {historyVideos.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          {/* Search within history */}
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search watch history"
              className="w-full pl-9 pr-8 py-2 text-sm bg-gray-100 dark:bg-[#272727] rounded-full outline-none focus:ring-2 focus:ring-[#1c62b9] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleHistoryPaused}
              className={`rounded-full text-sm font-medium ${
                historyPaused
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400'
                  : 'bg-[#f2f2f2] dark:bg-[#272727] border-0 text-gray-800 dark:text-gray-200 hover:bg-[#e5e5e5] dark:hover:bg-[#3f3f3f]'
              }`}
            >
              <Pause className="w-4 h-4 mr-1.5" />
              {historyPaused ? 'Resume history' : 'Pause history'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowClearDialog(true)}
              className="rounded-full text-sm font-medium bg-[#f2f2f2] dark:bg-[#272727] border-0 text-gray-800 dark:text-gray-200 hover:bg-[#e5e5e5] dark:hover:bg-[#3f3f3f]"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Clear all
            </Button>
          </div>
        </div>
      )}

      {historyPaused && (
        <div className="mb-4 px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">
            Watch history is paused. Videos you watch won&apos;t be saved to your history.
          </p>
        </div>
      )}

      {filteredVideos.length > 0 ? (
        <div className="space-y-8">
          {groupOrder.map(groupName => {
            const videos = groupedVideos[groupName];
            if (!videos || videos.length === 0) return null;
            return (
              <div key={groupName}>
                <h2 className="text-base font-medium text-gray-900 dark:text-white mb-3">{groupName}</h2>
                <div className="space-y-1">
                  {videos.map((video) => {
                    const progress = watchProgress[video.id] || 0;
                    return (
                      <div
                        key={video.id}
                        className="flex gap-3 items-start py-2 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors group relative"
                      >
                        {/* Thumbnail */}
                        <div
                          className="relative shrink-0 w-[120px] sm:w-[168px] h-[69px] sm:h-[94px] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer"
                          onClick={() => useYouTubeStore.getState().openVideo(video)}
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {video.duration !== 'LIVE' && (
                            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[12px] font-medium px-1 py-0.5 rounded-[4px]">
                              {video.duration}
                            </span>
                          )}
                          {/* Progress bar */}
                          {progress > 0 ? (
                            <div className="absolute bottom-0 left-0 h-[3px] bg-red-600 rounded-r" style={{ width: `${progress}%` }} />
                          ) : (
                            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-200 dark:bg-gray-700" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-5">{video.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white font-medium text-[10px]"
                              style={{ backgroundColor: video.channelColor }}
                              onClick={(e) => { e.stopPropagation(); useYouTubeStore.getState().openChannel(video.channelTitle); }}
                              aria-label={`Go to ${video.channelTitle} channel`}
                            >
                              {video.channelInitial}
                            </button>
                            <div>
                              <p className="text-[12px] text-[#606060] dark:text-[#aaa]">{video.channelTitle}</p>
                              <p className="text-[12px] text-[#606060] dark:text-[#aaa]">
                                {video.views} • {video.publishedAt}
                                {progress > 0 && <span className="text-red-600 dark:text-red-400 ml-1">• {progress}% watched</span>}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Remove from history button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromHistory(video.id);
                            toast.success('Removed from history');
                          }}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-full opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1"
                          aria-label="Remove from history"
                        >
                          <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Clock}
          title={searchQuery ? 'No results found' : 'No watch history'}
          description={searchQuery ? 'Try different search terms' : 'Videos you watch will show up here'}
          onBrowse={() => setCurrentView('home')}
        />
      )}

      {/* Clear history confirmation dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Clear watch history?</h2>
          </DialogHeader>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your watch history will be cleared. This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowClearDialog(false)} className="dark:text-gray-300">
              Cancel
            </Button>
            <Button
              onClick={() => {
                clearHistory();
                setShowClearDialog(false);
                toast.success('Watch history cleared');
              }}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full"
            >
              Clear history
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LIKED VIDEOS VIEW
   ═══════════════════════════════════════════ */
export function LikedView() {
  const { likedVideos, toggleLike, user, toggleAuthDialog, setCurrentView } = useYouTubeStore();
  const [sortBy, setSortBy] = useState<'recent' | 'liked'>('recent');

  const liked = likedVideos
    .map(id => allVideos.find(v => v.id === id))
    .filter(Boolean) as NonNullable<ReturnType<typeof allVideos.find>>[];

  // Sort videos
  const sortedLiked = useMemo(() => {
    if (sortBy === 'liked') {
      // Sort by views as a proxy for "most liked" (most popular)
      return [...liked].sort((a, b) => {
        const viewsA = parseInt(a.views.replace(/[^0-9]/g, '')) || 0;
        const viewsB = parseInt(b.views.replace(/[^0-9]/g, '')) || 0;
        return viewsB - viewsA;
      });
    }
    // Default: most recent (order in the likedVideos array)
    return liked;
  }, [liked, sortBy]);

  if (!user) {
    return (
      <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <ThumbsUp className="w-7 h-7 text-gray-700 dark:text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Liked videos</h1>
        </div>
        <AuthGate
          icon={ThumbsUp}
          title="Sign in to see your liked videos"
          description="Use the like button to like videos and they'll show up here"
          onSignIn={toggleAuthDialog}
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 dark:bg-[#272727] rounded-full flex items-center justify-center">
            <ThumbsUp className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Liked videos</h1>
            {sortedLiked.length > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{sortedLiked.length} videos</p>
            )}
          </div>
        </div>

        {sortedLiked.length > 0 && (
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'recent' | 'liked')}>
              <SelectTrigger className="h-8 text-xs gap-1 border-gray-300 dark:border-gray-600 bg-white dark:bg-[#272727]">
                <ChevronDown className="w-3.5 h-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most recent</SelectItem>
                <SelectItem value="liked">Most liked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {sortedLiked.length > 0 ? (
        <div className="space-y-1">
          {sortedLiked.map((video) => (
            <div key={video.id} className="group relative">
              <VideoCard video={video} layout="list" />
              {/* Remove from liked button on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(video.id);
                }}
                className="absolute top-3 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                aria-label="Remove from liked videos"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ThumbsUp}
          title="No liked videos yet"
          description="Videos you like will show up here. Click the like button on any video to add it."
          onBrowse={() => setCurrentView('home')}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   WATCH LATER VIEW
   ═══════════════════════════════════════════ */
export function WatchLaterView() {
  const { watchLater, toggleWatchLater, user, toggleAuthDialog, setCurrentView, openVideo } = useYouTubeStore();

  if (!user) {
    return (
      <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-7 h-7 text-gray-700 dark:text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Watch later</h1>
        </div>
        <AuthGate
          icon={Clock}
          title="Sign in to use Watch later"
          description="Save videos to watch later and they'll show up here"
          onSignIn={toggleAuthDialog}
        />
      </div>
    );
  }

  const videos = watchLater
    .map(id => allVideos.find(v => v.id === id))
    .filter(Boolean) as NonNullable<ReturnType<typeof allVideos.find>>[];

  const handlePlayAll = () => {
    if (videos.length > 0) {
      openVideo(videos[0]);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 dark:bg-[#272727] rounded-full flex items-center justify-center">
            <Clock className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Watch later</h1>
            {videos.length > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{videos.length} videos</p>
            )}
          </div>
        </div>

        {videos.length > 0 && (
          <Button
            onClick={handlePlayAll}
            className="rounded-full bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium px-5 h-9 flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            Play all
          </Button>
        )}
      </div>

      {videos.length > 0 ? (
        <div className="space-y-1">
          {videos.map((video) => (
            <div key={video.id} className="group relative">
              <VideoCard video={video} layout="list" />
              {/* Remove from Watch later button on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWatchLater(video.id);
                }}
                className="absolute top-3 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                aria-label="Remove from Watch later"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Clock}
          title="No videos yet"
          description="Save videos to watch later by clicking the clock icon on any video"
          onBrowse={() => setCurrentView('home')}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUBSCRIPTIONS VIEW
   ═══════════════════════════════════════════ */
export function SubscriptionsView() {
  const { user, toggleAuthDialog, setCurrentView, openChannel } = useYouTubeStore();
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  // Get unique channels from video data (simulating subscribed channels)
  const subscribedChannels = useMemo(() => {
    const channelMap = new Map<string, { title: string; color: string; initial: string; avatar: string; videoCount: number; hasLive: boolean }>();
    // Pick a diverse set of channels to simulate subscriptions
    const subscriptionChannels = [
      'MrBeast', 'Marques Brownlee', 'Veritasium', 'Fireship', 'Kurzgesagt',
      'Mark Wiens', 'The Dodo', 'Linus Tech Tips', 'Khan Academy', 'Gordon Ramsay',
      'Rick Astley', 'Ed Sheeran', 'Queen Official', 'Dream', 'PewDiePie',
    ];
    homeVideos.forEach(v => {
      if (subscriptionChannels.includes(v.channelTitle)) {
        const existing = channelMap.get(v.channelTitle);
        if (existing) {
          existing.videoCount += 1;
          if (v.duration === 'LIVE') existing.hasLive = true;
        } else {
          channelMap.set(v.channelTitle, {
            title: v.channelTitle,
            color: v.channelColor,
            initial: v.channelInitial,
            avatar: v.channelAvatar,
            videoCount: 1,
            hasLive: v.duration === 'LIVE',
          });
        }
      }
    });
    return Array.from(channelMap.values());
  }, []);

  // Get videos from subscribed channels
  const subscriptionVideos = useMemo(() => {
    const channelNames = subscribedChannels.map(c => c.title);
    let vids = homeVideos.filter(v => channelNames.includes(v.channelTitle));
    if (selectedChannel) {
      vids = vids.filter(v => v.channelTitle === selectedChannel);
    }
    return vids;
  }, [subscribedChannels, selectedChannel]);

  if (!user) {
    return (
      <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Subscriptions</h1>
        <AuthGate
          icon={Users}
          title="Sign in to see your subscriptions"
          description="Subscribe to your favorite channels and their videos will show up here"
          onSignIn={toggleAuthDialog}
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Subscriptions</h1>

      {subscribedChannels.length > 0 ? (
        <>
          {/* Channel avatars row - horizontal scrollable */}
          <div className="mb-6 -mx-4 px-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            <div className="flex gap-3 pb-2 min-w-max">
              {/* "All" chip */}
              <button
                onClick={() => setSelectedChannel(null)}
                className={`flex flex-col items-center gap-1.5 shrink-0 transition-all duration-200 ${
                  selectedChannel === null
                    ? 'opacity-100'
                    : 'opacity-70 hover:opacity-90'
                }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  selectedChannel === null
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 ring-2 ring-gray-900 dark:ring-white'
                    : 'bg-gray-200 dark:bg-[#3f3f3f] text-gray-700 dark:text-gray-300'
                }`}>
                  All
                </div>
                <span className={`text-[11px] max-w-[64px] truncate ${
                  selectedChannel === null
                    ? 'text-gray-900 dark:text-white font-medium'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  All
                </span>
              </button>

              {/* Channel avatars */}
              {subscribedChannels.map((channel) => (
                <button
                  key={channel.title}
                  onClick={() => setSelectedChannel(
                    selectedChannel === channel.title ? null : channel.title
                  )}
                  onDoubleClick={() => openChannel(channel.title)}
                  className={`flex flex-col items-center gap-1.5 shrink-0 transition-all duration-200 group ${
                    selectedChannel === channel.title
                      ? 'opacity-100'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-medium text-sm transition-all duration-200 ${
                      selectedChannel === channel.title
                        ? 'ring-2 ring-gray-900 dark:ring-white scale-105'
                        : 'group-hover:scale-105'
                    }`} style={{ backgroundColor: channel.color }}>
                      {channel.initial}
                    </div>
                    {/* Live indicator dot */}
                    {channel.hasLive && (
                      <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-600 rounded-full border-2 border-white dark:border-[#0f0f0f] animate-pulse" />
                    )}
                  </div>
                  <span className={`text-[11px] max-w-[64px] truncate ${
                    selectedChannel === channel.title
                      ? 'text-gray-900 dark:text-white font-medium'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {channel.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Filtered channel name */}
          {selectedChannel && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Showing videos from
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedChannel}
              </span>
              <button
                onClick={() => setSelectedChannel(null)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-[#272727] rounded-full transition-colors"
                aria-label="Clear filter"
              >
                <X className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
          )}

          {/* Videos grid */}
          {subscriptionVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
              {subscriptionVideos.map((video) => (
                <VideoCard key={video.id} video={video} layout="grid" />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No videos from this channel"
              description="This channel hasn't uploaded any videos recently"
              onBrowse={() => setCurrentView('home')}
            />
          )}
        </>
      ) : (
        <EmptyState
          icon={Users}
          title="No channels yet"
          description="Subscribe to your favorite channels and their latest videos will show up here"
          onBrowse={() => setCurrentView('home')}
        />
      )}
    </div>
  );
}
