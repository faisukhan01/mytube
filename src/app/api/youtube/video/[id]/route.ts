import { NextResponse } from 'next/server';
import { getVideoById, getCommentsForVideo, getRelatedVideos } from '@/lib/youtube-data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const video = getVideoById(id);

  if (!video) {
    return NextResponse.json({ error: 'Video not found' }, { status: 404 });
  }

  const comments = getCommentsForVideo(id);
  const relatedVideos = getRelatedVideos(id);

  return NextResponse.json({ video, comments, relatedVideos });
}
