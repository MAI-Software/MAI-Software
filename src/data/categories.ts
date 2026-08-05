import type { Locale } from './company';
import { withBase } from '../lib/base';

export type CategoryId = 'game' | 'saas' | 'web' | 'calc';

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
      es: 'Desarrollo de videojuegos para móvil y web, construidos alrededor de una mecánica propia y jugables desde las primeras semanas.',
      en: 'Video game development for mobile and web, built around an original mechanic and playable within the first few weeks.',
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
      es: 'Aplicaciones y herramientas a medida que automatizan el trabajo repetitivo y simplifican procesos, preparadas para crecer con el negocio.',
      en: 'Custom apps and tools that automate repetitive work and simplify processes, built to grow with the business.',
    },
  },
  {
    id: 'calc',
    number: '03',
    label: { es: 'Calculadoras', en: 'Calculators' },
    path: { es: '/calculadoras', en: '/en/calculators' },
    description: {
      es: 'Herramientas de cálculo laboral y fiscal que explican de dónde sale cada euro, sin registro y con los datos del año en curso.',
      en: 'Tax and payroll calculators that show where every euro comes from, with no sign-up and current-year figures.',
    },
    intro: {
      es: 'Calculadoras de sueldo, finiquito, autónomos, IVA e inversiones. Cálculo en tu navegador, sin registro y con los datos vigentes en España.',
      en: 'Calculators for salary, severance, freelancers, VAT and investments. Everything runs in your browser, with no sign-up and current Spanish figures.',
    },
  },
  {
    id: 'web',
    number: '04',
    label: { es: 'Webs', en: 'Webs' },
    path: { es: '/webs', en: '/en/webs' },
    description: {
      es: 'Sitios y experiencias digitales rápidas, visuales y orientadas a presentar, vender o validar una propuesta.',
      en: 'Fast, visual sites and digital experiences built to present, sell or validate a proposal.',
    },
    intro: {
      es: 'Diseño y desarrollo de páginas web a medida: rápidas, posicionadas en buscadores y pensadas para convertir visitas en clientes.',
      en: 'Custom website design and development: fast, search-friendly and built to turn visits into customers.',
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
