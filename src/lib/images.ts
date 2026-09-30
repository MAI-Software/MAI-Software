import { withBase } from './base';

/**
 * Juego de portadas responsivas.
 *
 * Al lado de cada `cover.webp` (1280 px) hay un `cover-640.webp` y un
 * `cover-960.webp` generados en el repositorio. Un móvil de 375 px se bajaba
 * la imagen de escritorio entera; con esto se lleva la que le toca.
 */
export function coverSrcSet(cover: string): string | undefined {
  if (!cover.endsWith('.webp')) return undefined;
  const base = cover.replace(/\.webp$/, '');
  return [
    `${withBase(`${base}-640.webp`)} 640w`,
    `${withBase(`${base}-960.webp`)} 960w`,
    `${withBase(cover)} 1280w`,
  ].join(', ');
}
