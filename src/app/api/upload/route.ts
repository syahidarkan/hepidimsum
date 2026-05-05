import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(req: NextRequest) {
  try {
    const incoming = await req.formData();
    const file = incoming.get('file') as File | null;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 413 });

    const blob = await put(`bukti-bayar/${Date.now()}-${file.name}`, file, {
      access: 'public',
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error('[/api/upload]', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
