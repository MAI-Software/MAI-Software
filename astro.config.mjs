// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/*
 * La web se publica en dos sitios con raíces distintas:
 *   - GitHub Pages (proyecto): https://mai-software.github.io/MAI-Software/
 *   - Cloudflare Pages:        https://<proyecto>.pages.dev/
 * Cloudflare define CF_PAGES en el build, así que ahí se sirve desde la raíz.
 * SITE_URL/BASE se pueden forzar con variables de entorno si llega un dominio.
 */
const isCloudflare = Boolean(process.env.CF_PAGES);

const SITE_URL =
  process.env.SITE_URL ??
  (isCloudflare
    ? process.env.CF_PAGES_URL || 'https://mai-softwares.pages.dev'
    : 'https://mai-software.github.io');

const BASE = process.env.BASE_PATH ?? (isCloudflare ? '/' : '/MAI-Software');

export default defineConfig({
  site: SITE_URL,
  base: BASE,
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es', en: 'en' },
      },
    }),
  ],
});
