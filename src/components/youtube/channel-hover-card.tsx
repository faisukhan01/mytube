'use client';

import { useMemo } from 'react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { homeVideos, shortsVideos } from '@/lib/youtube-data';
import { useYouTubeStore } from '@/store/youtube-store';
import { Check } from 'lucide-react';

interface ChannelHoverCardProps {
  channelTitle: string;
  channelInitial: string;
  channelColor: string;
  children: React.ReactNode;
}

export default function ChannelHoverCard({
  channelTitle,
  channelInitial,
  channelColor,
  children,
}: ChannelHoverCardProps) {
  const { openChannel } = useYouTubeStore();

  // Aggregate channel info from all videos
  const channelInfo = useMemo(() => {
    const allVideos = [...homeVideos, ...shortsVideos];
    const channelVideos = allVideos.filter(
      (v) => v.channelTitle === channelTitle
    );
    const videoCount = channelVideos.length;
    // Sum up subscriber-like info from the video data
    const subscribers = channelVideos[0]?.subscribers || `${(Math.floor(Math.random() * 50) + 1)}K`;
    const handle = `@${channelTitle.toLowerCase().replace(/\s+/g, '')}`;
    const description = channelVideos[0]?.description
      ? channelVideos[0].description.substring(0, 120) + '...'
      : `Welcome to the official ${channelTitle} YouTube channel!`;

    return { videoCount, subscribers, handle, description };
  }, [channelTitle]);

  return (
    <HoverCard openDelay={500} closeDelay={200}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        side="bottom"
        align="start"
        className="w-80 p-4 bg-white dark:bg-[#282828] border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl"
      >
        <div className="flex items-start gap-3">
          {/* Large channel avatar */}
          <button
            className="shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold transition-transform hover:scale-105"
            style={{ backgroundColor: channelColor }}
            onClick={() => openChannel(channelTitle)}
            aria-label={`Go to ${channelTitle} channel`}
          >
            {channelInitial}
          </button>

          <div className="flex-1 min-w-0">
            {/* Channel name with verification badge */}
            <div className="flex items-center gap-1.5">
              <span
                className="text-[15px] font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 truncate"
                onClick={() => openChannel(channelTitle)}
              >
                {channelTitle}
              </span>
              <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>

            {/* @handle */}
            <p className="text-[12px] text-[#606060] dark:text-[#aaa] mt-0.5">
              {channelInfo.handle}
            </p>

            {/* Subscriber and video count */}
            <p className="text-[12px] text-[#606060] dark:text-[#aaa] mt-0.5">
              {channelInfo.subscribers} subscribers • {channelInfo.videoCount} videos
            </p>
          </div>
        </div>

        {/* Description snippet */}
        <p className="text-[12px] text-gray-600 dark:text-gray-400 mt-3 line-clamp-2 leading-4">
          {channelInfo.description}
        </p>

        {/* Subscribe button */}
        <div className="mt-3">
          <SubscribeButton channelTitle={channelTitle} />
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function SubscribeButton({ channelTitle }: { channelTitle: string }) {
  const { user } = useYouTubeStore();
  // Track subscription state locally per hover card
  const subscribedChannels = useYouTubeStore((s) => s.hiddenVideos); // reuse for tracking is not ideal, use local state
  // Using a simple approach: store subscribed channels in a module-level set
  const isSubscribed = subscribedChannelsLocal.has(channelTitle);

  const handleSubscribe = () => {
    if (isSubscribed) {
      subscribedChannelsLocal.delete(channelTitle);
    } else {
      subscribedChannelsLocal.add(channelTitle);
    }
    // Force re-render by triggering state update
    useYouTubeStore.setState((s) => ({
      hiddenVideos: [...s.hiddenVideos], // trigger re-render hack
    }));
  };

  return (
    <Button
      size="sm"
      onClick={handleSubscribe}
      className={`w-full rounded-full text-sm font-medium h-9 transition-all duration-200 ${
        isSubscribed
          ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          : 'bg-[#ff0000] hover:bg-[#cc0000] text-white'
      }`}
    >
      {isSubscribed ? (
        <span className="flex items-center gap-1">
          <Check className="w-4 h-4" /> Subscribed
        </span>
      ) : (
        'Subscribe'
      )}
    </Button>
  );
}

// Module-level set to track subscribed channels across hover cards
const subscribedChannelsLocal = new Set<string>();
