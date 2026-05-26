import { useEffect } from 'react';

type JsonLd = Record<string, unknown> | Record<string, unknown>[];

interface SeoHeadProps {
  /** Document title. Already brand-suffixed if you want — pass full string. */
  title: string;
  /** Meta description (160 chars max for best SERP display). */
  description: string;
  /** Absolute canonical URL for this view. */
  canonical: string;
  /** Absolute OG image URL. Defaults to site OG image. */
  image?: string;
  /** og:type — 'website' | 'article' | 'profile' etc. */
  type?: string;
  /** Optional JSON-LD object (Article, CollectionPage, ItemList…). Injected as a dedicated <script>. */
  jsonLd?: JsonLd;
  /** Optional robots override (e.g. 'noindex, follow' for /admin). */
  robots?: string;
}

const DEFAULT_IMAGE = 'https://manishyadav.dev/weew.jpg';
const ROUTE_LD_ID = 'seo-route-jsonld';

function setMeta(selector: string, attr: 'content' | 'href', value: string) {
  let el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
  if (!el) {
    if (selector.startsWith('link')) {
      const link = document.createElement('link');
      // Extract rel from the selector if present
      const relMatch = selector.match(/rel="([^"]+)"/);
      if (relMatch) link.setAttribute('rel', relMatch[1]);
      el = link;
    } else {
      const meta = document.createElement('meta');
      const nameMatch = selector.match(/name="([^"]+)"/);
      const propMatch = selector.match(/property="([^"]+)"/);
      if (nameMatch) meta.setAttribute('name', nameMatch[1]);
      if (propMatch) meta.setAttribute('property', propMatch[1]);
      el = meta;
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

/**
 * Imperatively updates document head for SPA route SEO.
 * No dependency — pure DOM. Cleans up route-scoped JSON-LD on unmount.
 */
const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
  robots,
}) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    setMeta('meta[name="description"]', 'content', description);
    setMeta('link[rel="canonical"]', 'href', canonical);

    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', canonical);
    setMeta('meta[property="og:image"]', 'content', image);
    setMeta('meta[property="og:type"]', 'content', type);

    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:url"]', 'content', canonical);
    setMeta('meta[name="twitter:image"]', 'content', image);

    if (robots) {
      setMeta('meta[name="robots"]', 'content', robots);
    }

    // Route-scoped JSON-LD — replace any previous one
    if (jsonLd) {
      let script = document.getElementById(ROUTE_LD_ID) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = ROUTE_LD_ID;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }

    return () => {
      document.title = prevTitle;
      // Remove route-scoped JSON-LD when leaving the route
      const script = document.getElementById(ROUTE_LD_ID);
      if (script) script.remove();
      // Restore robots if we overrode it
      if (robots) {
        setMeta(
          'meta[name="robots"]',
          'content',
          'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
        );
      }
    };
  }, [title, description, canonical, image, type, jsonLd, robots]);

  return null;
};

export default SeoHead;
