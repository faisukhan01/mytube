import { NextResponse } from 'next/server';
import { ytVideoDetails, ytRelatedVideos, hasApiKey } from '@/lib/youtube-api';
import { getVideoById, getCommentsForVideo, getRelatedVideos } from '@/lib/youtube-data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (hasApiKey()) {
    try {
      const [video, relatedVideos] = await Promise.all([
        ytVideoDetails(id),
        ytRelatedVideos('', 15).catch(() => []),
      ]);

      if (video) {
        // Fetch related by title now that we have it
        const related = await ytRelatedVideos(video.title, 15).catch(() => []);
        const comments = getCommentsForVideo(id); // keep generated comments
        return NextResponse.json({ video, comments, relatedVideos: related });
      }
    } catch (err) {
      console.error('[video/[id]] YouTube API error:', err);
    }
  }

  // Local fallback
  const video = getVideoById(id);
  if (!video) return NextResponse.json({ error: 'Video not found' }, { status: 404 });

  return NextResponse.json({
    video,
    comments: getCommentsForVideo(id),
    relatedVideos: getRelatedVideos(id),
  });
}
