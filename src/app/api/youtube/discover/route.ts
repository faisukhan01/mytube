import { NextResponse } from 'next/server';
import { ytMostPopular, ytSearch, CATEGORY_IDS, hasApiKey } from '@/lib/youtube-api';
import type { Video } from '@/lib/youtube-data';

// ─── 30-minute cache ─────────────────────────────────────────────────────────
interface CacheEntry { data: Video[]; timestamp: number }
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 30 * 60 * 1000;

function fromCache(key: string): Video[] | null {
  const e = cache.get(key);
  if (!e) return null;
  if (Date.now() - e.timestamp > CACHE_TTL) { cache.delete(key); return null; }
  return e.data;
}

// Fallback search queries for categories when mostPopular returns nothing
const CATEGORY_QUERIES: Record<string, string> = {
  Music: 'trending music videos 2025',
  Gaming: 'popular gaming videos 2025',
  Programming: 'programming tutorials 2025',
  Science: 'science education videos 2025',
  Cooking: 'cooking recipes 2025',
  Sports: 'sports highlights 2025',
  Entertainment: 'entertainment videos 2025',
  Comedy: 'funny comedy videos 2025',
  News: 'news today 2025',
  Movies: 'movie trailers 2025',
  Fashion: 'fashion beauty 2025',
  Fitness: 'workout fitness 2025',
  Learning: 'educational videos 2025',
  Travel: 'travel vlog 2025',
  'Recently uploaded': 'latest viral videos 2025',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || '';
  const query    = searchParams.get('query')    || '';
  const limit    = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10), 1), 50);

  if (!category && !query) {
    return NextResponse.json({ videos: [], error: 'category or query required' }, { status: 400 });
  }

  const cacheKey = `discover:${category || query}:${limit}`;
  const cached = fromCache(cacheKey);
  if (cached) return NextResponse.json({ videos: cached, cached: true });

  if (!hasApiKey()) {
    return NextResponse.json({ videos: [], error: 'YOUTUBE_API_KEY not configured' });
  }

  try {
    let videos: Video[] = [];

    // Try mostPopular with videoCategoryId first (1 quota unit — very cheap)
    const categoryId = CATEGORY_IDS[category];
    if (categoryId) {
      videos = await ytMostPopular(limit, categoryId);
    }

    // If no results, fall back to a search query
    if (videos.length === 0) {
      const q = query || CATEGORY_QUERIES[category] || `${category} videos 2025`;
      videos = await ytSearch(q, limit);
    }

    cache.set(cacheKey, { data: videos, timestamp: Date.now() });
    return NextResponse.json({ videos, cached: false });
  } catch (err) {
    console.error('[discover] YouTube API error:', err);
    return NextResponse.json({ videos: [], error: 'Failed to fetch videos' });
  }
}
