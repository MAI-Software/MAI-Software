import type { APIRoute } from 'astro';
import { withBase } from '../lib/base';

/**
 * robots.txt generado en build: el sitemap apunta al host y base reales,
 * que cambian entre GitHub Pages y Cloudflare Pages.
 */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(withBase('/sitemap-index.xml'), site);

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
