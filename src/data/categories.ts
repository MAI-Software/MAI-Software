import type { Locale } from './company';
import { withBase } from '../lib/base';

export type CategoryId = 'game' | 'saas' | 'web';

export interface Category {
  id: CategoryId;
  number: string;
  label: Record<Locale, string>;
  path: Record<Locale, string>;
  description: Record<Locale, string>;
  intro: Record<Locale, string>;
}

const rawCategories: Category[] = [
  {
    id: 'game',
    number: '01',
    label: { es: 'Videojuegos', en: 'Games' },
    path: { es: '/videojuegos', en: '/en/games' },
    description: {
      es: 'Experiencias interactivas, prototipos y proyectos creados alrededor de una mecánica o una idea fuerte.',
      en: 'Interactive experiences, prototypes and projects built around a mechanic or a strong idea.',
    },
    intro: {
      es: 'Videojuegos y experiencias interactivas construidas alrededor de una idea, una mecánica o una forma distinta de jugar.',
      en: 'Video games and interactive experiences built around an idea, a mechanic or a different way to play.',
    },
  },
  {
    id: 'saas',
    number: '02',
    label: { es: 'SaaS', en: 'SaaS' },
    path: { es: '/saas', en: '/en/saas' },
    description: {
      es: 'Herramientas digitales que simplifican procesos, automatizan trabajo y resuelven problemas concretos.',
      en: 'Digital tools that simplify processes, automate work and solve specific problems.',
    },
    intro: {
      es: 'Productos y herramientas digitales pensados para simplificar procesos, automatizar tareas y crear valor de forma sostenible.',
      en: 'Digital products and tools designed to simplify processes, automate tasks and create sustainable value.',
    },
  },
  {
    id: 'web',
    number: '03',
    label: { es: 'Webs', en: 'Webs' },
    path: { es: '/webs', en: '/en/webs' },
    description: {
      es: 'Sitios y experiencias digitales rápidas, visuales y orientadas a presentar, vender o validar una propuesta.',
      en: 'Fast, visual sites and digital experiences built to present, sell or validate a proposal.',
    },
    intro: {
      es: 'Webs y experiencias digitales diseñadas para presentar una marca, validar una idea o convertir atención en acción.',
      en: 'Websites and digital experiences designed to present a brand, validate an idea or turn attention into action.',
    },
  },
];

/** Se exportan con el `base` de Astro ya aplicado a las rutas. */
export const categories: Category[] = rawCategories.map((cat) => ({
  ...cat,
  path: { es: withBase(cat.path.es), en: withBase(cat.path.en) },
}));

export function getCategory(id: CategoryId): Category {
  const found = categories.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown category: ${id}`);
  return found;
}
