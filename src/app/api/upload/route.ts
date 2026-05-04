import { NextRequest, NextResponse } from 'next/server';

type Uploader = (file: File) => Promise<string>;

const uploaders: Uploader[] = [
  // catbox.moe — permanent hosting
  async (file) => {
    const fd = new FormData();
    fd.append('reqtype', 'fileupload');
    fd.append('fileToUpload', file);
    const res = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: fd,
      signal: AbortSignal.timeout(8000),
    });
    const text = (await res.text()).trim();
    if (!text.startsWith('https://')) throw new Error(`catbox: ${text}`);
    return text;
  },

  // litterbox — temp 72h fallback
  async (file) => {
    const fd = new FormData();
    fd.append('reqtype', 'fileupload');
    fd.append('time', '72h');
    fd.append('fileToUpload', file);
    const res = await fetch('https://litterbox.catbox.moe/resources/internals/api.php', {
      method: 'POST',
      body: fd,
      signal: AbortSignal.timeout(8000),
    });
    const text = (await res.text()).trim();
    if (!text.startsWith('https://')) throw new Error(`litterbox: ${text}`);
    return text;
  },

  // 0x0.st — second fallback
  async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('https://0x0.st', {
      method: 'POST',
      body: fd,
      signal: AbortSignal.timeout(8000),
    });
    const text = (await res.text()).trim();
    if (!text.startsWith('https://') && !text.startsWith('http://')) throw new Error(`0x0: ${text}`);
    return text;
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
        console.warn('[/api/upload] service failed, trying next:', (e as Error).message);
      }
    }

    return NextResponse.json({ error: 'All upload services failed' }, { status: 502 });
  } catch (err) {
    console.error('[/api/upload]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
