import { NextRequest, NextResponse } from 'next/server';

type Uploader = (file: File) => Promise<string>;

const uploaders: Uploader[] = [
  // Vercel Blob — paling reliable, butuh BLOB_READ_WRITE_TOKEN di env
  async (file) => {
    if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error('no blob token');
    const { put } = await import('@vercel/blob');
    const blob = await put(`bukti-bayar/${Date.now()}-${file.name}`, file, { access: 'public' });
    return blob.url;
  },

  // file.io — temporary 1 week, no auth needed
  async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('https://file.io/?expires=1w', {
      method: 'POST',
      body: fd,
      signal: AbortSignal.timeout(8000),
    });
    const json = await res.json();
    if (!json.success || !json.link) throw new Error(`file.io: ${JSON.stringify(json)}`);
    return json.link as string;
  },

  // tmpfiles.org — fallback
  async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: fd,
      signal: AbortSignal.timeout(8000),
    });
    const json = await res.json();
    if (!json.data?.url) throw new Error(`tmpfiles: ${JSON.stringify(json)}`);
    return (json.data.url as string).replace('tmpfiles.org/', 'tmpfiles.org/dl/');
  },
];

export async function POST(req: NextRequest) {
  try {
    const incoming = await req.formData();
    const file = incoming.get('file') as File | null;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 413 });

    for (const uploader of uploaders) {
      try {
        const url = await uploader(file);
        return NextResponse.json({ url });
      } catch (e) {
        console.warn('[/api/upload] service failed:', (e as Error).message);
      }
    }

    return NextResponse.json({ error: 'All upload services failed' }, { status: 502 });
  } catch (err) {
    console.error('[/api/upload]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
