import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const webhookUrl = process.env.SHEETS_WEBHOOK_URL;
  if (!webhookUrl) return NextResponse.json({ ok: false, reason: 'no webhook configured' });

  try {
    const body = await request.json();
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
