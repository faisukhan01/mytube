import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('yt-user-id')?.value;

    if (!userId) {
      return NextResponse.json(
        { liked: [], watchlater: [], history: [] }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type && ['liked', 'watchlater', 'history'].includes(type)) {
      const videos = await db.userVideo.findMany({
        where: { userId, type },
        orderBy: { addedAt: 'desc' },
        select: { videoId: true, addedAt: true },
      });
      return NextResponse.json({ videos });
    }

    // Return all types
    const [liked, watchlater, history] = await Promise.all([
      db.userVideo.findMany({
        where: { userId, type: 'liked' },
        orderBy: { addedAt: 'desc' },
        select: { videoId: true },
      }),
      db.userVideo.findMany({
        where: { userId, type: 'watchlater' },
        orderBy: { addedAt: 'desc' },
        select: { videoId: true },
      }),
      db.userVideo.findMany({
        where: { userId, type: 'history' },
        orderBy: { addedAt: 'desc' },
        select: { videoId: true },
      }),
    ]);

    return NextResponse.json({
      liked: liked.map((v) => v.videoId),
      watchlater: watchlater.map((v) => v.videoId),
      history: history.map((v) => v.videoId),
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('yt-user-id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { videoId, type } = body;

    if (!videoId || !type) {
      return NextResponse.json(
        { error: 'videoId and type are required' },
        { status: 400 }
      );
    }

    if (!['liked', 'watchlater', 'history'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be liked, watchlater, or history' },
        { status: 400 }
      );
    }

    // For history, always add (don't duplicate due to unique constraint - it will fail silently)
    // For liked/watchlater, toggle behavior is handled by DELETE

    try {
      const userVideo = await db.userVideo.create({
        data: { userId, videoId, type },
      });
      return NextResponse.json(userVideo, { status: 201 });
    } catch {
      // Unique constraint violation - already exists
      return NextResponse.json(
        { error: 'Video already in list' },
        { status: 409 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('yt-user-id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { videoId, type } = body;

    if (!videoId || !type) {
      return NextResponse.json(
        { error: 'videoId and type are required' },
        { status: 400 }
      );
    }

    await db.userVideo.deleteMany({
      where: { userId, videoId, type },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
