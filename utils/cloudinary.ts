// Browser-side Cloudinary helpers.
//
// 1. `uploadToCloudinary` sends a base64 image to our serverless `/api/upload`
//    endpoint (which holds the secret) and returns a CDN URL. If the endpoint
//    is unavailable (e.g. local `vite` dev without serverless functions), it
//    gracefully falls back to the original base64 string so uploads never break.
//
// 2. `optimizeImage` rewrites a Cloudinary delivery URL to add automatic format
//    (WebP/AVIF) + quality compression and optional resizing. Non-Cloudinary
//    URLs (and local /public assets) are returned untouched.

type UploadFolder = 'portfolio/projects' | 'portfolio/blog' | 'portfolio/power' | 'portfolio/misc';

export async function uploadToCloudinary(
  dataUrl: string,
  folder: UploadFolder = 'portfolio/misc',
): Promise<string> {
  // Nothing to upload / already a hosted URL.
  if (!dataUrl || !dataUrl.startsWith('data:image')) return dataUrl;

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl, folder }),
    });
    if (!res.ok) throw new Error(`Upload failed (${res.status})`);
    const json = await res.json();
    if (json?.url) return json.url as string;
    throw new Error('No URL returned');
  } catch (err) {
    // Fallback: keep the base64 so the save still works (e.g. local dev).
    console.warn('Cloudinary upload unavailable, falling back to inline image:', err);
    return dataUrl;
  }
}

const CLOUDINARY_HOST = 'res.cloudinary.com';

interface OptimizeOptions {
  width?: number;
  /** crop/fit mode; defaults to a quality-preserving `limit` (never upscales). */
  crop?: 'limit' | 'fill' | 'fit' | 'scale';
}

export function optimizeImage(url: string, opts: OptimizeOptions = {}): string {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes(CLOUDINARY_HOST) || !url.includes('/upload/')) return url;
  // Already transformed by us — leave it alone.
  if (/\/upload\/[^/]*f_auto/.test(url)) return url;

  const parts: string[] = ['f_auto', 'q_auto'];
  if (opts.width) parts.push(`w_${Math.round(opts.width)}`, `c_${opts.crop || 'limit'}`);
  const transform = parts.join(',');

  return url.replace('/upload/', `/upload/${transform}/`);
}
