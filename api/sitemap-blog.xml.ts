import { createClient } from '@libsql/client';

// Minimal Vercel handler typing (avoid adding @vercel/node dep)
type VercelRequest = { query: Record<string, string | string[]> };
type VercelResponse = {
    setHeader: (k: string, v: string) => void;
    status: (code: number) => VercelResponse;
    send: (body: string) => void;
};

const SITE = 'https://manishyadav.dev';

const escapeXml = (s: string) =>
    s.replace(/&/g, '&amp;')
     .replace(/</g, '&lt;')
     .replace(/>/g, '&gt;')
     .replace(/"/g, '&quot;')
     .replace(/'/g, '&apos;');

const toIsoDate = (raw: unknown): string => {
    try {
        const d = raw ? new Date(String(raw)) : new Date();
        if (Number.isNaN(d.getTime())) return new Date().toISOString();
        return d.toISOString();
    } catch {
        return new Date().toISOString();
    }
};

export default async function handler(_req: VercelRequest, res: VercelResponse) {
    const url =
        process.env.TURSO_DATABASE_URL ||
        process.env.VITE_TURSO_DATABASE_URL ||
        '';
    const authToken =
        process.env.TURSO_AUTH_TOKEN ||
        process.env.VITE_TURSO_AUTH_TOKEN ||
        undefined;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    // Cache at the edge for 1h, allow stale-while-revalidate for a day
    res.setHeader(
        'Cache-Control',
        'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400'
    );

    // If DB is not configured, return a valid empty sitemap so crawlers don't 500
    if (!url) {
        res.status(200).send(
            `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`
        );
        return;
    }

    try {
        const db = createClient({ url, authToken });

        // Pull only published (non-draft) posts. scheduled_date in the future is fine to exclude.
        const result = await db.execute({
            sql: `SELECT slug, created_at, image_url
                  FROM posts
                  WHERE COALESCE(is_draft, 0) = 0
                    AND (scheduled_date IS NULL OR scheduled_date = '' OR scheduled_date <= datetime('now'))
                  ORDER BY created_at DESC
                  LIMIT 5000`,
            args: [],
        });

        const urls = result.rows
            .map((row: any) => {
                const slug = String(row.slug || '').trim();
                if (!slug) return '';
                const loc = `${SITE}/blog/${encodeURIComponent(slug)}`;
                const lastmod = toIsoDate(row.created_at);
                const image = row.image_url ? String(row.image_url).trim() : '';
                const imageBlock = image
                    ? `\n    <image:image><image:loc>${escapeXml(image)}</image:loc></image:image>`
                    : '';
                return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>${imageBlock}\n  </url>`;
            })
            .filter(Boolean)
            .join('\n');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

        res.status(200).send(xml);
    } catch (err: any) {
        // Fail soft — return empty urlset so Search Console doesn't mark the sitemap as broken
        console.error('sitemap-blog generation failed:', err?.message || err);
        res.status(200).send(
            `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`
        );
    }
}
