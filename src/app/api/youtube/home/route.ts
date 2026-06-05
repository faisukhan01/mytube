import { NextResponse } from 'next/server';
import { homeVideos, shortsVideos, getVideosByCategory } from '@/lib/youtube-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'All';

  const videos = getVideosByCategory(category);

  return NextResponse.json({ videos });
}
