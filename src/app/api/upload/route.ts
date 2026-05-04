import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const incoming = await req.formData();
    const file = incoming.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Max 10 MB guard
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 413 });
    }

    // Proxy to catbox.moe (server-side — no CORS restriction)
    const fd = new FormData();
    fd.append('reqtype', 'fileupload');
    fd.append('fileToUpload', file);

    const upstream = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: fd,
    });

    const text = (await upstream.text()).trim();

    if (!text.startsWith('https://')) {
      return NextResponse.json({ error: 'Upload service returned unexpected response' }, { status: 502 });
    }

    return NextResponse.json({ url: text });
  } catch (err) {
    console.error('[/api/upload]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
