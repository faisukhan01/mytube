'use client';

import { useYouTubeStore } from '@/store/youtube-store';
import { homeVideos, shortsVideos } from '@/lib/youtube-data';
import VideoCard from './video-card';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import { Bell, Link as LinkIcon, MapPin, ChevronRight, Calendar, Eye, Users, Globe, Youtube, ListVideo, Info, Film, Home, Radio, MessageSquare, Play, Sparkles, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';

type ChannelTab = 'Home' | 'Videos' | 'Shorts' | 'Live' | 'Playlists' | 'Community' | 'About';

export default function ChannelView() {
  const { selectedChannel } = useYouTubeStore();
  const [activeTab, setActiveTab] = useState<ChannelTab>('Home');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [communityText, setCommunityText] = useState('');

  // Get channel videos from both homeVideos and shortsVideos
  const channelHomeVideos = useMemo(() => {
    return homeVideos.filter((v) => v.channelTitle === selectedChannel);
  }, [selectedChannel]);

  const channelShortsVideos = useMemo(() => {
    return shortsVideos.filter((v) => v.channelTitle === selectedChannel);
  }, [selectedChannel]);

  const allChannelVideos = useMemo(() => {
    return [...channelHomeVideos, ...channelShortsVideos];
  }, [channelHomeVideos, channelShortsVideos]);

  const channelInfo = useMemo(() => {
    if (allChannelVideos.length > 0) {
      return allChannelVideos[0];
    }
    return null;
  }, [allChannelVideos]);

  const channelColor = channelInfo?.channelColor || '#FF0000';
  const channelInitial = channelInfo?.channelInitial || selectedChannel.charAt(0).toUpperCase();
  const subscribers = channelInfo?.subscribers || '0';

  // Filter shorts (videos with duration under 1 minute)
  const channelShorts = useMemo(() => {
    return allChannelVideos.filter((v) => {
      const parts = v.duration.split(':');
      if (parts.length === 2) {
        const minutes = parseInt(parts[0], 10);
        return minutes === 0;
      }
      return false;
    });
  }, [allChannelVideos]);

  // Regular videos (not shorts, not live)
  const channelRegularVideos = useMemo(() => {
    return channelHomeVideos.filter((v) => {
      const parts = v.duration.split(':');
      if (parts.length === 2) {
        const minutes = parseInt(parts[0], 10);
        return minutes > 0;
      }
      return v.duration !== 'LIVE';
    });
  }, [channelHomeVideos]);

  // Live videos
  const channelLiveVideos = useMemo(() => {
    return allChannelVideos.filter((v) => v.duration === 'LIVE');
  }, [allChannelVideos]);

  // Recent videos for Home tab (latest uploads)
  const recentVideos = useMemo(() => {
    return channelHomeVideos.slice(0, 6);
  }, [channelHomeVideos]);

  // Most popular video for Home tab hero
  const featuredVideo = useMemo(() => {
    return channelHomeVideos[0] || null;
  }, [channelHomeVideos]);

  const tabs: { key: ChannelTab; label: string; icon?: React.ReactNode }[] = [
    { key: 'Home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { key: 'Videos', label: 'Videos', icon: <Play className="w-4 h-4" /> },
    { key: 'Shorts', label: 'Shorts', icon: <Sparkles className="w-4 h-4" /> },
    { key: 'Live', label: 'Live', icon: <Radio className="w-4 h-4" /> },
    { key: 'Playlists', label: 'Playlists', icon: <ListVideo className="w-4 h-4" /> },
    { key: 'Community', label: 'Community', icon: <MessageSquare className="w-4 h-4" /> },
    { key: 'About', label: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  // Generate a consistent total views based on channel name
  const totalViews = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < selectedChannel.length; i++) {
      hash = selectedChannel.charCodeAt(i) + ((hash << 5) - hash);
    }
    const views = (Math.abs(hash) % 900 + 100);
    return `${views}M`;
  }, [selectedChannel]);

  // Generate a consistent join date
  const joinDate = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < selectedChannel.length; i++) {
      hash = selectedChannel.charCodeAt(i) + ((hash << 3) - hash);
    }
    const years = ['2015', '2016', '2017', '2018', '2019', '2020'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = years[Math.abs(hash) % years.length];
    const month = months[Math.abs(hash >> 4) % months.length];
    const day = (Math.abs(hash >> 8) % 28) + 1;
    return `${month} ${day}, ${year}`;
  }, [selectedChannel]);

  // Generate location
  const location = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < selectedChannel.length; i++) {
      hash = selectedChannel.charCodeAt(i) + ((hash << 3) - hash);
    }
    const locations = ['United States', 'United Kingdom', 'South Korea', 'Japan', 'Canada', 'Australia', 'Germany', 'Brazil', 'India', 'Sweden'];
    return locations[Math.abs(hash) % locations.length];
  }, [selectedChannel]);

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Channel Banner - Gradient using channel color */}
      <div className="h-[120px] sm:h-[150px] md:h-[200px] relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${channelColor}cc, ${channelColor}88, ${channelColor}44)`,
            transform: 'translateZ(0)',
            transition: 'transform 0.1s ease-out',
          }}
        />
        <div className="absolute inset-0 bg-black/10" />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Channel Info */}
      <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Avatar with ring */}
          <div className="relative -mt-12 sm:-mt-8 shrink-0">
            <div
              className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full flex items-center justify-center text-white font-bold text-3xl md:text-4xl ring-4 ring-white dark:ring-[#0f0f0f]"
              style={{ backgroundColor: channelColor }}
            >
              {channelInitial}
            </div>
          </div>

          {/* Name & Stats */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {selectedChannel}
              </h1>
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
              <span>@{selectedChannel.toLowerCase().replace(/\s+/g, '')}</span>
              <span>•</span>
              <span>{subscribers} subscribers</span>
              <span>•</span>
              <span>{allChannelVideos.length} videos</span>
            </div>

            {/* Description snippet */}
            {channelInfo && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                {channelInfo.description}
              </p>
            )}

            {/* Links */}
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <button className="flex items-center gap-1 text-sm text-blue-700 dark:text-blue-400 hover:underline">
                <LinkIcon className="w-3.5 h-3.5" />
                youtube.com
              </button>
              <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-3.5 h-3.5" />
                {location}
              </span>
              <button className="flex items-center gap-0.5 text-sm text-blue-700 dark:text-blue-400 hover:underline">
                More about this channel <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Subscribe button - YouTube red */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={() => setIsSubscribed(!isSubscribed)}
              variant="default"
              className={`rounded-full text-sm font-medium px-6 h-10 transition-colors ripple-container ${
                isSubscribed
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                  : 'bg-[#ff0000] hover:bg-[#cc0000] text-white'
              }`}
            >
              {isSubscribed ? (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Subscribed
                </span>
              ) : (
                'Subscribe'
              )}
            </Button>
            {isSubscribed && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
                {showNotifDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-[#282828] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f3f3f]">
                      <Bell className="w-4 h-4" /> All notifications
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f3f3f]">
                      <Bell className="w-4 h-4 opacity-50" /> Personalized notifications
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f3f3f]">
                      <Bell className="w-4 h-4 opacity-20" /> None
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 md:px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-black dark:border-white text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 md:p-6">
        {/* Home Tab */}
        {activeTab === 'Home' && (
          <div className="space-y-8">
            {/* Featured video */}
            {featuredVideo && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Featured</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${featuredVideo.id}?rel=0`}
                      title={featuredVideo.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{featuredVideo.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{featuredVideo.views} • {featuredVideo.publishedAt}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 line-clamp-3">{featuredVideo.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Recent uploads */}
            {recentVideos.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent uploads</h2>
                  <button
                    onClick={() => setActiveTab('Videos')}
                    className="flex items-center gap-1 text-sm font-medium text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    View all <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
                  {recentVideos.map((video) => (
                    <VideoCard key={video.id} video={video} layout="grid" />
                  ))}
                </div>
              </div>
            )}

            {/* Shorts section on Home */}
            {channelShorts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Shorts</h2>
                  <button
                    onClick={() => setActiveTab('Shorts')}
                    className="flex items-center gap-1 text-sm font-medium text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    View all <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
                  {channelShorts.slice(0, 6).map((video) => (
                    <div key={video.id} className="shrink-0 w-[180px]">
                      <VideoCard video={video} layout="shorts" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {allChannelVideos.length === 0 && (
              <div className="flex flex-col items-center py-20">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4"
                  style={{ backgroundColor: channelColor }}
                >
                  {channelInitial}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No videos found for this channel</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">Check back later for new content</p>
              </div>
            )}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'Videos' && (
          <>
            {channelRegularVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                {channelRegularVideos.map((video) => (
                  <VideoCard key={video.id} video={video} layout="grid" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-20">
                <Film className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No videos yet</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">This channel hasn&apos;t uploaded any videos</p>
              </div>
            )}
          </>
        )}

        {/* Shorts Tab */}
        {activeTab === 'Shorts' && (
          <>
            {channelShorts.length > 0 ? (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
                      <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Shorts</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {channelShorts.map((video) => (
                    <div key={video.id}>
                      <VideoCard video={video} layout="shorts" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-20">
                <div className="w-16 h-16 bg-red-600 rounded flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
                    <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No shorts available</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">This channel hasn&apos;t posted any shorts yet</p>
              </div>
            )}
          </>
        )}

        {/* Live Tab */}
        {activeTab === 'Live' && (
          <>
            {channelLiveVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                {channelLiveVideos.map((video) => (
                  <VideoCard key={video.id} video={video} layout="grid" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-20">
                <Radio className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No live streams</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">This channel hasn&apos;t gone live recently</p>
              </div>
            )}
          </>
        )}

        {/* Playlists Tab */}
        {activeTab === 'Playlists' && (
          <div className="flex flex-col items-center py-20">
            <ListVideo className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No playlists yet</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">This channel hasn&apos;t created any playlists</p>
          </div>
        )}

        {/* Community Tab */}
        {activeTab === 'Community' && (
          <div className="max-w-[800px] space-y-6">
            {/* Create post */}
            <div className="bg-white dark:bg-[#272727] rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: channelColor }}
                >
                  {channelInitial}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedChannel}</span>
              </div>
              <textarea
                value={communityText}
                onChange={(e) => setCommunityText(e.target.value)}
                placeholder="Share something with your audience..."
                className="w-full resize-none border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-sm bg-transparent dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-500"
                rows={3}
              />
              {communityText && (
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setCommunityText('');
                      toast.success('Post shared');
                    }}
                    className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Post
                  </Button>
                </div>
              )}
            </div>

            {/* Sample community posts */}
            {[
              {
                id: '1',
                timeAgo: '3 days ago',
                text: `Thanks for ${subscribers} subscribers! 🎉 We couldn't have done it without each and every one of you. New content coming soon!`,
                likes: Math.floor(Math.random() * 5000 + 1000),
                comments: Math.floor(Math.random() * 200 + 20),
              },
              {
                id: '2',
                timeAgo: '1 week ago',
                text: 'What kind of content would you like to see next? Drop your suggestions in the comments! 👇',
                likes: Math.floor(Math.random() * 3000 + 500),
                comments: Math.floor(Math.random() * 150 + 30),
              },
              {
                id: '3',
                timeAgo: '2 weeks ago',
                text: 'New video dropping this weekend! Make sure to turn on notifications so you don\'t miss it. 🔔',
                likes: Math.floor(Math.random() * 4000 + 800),
                comments: Math.floor(Math.random() * 100 + 15),
              },
            ].map((post) => (
              <div key={post.id} className="bg-white dark:bg-[#272727] rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: channelColor }}
                  >
                    {channelInitial}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedChannel}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{post.timeAgo}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-300">{post.text}</p>
                <div className="flex items-center gap-6 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-xs">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs">{post.comments}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'About' && (
          <div className="max-w-[800px] space-y-6">
            {/* Description */}
            <div className="bg-gray-50 dark:bg-[#272727] rounded-xl p-5">
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {channelInfo?.description || 'No description available.'}
              </p>
            </div>

            {/* Stats */}
            <div className="bg-gray-50 dark:bg-[#272727] rounded-xl p-5">
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Stats</h3>
              <div className="flex items-center gap-3 text-sm animate-counter-up">
                <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">
                  {totalViews} total views
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm animate-counter-up" style={{ animationDelay: '0.1s' }}>
                <Users className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{subscribers} subscribers</span>
              </div>
              <div className="flex items-center gap-3 text-sm animate-counter-up" style={{ animationDelay: '0.2s' }}>
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Joined {joinDate}</span>
              </div>
              <div className="flex items-center gap-3 text-sm animate-counter-up" style={{ animationDelay: '0.3s' }}>
                <Film className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{allChannelVideos.length} videos</span>
              </div>
              <div className="flex items-center gap-3 text-sm animate-counter-up" style={{ animationDelay: '0.4s' }}>
                <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{location}</span>
              </div>
            </div>

            {/* Links */}
            <div className="bg-gray-50 dark:bg-[#272727] rounded-xl p-5">
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Links</h3>
              <div className="space-y-2.5">
                <a href="#" className="flex items-center gap-3 text-sm text-blue-700 dark:text-blue-400 hover:underline">
                  <Youtube className="w-4 h-4 shrink-0" />
                  youtube.com/@{selectedChannel.toLowerCase().replace(/\s+/g, '')}
                </a>
                <a href="#" className="flex items-center gap-3 text-sm text-blue-700 dark:text-blue-400 hover:underline">
                  <Globe className="w-4 h-4 shrink-0" />
                  {selectedChannel.toLowerCase().replace(/\s+/g, '')}.com
                </a>
                <a href="#" className="flex items-center gap-3 text-sm text-blue-700 dark:text-blue-400 hover:underline">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  @{selectedChannel.toLowerCase().replace(/\s+/g, '')}
                </a>
                <a href="#" className="flex items-center gap-3 text-sm text-blue-700 dark:text-blue-400 hover:underline">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  @{selectedChannel.toLowerCase().replace(/\s+/g, '')}
                </a>
              </div>
            </div>

            {/* Channel info summary */}
            <div className="bg-gray-50 dark:bg-[#272727] rounded-xl p-5">
              <div className="flex items-center gap-3 text-sm">
                <Info className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">
                  {totalViews} views • {allChannelVideos.length} videos • {subscribers} subscribers
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Empty state when no videos at all */}
        {allChannelVideos.length === 0 && activeTab !== 'About' && activeTab !== 'Playlists' && activeTab !== 'Community' && (
          <div className="flex flex-col items-center py-20">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4"
              style={{ backgroundColor: channelColor }}
            >
              {channelInitial}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No videos found for this channel</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">Check back later for new content</p>
          </div>
        )}
      </div>
    </div>
  );
}
