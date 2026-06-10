import { NextResponse } from 'next/server';
import { ytSearch, hasApiKey } from '@/lib/youtube-api';
import { homeVideos, shortsVideos } from '@/lib/youtube-data';
import type { Video } from '@/lib/youtube-data';

// ─── In-memory cache (5 min TTL) ────────────────────────────────────────────
interface CacheEntry { data: Video[]; timestamp: number }
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000;

function fromCache(key: string): Video[] | null {
  const e = cache.get(key);
  if (!e) return null;
  if (Date.now() - e.timestamp > CACHE_TTL) { cache.delete(key); return null; }
  return e.data;
}
function toCache(key: string, data: Video[]) {
  cache.set(key, { data, timestamp: Date.now() });
  if (cache.size > 100) {
    const oldest = [...cache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp);
    oldest.slice(0, 20).forEach(([k]) => cache.delete(k));
  }
}

// ─── Local search fallback ───────────────────────────────────────────────────
const STOP_WORDS = new Set([
  'the','and','for','in','of','to','a','an','is','it','on','at','by','or','as',
  'with','this','from','that','these','those','how','what','when','where','why',
  'who','which','will','can','would','could','should','have','has','had','do',
  'does','did','be','been','being','are','was','were','if','so','up','out',
  'about','into','just','now','than','not','but','no','any','all','very','my',
  'your','they','them','we','you','more','also','only','even','back','after',
  'best','top','new','official','video','videos','watch','learn','tutorial',
  'tutorials','guide','tips','tricks','beginners','beginner','advanced',
  'complete','course','full','make','build','get','using','see','show',
  '2019','2020','2021','2022','2023','2024','2025',
]);

// Maps user keywords → local category so "songs" → Music videos, "football" → Sports videos
const KEYWORD_CATEGORY: Record<string, string> = {
  // Music
  song:'Music', songs:'Music', music:'Music', mv:'Music', audio:'Music',
  pop:'Music', rap:'Music', hiphop:'Music', 'hip hop':'Music',
  rnb:'Music', 'r&b':'Music', rock:'Music', jazz:'Music', classical:'Music',
  kpop:'Music', 'k-pop':'Music', indie:'Music', singer:'Music', band:'Music',
  artist:'Music', playlist:'Music', album:'Music', track:'Music',
  bts:'Music', blackpink:'Music', eminem:'Music', drake:'Music',
  adele:'Music', rihanna:'Music', beyonce:'Music', shakira:'Music',
  // Gaming
  game:'Gaming', games:'Gaming', gaming:'Gaming', gameplay:'Gaming',
  gamer:'Gaming', playstation:'Gaming', ps5:'Gaming', xbox:'Gaming',
  minecraft:'Gaming', fortnite:'Gaming', gta:'Gaming', roblox:'Gaming',
  valorant:'Gaming', lol:'Gaming', 'league of legends':'Gaming',
  // Programming / Tech
  coding:'Programming', code:'Programming', developer:'Programming',
  software:'Programming', webdev:'Programming', 'web development':'Programming',
  javascript:'Programming', python:'Programming', java:'Programming',
  typescript:'Programming', react:'Programming', nodejs:'Programming',
  dsa:'Programming', algorithms:'Programming', 'data structures':'Programming',
  sql:'Programming', html:'Programming', css:'Programming', git:'Programming',
  // Sports
  football:'Sports', soccer:'Sports', basketball:'Sports', cricket:'Sports',
  tennis:'Sports', nba:'Sports', fifa:'Sports', sport:'Sports', sports:'Sports',
  messi:'Sports', ronaldo:'Sports', 'lebron james':'Sports', nfl:'Sports',
  baseball:'Sports', volleyball:'Sports', swimming:'Sports',
  // Cooking
  cooking:'Cooking', recipe:'Cooking', food:'Cooking', cook:'Cooking',
  chef:'Cooking', baking:'Cooking', bake:'Cooking', kitchen:'Cooking',
  dinner:'Cooking', breakfast:'Cooking', lunch:'Cooking', meal:'Cooking',
  // Science / Education
  science:'Science', physics:'Science', space:'Science', nasa:'Science',
  biology:'Science', chemistry:'Science', universe:'Science', astronomy:'Science',
  // Entertainment / Viral
  funny:'Entertainment', viral:'Entertainment', prank:'Entertainment',
  mrbeast:'Entertainment', challenge:'Entertainment', reaction:'Entertainment',
  vlog:'Entertainment', shorts:'Entertainment',
  // Comedy
  comedy:'Comedy', humor:'Comedy', comedian:'Comedy', stand:'Comedy',
};

function categoryFromQuery(q: string): string | null {
  if (KEYWORD_CATEGORY[q]) return KEYWORD_CATEGORY[q];
  for (const [kw, cat] of Object.entries(KEYWORD_CATEGORY)) {
    if (q.includes(kw)) return cat;
  }
  return null;
}

function localSearch(query: string): Video[] {
  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/).filter(w => w.length > 1 && !STOP_WORDS.has(w));
  const all = [...homeVideos, ...shortsVideos];
  const foundIds = new Set<string>();
  const scored: { video: Video; score: number }[] = [];

  // Pass 1: keyword text matching
  for (const v of all) {
    if (foundIds.has(v.id)) continue;
    const text = `${v.title} ${v.channelTitle} ${v.category} ${v.description}`.toLowerCase();
    let s = 0;
    if (text.includes(q)) s = 3;
    else if (words.length > 0 && words.every(w => text.includes(w))) s = 2;
    else if (words.length > 0 && words.some(w => text.includes(w))) s = 1;
    if (s > 0) { foundIds.add(v.id); scored.push({ video: v, score: s }); }
  }
  const textResults = scored.sort((a, b) => b.score - a.score).map(r => r.video);

  // Pass 2: category synonym fallback (e.g. "songs" → Music)
  if (textResults.length < 5) {
    const cat = categoryFromQuery(q);
    if (cat) {
      const catVideos = homeVideos
        .filter(v => v.category === cat && !foundIds.has(v.id))
        .slice(0, 20);
      const combined = [...textResults, ...catVideos];
      if (combined.length >= 5) return combined;
    }
  }

  // Pass 3: nothing matched at all → return popular videos so the page is never empty
  if (textResults.length === 0) {
    return homeVideos.slice(0, 20);
  }

  return textResults;
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);
  const limit  = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10), 1), 50);

  if (!query) return NextResponse.json({ error: 'q is required' }, { status: 400 });

  const cacheKey = `search:${query.toLowerCase()}`;
  const cached = fromCache(cacheKey);
  if (cached) {
    return NextResponse.json({ videos: cached.slice(offset, offset + limit), total: cached.length, offset, limit, cached: true });
  }

  // ── Try YouTube Data API ──────────────────────────────────────────────────
  if (hasApiKey()) {
    try {
      const videos = await ytSearch(query, 50);
      if (videos.length > 0) {
        toCache(cacheKey, videos);
        return NextResponse.json({ videos: videos.slice(offset, offset + limit), total: videos.length, offset, limit, cached: false });
      }
    } catch (err) {
      console.error('[search] YouTube API error:', err);
    }
  }

  // ── Local fallback ────────────────────────────────────────────────────────
  const results = localSearch(query);
  toCache(cacheKey, results);
  return NextResponse.json({ videos: results.slice(offset, offset + limit), total: results.length, offset, limit, cached: false });
}
