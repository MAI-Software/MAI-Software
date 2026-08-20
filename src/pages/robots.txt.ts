import type { APIRoute } from 'astro';
import { withBase } from '../lib/base';

/**
 * robots.txt generado en build.
 *
 * La misma web se publica en dos hosts (Cloudflare Pages y GitHub Pages).
 * Cloudflare es el canonico: es el que se indexa y el que recibira el dominio
 * propio. GitHub Pages queda como espejo y se marca Disallow para no competir
 * con contenido duplicado en Google.
 */
const isCloudflare = Boolean(import.meta.env.CF_PAGES ?? process.env.CF_PAGES);

export const GET: APIRoute = ({ site }) => {
  if (!isCloudflare) {
    return new Response('User-agent: *\nDisallow: /\n', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const sitemap = new URL(withBase('/sitemap-index.xml'), site);

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
