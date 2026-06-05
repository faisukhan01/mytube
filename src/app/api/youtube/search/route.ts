import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { homeVideos, shortsVideos } from '@/lib/youtube-data';
import type { Video } from '@/lib/youtube-data';

// In-memory cache with TTL for search results
interface CacheEntry {
  data: { videos: Video[]; total: number };
  timestamp: number;
}

const searchCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getFromCache(key: string): { videos: Video[]; total: number } | null {
  const entry = searchCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    searchCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: { videos: Video[]; total: number }) {
  searchCache.set(key, { data, timestamp: Date.now() });
  // Evict old entries if cache is too large
  if (searchCache.size > 100) {
    const oldest = [...searchCache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp);
    for (let i = 0; i < 20; i++) {
      searchCache.delete(oldest[i][0]);
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
  // Try to extract channel name from snippet
  if (snippet) {
    // Try dash separator
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

function searchLocalVideos(query: string) {
  const q = query.toLowerCase();
  const allVideos = [...homeVideos, ...shortsVideos];
  return allVideos.filter(
    (v: { title: string; channelTitle: string; category: string; description: string }) =>
      v.title.toLowerCase().includes(q) ||
      v.channelTitle.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q)
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10), 1), 50);

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  // Check cache first
  const cacheKey = `search:${query}`;
  const cached = getFromCache(cacheKey);

  if (cached) {
    const paginatedVideos = cached.videos.slice(offset, offset + limit);
    return NextResponse.json({
      videos: paginatedVideos,
      total: cached.total,
      offset,
      limit,
      cached: true,
    });
  }

  try {
    const zai = await ZAI.create();
    const searchResult = await zai.functions.invoke('web_search', {
      query: `youtube.com ${query}`,
      num: 20,
    });

    // Parse search results to extract YouTube video data
    const seenIds = new Set<string>();
    const apiVideos: Video[] = [];

    for (const r of (Array.isArray(searchResult) ? searchResult : [])) {
      if (!r.url) continue;

      const videoId = extractVideoId(r.url);
      if (!videoId || seenIds.has(videoId)) continue;
      seenIds.add(videoId);

      const channelTitle = extractChannelName(r.snippet || '', r.name || '');

      apiVideos.push({
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
        category: 'Search',
        likes: `${Math.floor(Math.random() * 900 + 100)}K`,
        subscribers: `${Math.floor(Math.random() * 50 + 1)}M`,
      });
    }

    // Combine with local results (deduplicated)
    const localResults = searchLocalVideos(query);
    const uniqueLocalResults = localResults.filter((v) => !seenIds.has(v.id));
    const combinedResults = [...apiVideos, ...uniqueLocalResults];

    // Cache the full combined results
    setCache(cacheKey, { videos: combinedResults, total: combinedResults.length });

    // Return paginated results
    const paginatedVideos = combinedResults.slice(offset, offset + limit);

    return NextResponse.json({
      videos: paginatedVideos,
      total: combinedResults.length,
      offset,
      limit,
      cached: false,
    });
  } catch (error) {
    console.error('Search API error:', error);
    // Fallback to local search
    const localResults = searchLocalVideos(query);

    // Cache local results too
    setCache(cacheKey, { videos: localResults, total: localResults.length });

    const paginatedVideos = localResults.slice(offset, offset + limit);

    return NextResponse.json({
      videos: paginatedVideos,
      total: localResults.length,
      offset,
      limit,
      cached: false,
    });
  }
}
