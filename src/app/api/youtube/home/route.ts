import { NextResponse } from 'next/server';
import { ytMostPopular, CATEGORY_IDS, hasApiKey } from '@/lib/youtube-api';
import { getVideosByCategory } from '@/lib/youtube-data';
import type { Video } from '@/lib/youtube-data';

// ─── 30-minute cache ─────────────────────────────────────────────────────────
interface CacheEntry { data: Video[]; timestamp: number }
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 2 * 60 * 1000; // 2-min cache — fresh on every realistic refresh

function fromCache(key: string): Video[] | null {
  const e = cache.get(key);
  if (!e) return null;
  if (Date.now() - e.timestamp > CACHE_TTL) { cache.delete(key); return null; }
  return e.data;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'All';
  const maxResults = Math.min(parseInt(searchParams.get('maxResults') || '50', 10), 50);

  const cacheKey = `home:${category}:${maxResults}`;
  const cached = fromCache(cacheKey);
  if (cached) return NextResponse.json({ videos: cached, cached: true });

  if (hasApiKey()) {
    try {
      const categoryId = CATEGORY_IDS[category] ?? undefined;
      const videos = await ytMostPopular(maxResults, categoryId);
      if (videos.length > 0) {
        cache.set(cacheKey, { data: videos, timestamp: Date.now() });
        return NextResponse.json({ videos, cached: false });
      }
    } catch (err) {
      console.error('[home] YouTube API error:', err);
    }
  }

  // Local fallback
  const videos = getVideosByCategory(category);
  return NextResponse.json({ videos, cached: false, fallback: true });
}
