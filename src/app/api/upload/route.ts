import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const incoming = await req.formData();
    const file = incoming.get('file') as File | null;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 413 });

    // Convert file to base64 for ImgBB
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    // ImgBB — reliable, works from Vercel servers
    const imgbbKey = process.env.IMGBB_API_KEY;
    if (imgbbKey) {
      try {
        const fd = new FormData();
        fd.append('key', imgbbKey);
        fd.append('image', base64);
        fd.append('name', `bukti-${Date.now()}`);
        const res = await fetch('https://api.imgbb.com/1/upload', {
          method: 'POST',
          body: fd,
          signal: AbortSignal.timeout(15000),
        });
        const json = await res.json();
        if (json.success && json.data?.url) {
          return NextResponse.json({ url: json.data.url as string });
        }
        console.error('[upload] imgbb failed:', json);
      } catch (e) {
        console.error('[upload] imgbb error:', e);
      }
    }

    // Vercel Blob fallback
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (blobToken) {
      try {
        const { put } = await import('@vercel/blob');
        const blob = await put(`bukti-bayar/${Date.now()}-${file.name}`, file, { access: 'public' });
        return NextResponse.json({ url: blob.url });
      } catch (e) {
        console.error('[upload] vercel blob error:', e);
      }
    }

    console.error('[upload] no working service. IMGBB_API_KEY set:', !!imgbbKey, 'BLOB_TOKEN set:', !!blobToken);
    return NextResponse.json({ error: 'All upload services failed' }, { status: 502 });

  } catch (err) {
    console.error('[upload] unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
