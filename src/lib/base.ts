/**
 * Prefija una ruta absoluta del sitio con el `base` configurado en Astro.
 * Necesario porque la web se sirve bajo /MAI-Software/ en GitHub Pages.
 *
 * Ademas normaliza la barra final. Cloudflare Pages responde 308 de /ruta a
 * /ruta/, asi que los enlaces sin barra hacian que Google rastreara una
 * redireccion por cada pagina (15 URLs en Search Console como "Pagina con
 * redireccion") y que los hreflang apuntaran a una redireccion en vez de a la
 * pagina final. Los ficheros (con extension) se dejan tal cual.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

function isFile(path: string): boolean {
  const last = path.split('/').pop() ?? '';
  return last.includes('.');
}

export function withBase(path: string): string {
  if (!path.startsWith('/')) return path;
  const normalized = path.endsWith('/') || isFile(path) ? path : `${path}/`;
  return `${BASE}${normalized}` || '/';
}
