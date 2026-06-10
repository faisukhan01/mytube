import type { Video } from './youtube-data';

const YT_API_BASE = 'https://www.googleapis.com/youtube/v3';

export function hasApiKey(): boolean {
  return Boolean(process.env.YOUTUBE_API_KEY);
}

function apiKey(): string {
  return process.env.YOUTUBE_API_KEY || '';
}

// YouTube videoCategoryId → our category name
const YT_CATEGORY_MAP: Record<string, string> = {
  '1': 'Movies', '2': 'Vehicles', '10': 'Music', '15': 'Pets',
  '17': 'Sports', '18': 'Short Films', '19': 'Travel', '20': 'Gaming',
  '22': 'People', '23': 'Comedy', '24': 'Entertainment',
  '25': 'News', '26': 'Fashion', '27': 'Learning', '28': 'Science',
  '29': 'Nonprofits',
};

// Our category name → YouTube videoCategoryId
export const CATEGORY_IDS: Record<string, string> = {
  Music: '10', Gaming: '20', Sports: '17', Comedy: '23',
  News: '25', Entertainment: '24', Science: '28', Learning: '27',
  Movies: '1', Travel: '19', Fashion: '26', Programming: '28',
  Fitness: '26',
};

// ISO 8601 duration → "4:33" / "1:30:15"
function parseDuration(iso: string): string {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return '0:00';
  const h = parseInt(m[1] || '0');
  const min = parseInt(m[2] || '0');
  const s = parseInt(m[3] || '0');
  if (h > 0) return `${h}:${String(min).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${min}:${String(s).padStart(2, '0')}`;
}

// Number → "1.2M views" / "345K views"
function formatViews(count: string | number): string {
  const n = typeof count === 'string' ? parseInt(count) : count;
  if (isNaN(n)) return '0 views';
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B views`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K views`;
  return `${n} views`;
}

// Number → "1.2M" / "345K" (no "views" suffix, for likes)
function formatCount(count: string | number): string {
  return formatViews(count).replace(' views', '');
}

// ISO date → "3 days ago"
function formatPublishedAt(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = diff / 1000;
  const m = s / 60, h = m / 60, d = h / 24, w = d / 7, mo = d / 30, y = d / 365;
  if (y >= 1) return `${Math.floor(y)} year${Math.floor(y) > 1 ? 's' : ''} ago`;
  if (mo >= 1) return `${Math.floor(mo)} month${Math.floor(mo) > 1 ? 's' : ''} ago`;
  if (w >= 1) return `${Math.floor(w)} week${Math.floor(w) > 1 ? 's' : ''} ago`;
  if (d >= 1) return `${Math.floor(d)} day${Math.floor(d) > 1 ? 's' : ''} ago`;
  if (h >= 1) return `${Math.floor(h)} hour${Math.floor(h) > 1 ? 's' : ''} ago`;
  return `${Math.max(1, Math.floor(m))} minute${Math.floor(m) > 1 ? 's' : ''} ago`;
}

const CHANNEL_COLORS = [
  '#FF0000', '#FF4500', '#2196F3', '#4CAF50', '#FF9800',
  '#9C27B0', '#00BCD4', '#E91E63', '#3F51B5', '#009688',
  '#FF5722', '#607D8B', '#795548', '#673AB7', '#F44336',
];

function channelColor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h);
  return CHANNEL_COLORS[Math.abs(h) % CHANNEL_COLORS.length];
}

// Converts a YouTube API video item (from videos.list or search.list) to our Video shape.
// `item` can be a full videos.list item or a search.list item with { id: { videoId } }.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapVideo(item: any, fallbackCategory = 'Entertainment'): Video {
  const videoId: string = typeof item.id === 'string' ? item.id : item.id?.videoId ?? '';
  const snippet = item.snippet ?? {};
  const details = item.contentDetails ?? {};
  const stats = item.statistics ?? {};
  const liveBroadcast: string = snippet.liveBroadcastContent ?? '';

  const thumbs = snippet.thumbnails ?? {};
  const thumbnail: string =
    thumbs.maxres?.url ?? thumbs.high?.url ?? thumbs.medium?.url ??
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const channelTitle: string = snippet.channelTitle ?? 'YouTube Channel';
  const channelId: string = snippet.channelId ?? '';
  const catId: string = snippet.categoryId ?? '';
  const category = YT_CATEGORY_MAP[catId] ?? fallbackCategory;

  const duration = liveBroadcast === 'live'
    ? 'LIVE'
    : details.duration ? parseDuration(details.duration) : '0:00';

  return {
    id: videoId,
    title: snippet.title ?? 'Untitled',
    thumbnail,
    channelTitle,
    channelAvatar: '',
    channelId,
    channelInitial: channelTitle.charAt(0).toUpperCase(),
    channelColor: channelColor(channelId || channelTitle),
    views: stats.viewCount ? formatViews(stats.viewCount) : '—',
    publishedAt: snippet.publishedAt ? formatPublishedAt(snippet.publishedAt) : '—',
    duration,
    description: snippet.description ?? '',
    category,
    likes: stats.likeCount ? formatCount(stats.likeCount) : undefined,
  };
}

// ─── Public API functions ────────────────────────────────────────────────────

/**
 * Search YouTube for videos matching `query`.
 * Calls search.list (100 units) then videos.list (1 unit) for full details.
 */
export async function ytSearch(query: string, maxResults = 20): Promise<Video[]> {
  const key = apiKey();
  if (!key) throw new Error('YOUTUBE_API_KEY not set');

  const searchUrl =
    `${YT_API_BASE}/search?part=snippet&q=${encodeURIComponent(query)}` +
    `&type=video&maxResults=${maxResults}&key=${key}&safeSearch=none`;

  const searchRes = await fetch(searchUrl, { next: { revalidate: 600 } });
  if (!searchRes.ok) {
    const err = await searchRes.json();
    throw new Error(err?.error?.message ?? 'YouTube search failed');
  }
  const searchData = await searchRes.json();
  const items: { id: { videoId: string } }[] = searchData.items ?? [];
  if (!items.length) return [];

  // Enrich with duration + stats
  const ids = items.map(i => i.id.videoId).join(',');
  const detailRes = await fetch(
    `${YT_API_BASE}/videos?part=snippet,contentDetails,statistics&id=${ids}&key=${key}`,
    { next: { revalidate: 600 } },
  );

  if (!detailRes.ok) {
    // Return basic info without duration/stats
    return items.map(i => mapVideo(i, 'Search'));
  }

  const detailData = await detailRes.json();
  const detailMap = new Map<string, unknown>();
  for (const v of detailData.items ?? []) detailMap.set(v.id, v);

  return items
    .map(i => {
      const full = detailMap.get(i.id.videoId);
      return full ? mapVideo(full, 'Search') : mapVideo(i, 'Search');
    })
    .filter(v => v.id);
}

/**
 * Fetch YouTube's most-popular videos (chart=mostPopular).
 * Only costs 1 unit — very quota-efficient.
 */
export async function ytMostPopular(
  maxResults = 24,
  videoCategoryId?: string,
  regionCode = 'US',
): Promise<Video[]> {
  const key = apiKey();
  if (!key) throw new Error('YOUTUBE_API_KEY not set');

  let url =
    `${YT_API_BASE}/videos?part=snippet,contentDetails,statistics` +
    `&chart=mostPopular&maxResults=${maxResults}&regionCode=${regionCode}&key=${key}`;
  if (videoCategoryId) url += `&videoCategoryId=${videoCategoryId}`;

  const res = await fetch(url, { next: { revalidate: 1800 } }); // 30-min cache
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message ?? 'Failed to fetch popular videos');
  }
  const data = await res.json();
  return (data.items ?? []).map((v: unknown) => mapVideo(v));
}

/**
 * Fetch full details for a single video.
 */
export async function ytVideoDetails(videoId: string): Promise<Video | null> {
  const key = apiKey();
  if (!key) throw new Error('YOUTUBE_API_KEY not set');

  const res = await fetch(
    `${YT_API_BASE}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${key}`,
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) return null;
  const data = await res.json();
  const item = data.items?.[0];
  return item ? mapVideo(item) : null;
}

/**
 * Fetch related videos by searching with the first few words of the title.
 */
export async function ytRelatedVideos(title: string, maxResults = 15): Promise<Video[]> {
  const query = title.split(' ').slice(0, 6).join(' ');
  return ytSearch(query, maxResults);
}
