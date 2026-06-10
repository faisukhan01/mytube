import { NextResponse } from 'next/server';
import { ytSearch, hasApiKey } from '@/lib/youtube-api';
import { shortsVideos } from '@/lib/youtube-data';
import type { Video } from '@/lib/youtube-data';

interface CacheEntry { data: Video[]; timestamp: number }
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 15 * 60 * 1000; // 15 min

function fromCache(key: string): Video[] | null {
  const e = cache.get(key);
  if (!e) return null;
  if (Date.now() - e.timestamp > CACHE_TTL) { cache.delete(key); return null; }
  return e.data;
}

// Shorts are short-form vertical videos (< 60 seconds)
const SHORTS_QUERIES = ['shorts viral 2024', 'youtube shorts funny', 'shorts trending'];

export async function GET() {
  const cached = fromCache('shorts');
  if (cached) return NextResponse.json({ videos: cached, cached: true });

  if (hasApiKey()) {
    try {
      const query = SHORTS_QUERIES[Math.floor(Math.random() * SHORTS_QUERIES.length)];
      const videos = await ytSearch(query, 50);
      // Filter to short-form videos (under ~2 min)
      const shorts = videos.filter(v => {
        if (v.duration === 'LIVE') return false;
        const parts = v.duration.split(':').map(Number);
        const secs = parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0] * 3600 + parts[1] * 60 + parts[2];
        return secs <= 180; // under 3 min qualifies as short-form
      });
      const result = shorts.length > 5 ? shorts : videos.slice(0, 30);
      cache.set('shorts', { data: result, timestamp: Date.now() });
      return NextResponse.json({ videos: result, cached: false });
    } catch (err) {
      console.error('[shorts] YouTube API error:', err);
    }
  }

  return NextResponse.json({ videos: shortsVideos, cached: false, fallback: true });
}
