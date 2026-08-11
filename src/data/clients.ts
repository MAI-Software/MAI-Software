import type { Locale } from './company';

/**
 * Webs hechas para clientes.
 *
 * No se inventa nada aquí: cada entrada necesita nombre real, URL en
 * producción y el visto bueno del cliente para aparecer. Mientras la lista
 * esté vacía, la sección no se pinta.
 */
export interface ClientSite {
  /** Nombre del cliente o del proyecto, tal y como quiere que se le nombre. */
  name: string;
  /** URL pública. Se muestra el dominio debajo del nombre. */
  url: string;
  /** Una línea: qué es el sitio. */
  tagline: Record<Locale, string>;
  /** Captura opcional en /public/clients/<slug>.webp */
  image?: string;
  imageAlt?: Record<Locale, string>;
}

export const clientSites: ClientSite[] = [
  {
    name: 'Piccolo Teatro de la Toscana',
    url: 'https://piccolo-teatro.com/',
    tagline: {
      es: 'Web de la compañía de teatro social: repertorio, gira, talleres y contratación.',
      en: 'Site for the social theatre company: repertoire, tour dates, workshops and bookings.',
    },
    image: '/clients/piccolo-teatro.webp',
    imageAlt: {
      es: 'Portada de Piccolo Teatro de la Toscana con una actriz en escena',
      en: 'Piccolo Teatro de la Toscana home page with an actress on stage',
    },
  },
];
