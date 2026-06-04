import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { homeVideos, shortsVideos } from '@/lib/youtube-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    const zai = await ZAI.create();
    const searchResult = await zai.functions.invoke('web_search', {
      query: `youtube.com ${query}`,
      num: 20,
    });

    // Parse search results to extract YouTube video data
    const apiVideos = (Array.isArray(searchResult) ? searchResult : [])
      .filter((r: { url?: string }) => r.url && r.url.includes('youtube.com/watch'))
      .map((r: { url?: string; name?: string; snippet?: string; host_name?: string }, index: number) => {
        const url = r.url || '';
        const videoId = extractVideoId(url);
        if (!videoId) return null;

        return {
          id: videoId,
          title: r.name || 'Untitled Video',
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          channelTitle: extractChannelName(r.snippet || '', r.name || ''),
          channelAvatar: '',
          channelId: `ch-${videoId}`,
          channelInitial: (r.name || 'U').charAt(0).toUpperCase(),
          channelColor: getRandomColor(),
          views: formatRandomViews(),
          publishedAt: formatRandomTime(),
          duration: formatRandomDuration(),
          description: r.snippet || '',
          category: 'Search',
        };
      })
      .filter(Boolean);

    // Deduplicate by video ID
    const seenIds = new Set(apiVideos.map((v: { id: string } | null) => v?.id));
    const localResults = searchLocalVideos(query);
    const uniqueLocalResults = localResults.filter((v) => !seenIds.has(v.id));
    const combinedResults = [...apiVideos, ...uniqueLocalResults];

    return NextResponse.json({ videos: combinedResults });
  } catch (error) {
    console.error('Search API error:', error);
    // Fallback to local search
    const localResults = searchLocalVideos(query);
    return NextResponse.json({ videos: localResults });
  }
}

function extractVideoId(url: string): string | null {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

function extractChannelName(snippet: string, name: string): string {
  // Try to extract channel name from snippet (often "Channel Name • 1M views • 2 years ago")
  if (snippet) {
    const parts = snippet.split('•');
    if (parts.length > 0) {
      const candidate = parts[0].trim();
      if (candidate.length > 0 && candidate.length < 50) {
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

function getRandomColor(): string {
  const colors = ['#FF0000', '#FF4500', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#00BCD4', '#E91E63'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function formatRandomViews(): string {
  const num = Math.floor(Math.random() * 900 + 1);
  if (num > 100) return `${(num / 100).toFixed(1)}M views`;
  return `${num}K views`;
}

function formatRandomTime(): string {
  const options = ['1 day ago', '3 days ago', '1 week ago', '2 weeks ago', '1 month ago', '3 months ago', '6 months ago', '1 year ago', '2 years ago', '5 years ago'];
  return options[Math.floor(Math.random() * options.length)];
}

function formatRandomDuration(): string {
  const minutes = Math.floor(Math.random() * 25 + 1);
  const seconds = String(Math.floor(Math.random() * 60)).padStart(2, '0');
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
