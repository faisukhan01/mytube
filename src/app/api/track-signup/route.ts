import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const webhookUrl = process.env.SHEETS_WEBHOOK_URL;
  if (!webhookUrl) return NextResponse.json({ ok: false, reason: 'no webhook configured' });

  try {
    const body = await request.json();
    // Use GET with query params — Apps Script POST redirects are unreliable
    const url = new URL(webhookUrl);
    url.searchParams.set('name', body.name || '');
    url.searchParams.set('email', body.email || '');
    url.searchParams.set('action', body.action || '');
    await fetch(url.toString(), { method: 'GET', redirect: 'follow' });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
