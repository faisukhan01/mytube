import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import type { Video } from '@/lib/youtube-data';

// In-memory cache with TTL
interface CacheEntry {
  data: Video[];
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getFromCache(key: string): Video[] | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: Video[]) {
  cache.set(key, { data, timestamp: Date.now() });
  // Evict old entries if cache is too large
  if (cache.size > 100) {
    const oldest = [...cache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp);
    for (let i = 0; i < 20; i++) {
      cache.delete(oldest[i][0]);
    }
  }
}

const channelColors = [
  '#FF0000', '#FF4500', '#2196F3', '#4CAF50', '#FF9800',
  '#9C27B0', '#00BCD4', '#E91E63', '#3F51B5', '#009688',
  '#FF5722', '#607D8B', '#795548', '#673AB7', '#F44336',
];

function getChannelColor(channelTitle: string): string {
  let hash = 0;
  for (let i = 0; i < channelTitle.length; i++) {
    hash = channelTitle.charCodeAt(i) + ((hash << 5) - hash);
  }
  return channelColors[Math.abs(hash) % channelColors.length];
}

function extractVideoId(url: string): string | null {
  // Standard youtube.com/watch?v=VIDEO_ID
  const standardMatch = url.match(/[?&]v=([^&]+)/);
  if (standardMatch) return standardMatch[1];
  // Short youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return shortMatch[1];
  // Embed youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/youtube\.com\/embed\/([^?&]+)/);
  if (embedMatch) return embedMatch[1];
  // Shorts youtube.com/shorts/VIDEO_ID
  const shortsMatch = url.match(/youtube\.com\/shorts\/([^?&]+)/);
  if (shortsMatch) return shortsMatch[1];
  return null;
}

function extractChannelName(snippet: string, name: string): string {
  // Try to extract channel name from snippet (often "Channel Name - 1M views - 2 years ago" or "Channel Name • 1M views • 2 years ago")
  if (snippet) {
    // Try dash separator first
    const dashParts = snippet.split(/\s*[-–—]\s*/);
    if (dashParts.length > 1) {
      const candidate = dashParts[0].trim();
      if (candidate.length > 0 && candidate.length < 60 && !candidate.match(/^\d/)) {
        return candidate;
      }
    }
    // Try bullet separator
    const bulletParts = snippet.split('•');
    if (bulletParts.length > 0) {
      const candidate = bulletParts[0].trim();
      if (candidate.length > 0 && candidate.length < 60 && !candidate.match(/^\d/)) {
        return candidate;
      }
    }
  }
  // Fallback: try to extract from the video title pattern "Channel - Title"
  if (name) {
    const dashMatch = name.match(/^(.+?)\s*[-–—]\s*/);
    if (dashMatch && dashMatch[1].length < 40) {
      return dashMatch[1].trim();
    }
  }
  return 'YouTube Channel';
}

function formatRandomViews(): string {
  const num = Math.floor(Math.random() * 900 + 1);
  if (num > 100) return `${(num / 100).toFixed(1)}M views`;
  return `${num}K views`;
}

function formatRandomTime(): string {
  const options = [
    '1 day ago', '3 days ago', '1 week ago', '2 weeks ago',
    '1 month ago', '3 months ago', '6 months ago', '1 year ago',
    '2 years ago', '5 years ago',
  ];
  return options[Math.floor(Math.random() * options.length)];
}

function formatRandomDuration(): string {
  const hours = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;
  const minutes = hours > 0
    ? Math.floor(Math.random() * 60)
    : Math.floor(Math.random() * 25) + 1;
  const seconds = String(Math.floor(Math.random() * 60)).padStart(2, '0');
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

// Category-specific search query mappings
const categoryQueryMap: Record<string, string> = {
  'Music': 'popular music videos youtube 2025',
  'Gaming': 'popular gaming videos youtube 2025',
  'Programming': 'programming tutorials youtube 2025',
  'Science': 'science videos youtube 2025',
  'Cooking': 'cooking recipes youtube 2025',
  'Sports': 'sports highlights youtube 2025',
  'Entertainment': 'entertainment videos youtube 2025',
  'Comedy': 'comedy videos youtube 2025',
  'News': 'news videos youtube 2025',
  'Podcasts': 'podcast episodes youtube 2025',
  'Live': 'live stream youtube 2025',
  'Movies': 'movie trailers youtube 2025',
  'Fashion': 'fashion beauty youtube 2025',
  'Fitness': 'fitness workout youtube 2025',
  'Learning': 'learning educational youtube 2025',
  'Travel': 'travel vlog youtube 2025',
  'Recently uploaded': 'new videos youtube 2025',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10), 1), 50);

  // Build the search query
  let searchQuery = query;
  if (!searchQuery && category && categoryQueryMap[category]) {
    searchQuery = categoryQueryMap[category];
  }
  if (!searchQuery) {
    return NextResponse.json({ videos: [], error: 'Query or category parameter is required' }, { status: 400 });
  }

  // Check cache
  const cacheKey = `discover:${searchQuery}:${limit}`;
  const cached = getFromCache(cacheKey);
  if (cached) {
    return NextResponse.json({ videos: cached, cached: true });
  }

  try {
    const zai = await ZAI.create();
    const searchResult = await zai.functions.invoke('web_search', {
      query: `site:youtube.com ${searchQuery}`,
      num: limit + 10, // Request extra to account for non-video results
    });

    const results = Array.isArray(searchResult) ? searchResult : [];

    // Extract YouTube video IDs from results
    const seenIds = new Set<string>();
    const apiVideos: Video[] = [];

    for (const r of results) {
      if (!r.url || !r.name) continue;

      const videoId = extractVideoId(r.url);
      if (!videoId || seenIds.has(videoId)) continue;
      seenIds.add(videoId);

      const channelTitle = extractChannelName(r.snippet || '', r.name || '');

      const video: Video = {
        id: videoId,
        title: r.name || 'Untitled Video',
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        channelTitle,
        channelAvatar: '',
        channelId: channelTitle.toLowerCase().replace(/[^a-z0-9]/g, ''),
        channelInitial: channelTitle.charAt(0).toUpperCase(),
        channelColor: getChannelColor(channelTitle),
        views: formatRandomViews(),
        publishedAt: formatRandomTime(),
        duration: formatRandomDuration(),
        description: r.snippet || '',
        category: category || 'Discover',
        likes: `${Math.floor(Math.random() * 900 + 100)}K`,
        subscribers: `${Math.floor(Math.random() * 50 + 1)}M`,
      };

      apiVideos.push(video);

      if (apiVideos.length >= limit) break;
    }

    // Cache the results
    setCache(cacheKey, apiVideos);

    return NextResponse.json({ videos: apiVideos, cached: false });
  } catch (error) {
    console.error('Discover API error:', error);
    return NextResponse.json({
      videos: [],
      error: 'Failed to fetch videos from web search',
    });
  }
}
