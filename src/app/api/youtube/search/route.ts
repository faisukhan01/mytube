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
      query: `site:youtube.com ${query}`,
      num: 20,
    });

    // Parse search results to extract YouTube video data
    const videos = (Array.isArray(searchResult) ? searchResult : [])
      .filter((r: { url?: string }) => r.url && r.url.includes('youtube.com/watch'))
      .map((r: { url?: string; name?: string; snippet?: string }, index: number) => {
        const url = r.url || '';
        const videoId = extractVideoId(url);
        if (!videoId) return null;

        return {
          id: videoId,
          title: r.name || 'Untitled Video',
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          channelTitle: extractChannelName(r.snippet || ''),
          channelAvatar: '',
          channelId: `channel-${index}`,
          channelInitial: (r.name || 'U').charAt(0).toUpperCase(),
          channelColor: getRandomColor(),
          views: `${Math.floor(Math.random() * 10 + 1)}M views`,
          publishedAt: `${Math.floor(Math.random() * 11 + 1)} months ago`,
          duration: `${Math.floor(Math.random() * 15 + 1)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          description: r.snippet || '',
          category: 'Search',
        };
      })
      .filter(Boolean);

    // Add local results that aren't already in the API results
    const localResults = searchLocalVideos(query);
    const combinedResults = [...videos, ...localResults.filter(
      (local) => !videos.some((v) => v && v.id === local.id)
    )];

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

function extractChannelName(description: string): string {
  const match = description.match(/^([^•\n]+)/);
  return match ? match[1].trim().substring(0, 30) : 'YouTube Channel';
}

function getRandomColor(): string {
  const colors = ['#FF0000', '#FF4500', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#00BCD4', '#E91E63'];
  return colors[Math.floor(Math.random() * colors.length)];
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
