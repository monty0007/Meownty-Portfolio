// Serverless image-upload endpoint (Vercel function).
//
// Accepts a base64 data URL from the Admin panel and uploads it to Cloudinary
// using the server-side CLOUDINARY_URL secret (never exposed to the browser).
// Returns the resulting CDN URL.
//
// POST /api/upload
//   body: { dataUrl: string, folder?: string, publicId?: string }
//   ->    { url: string }
//
// Required env var (set in Vercel Project Settings):
//   CLOUDINARY_URL = cloudinary://<api_key>:<api_secret>@<cloud_name>

import { v2 as cloudinary } from 'cloudinary';

type VercelRequest = {
  method?: string;
  body?: any;
  headers: Record<string, string | string[] | undefined>;
};
type VercelResponse = {
  setHeader: (k: string, v: string) => void;
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
  end: (body?: string) => void;
};

const ALLOWED_FOLDERS = new Set([
  'portfolio/projects',
  'portfolio/blog',
  'portfolio/power',
  'portfolio/misc',
]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!process.env.CLOUDINARY_URL) {
    res.status(500).json({ error: 'CLOUDINARY_URL is not configured on the server' });
    return;
  }

  // Parse CLOUDINARY_URL explicitly: calling config({...}) otherwise wipes the
  // credentials the SDK auto-loads from the env var.
  try {
    const u = new URL(process.env.CLOUDINARY_URL);
    cloudinary.config({
      cloud_name: u.hostname,
      api_key: decodeURIComponent(u.username),
      api_secret: decodeURIComponent(u.password),
      secure: true,
    });
  } catch {
    res.status(500).json({ error: 'Invalid CLOUDINARY_URL on the server' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const dataUrl: string = body.dataUrl;
    const folder: string = ALLOWED_FOLDERS.has(body.folder) ? body.folder : 'portfolio/misc';

    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) {
      res.status(400).json({ error: 'A base64 image dataUrl is required' });
      return;
    }

    const result = await cloudinary.uploader.upload(dataUrl, {
      folder,
      ...(body.publicId ? { public_id: String(body.publicId), overwrite: true } : {}),
      resource_type: 'image',
    });

    res.status(200).json({ url: result.secure_url });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Upload failed' });
  }
}
