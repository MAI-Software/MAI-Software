import type { Locale } from './company';
import { withBase } from '../lib/base';

export interface NavItem {
  label: Record<Locale, string>;
  href: Record<Locale, string>;
}

/** Rutas del sitio; se prefijan con el `base` de Astro al exportarse. */
const items: NavItem[] = [
  {
    label: { es: 'Proyectos', en: 'Projects' },
    href: { es: '/proyectos', en: '/en/projects' },
  },
  {
    label: { es: 'Videojuegos', en: 'Games' },
    href: { es: '/videojuegos', en: '/en/games' },
  },
  {
    label: { es: 'SaaS', en: 'SaaS' },
    href: { es: '/saas', en: '/en/saas' },
  },
  {
    label: { es: 'Webs', en: 'Webs' },
    href: { es: '/webs', en: '/en/webs' },
  },
  {
    label: { es: 'Estudio', en: 'Studio' },
    href: { es: '/estudio', en: '/en/studio' },
  },
  {
    label: { es: 'Contacto', en: 'Contact' },
    href: { es: '/contacto', en: '/en/contact' },
  },
];

const legalItems: NavItem[] = [
  {
    label: { es: 'Legal', en: 'Legal' },
    href: { es: '/legal', en: '/en/legal' },
  },
  {
    label: { es: 'Privacidad', en: 'Privacy' },
    href: { es: '/privacidad', en: '/en/privacy' },
  },
];

const applyBase = (list: NavItem[]): NavItem[] =>
  list.map((item) => ({
    label: item.label,
    href: { es: withBase(item.href.es), en: withBase(item.href.en) },
  }));

export const mainNav = applyBase(items);
export const footerNav = applyBase([...items, ...legalItems]);
