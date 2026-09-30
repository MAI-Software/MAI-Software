// @ts-check
import { readdirSync, statSync } from 'node:fs';
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

// Dominio de produccion. NO usar CF_PAGES_URL: en cada build apunta al
// deploy concreto (https://<hash>.mai-software.pages.dev) y eso contaminaba
// canonicals y sitemap. Se puede sobrescribir con SITE_URL en las variables
// del proyecto de Cloudflare.
const CF_PROD_URL = 'https://mai-softwares.com';

const SITE_URL =
  process.env.SITE_URL ?? (isCloudflare ? CF_PROD_URL : 'https://mai-software.github.io');

const BASE = process.env.BASE_PATH ?? (isCloudflare ? '/' : '/MAI-Software');

/*
 * lastmod del sitemap. Para una ficha se usa la fecha del propio .md, que es
 * cuando se tocó ese proyecto; para el resto de rutas, la del build. Así el
 * rastreador distingue lo que ha cambiado de lo que lleva meses igual.
 */
const projectDates = new Map();
try {
  const dir = new URL('./src/content/projects/es/', import.meta.url);
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    projectDates.set(file.replace(/\.md$/, ''), statSync(new URL(file, dir)).mtime);
  }
} catch {
  // Sin fichas legibles el sitemap sigue saliendo, solo que con la fecha del build
}

const buildDate = new Date();

const lastmodFor = (url) => {
  const match = url.match(/\/(?:proyectos|projects)\/([^/]+)\/?$/);
  return (match && projectDates.get(match[1])) || buildDate;
};

export default defineConfig({
  site: SITE_URL,
  base: BASE,
  // Cloudflare Pages redirige 308 de /ruta a /ruta/, asi que la barra final
  // es la forma canonica y los enlaces deben emitirla ya (ver lib/base.ts).
  trailingSlash: 'always',
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
      serialize(item) {
        item.lastmod = lastmodFor(item.url);
        return item;
      },
    }),
  ],
});
