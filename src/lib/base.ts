/**
 * Prefija una ruta absoluta del sitio con el `base` configurado en Astro.
 * Necesario porque la web se sirve bajo /MAI-Software/ en GitHub Pages.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path: string): string {
  if (!path.startsWith('/')) return path;
  return `${BASE}${path}` || '/';
}
