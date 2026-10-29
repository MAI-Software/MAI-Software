import type { Locale } from './company';

/**
 * Webs de demostración.
 *
 * Dos familias: las de creador (enlace en la biografía con media kit) y las
 * de negocio, más largas. Unas viven dentro de esta web y se pueden navegar
 * en el marco; otras son demos publicadas aparte, que no se dejan incrustar,
 * así que de esas se enseña una captura y se abren en una pestaña.
 *
 * `format` decide el marco: 'mobile' en teléfono (las verticales) y
 * 'desktop' en navegador.
 */
export interface DemoTemplate {
  slug: string;
  name: Record<Locale, string>;
  sector: Record<Locale, string>;
  pitch: Record<Locale, string>;
  /** Tres cosas que trae la plantilla, para la lista lateral. */
  highlights: Record<Locale, string[]>;
  format: 'mobile' | 'desktop';
  /** Color de acento, solo para el punto de la lista. */
  accent: string;
  /** Para quién es: ordena la lista y agrupa la página. */
  tier: 'creador' | 'negocio';
  /**
   * Demo publicada fuera de esta web. Va con cabeceras que prohíben
   * incrustarla, así que se enseña `shot` y se abre en pestaña nueva.
   */
  externalUrl?: string;
  /** Captura para las externas, en /public. */
  shot?: string;
  /** Todavía en obra: se lista pero no se puede abrir. */
  pronto?: boolean;
}

export const demoTemplates: DemoTemplate[] = [
  {
    slug: 'lua',
    name: { es: 'Web para creadores', en: 'Creator page' },
    sector: { es: 'Influencers y creadores', en: 'Influencers and creators' },
    pitch: {
      es: 'La que enseñamos a las marcas: portada con cifras reales, media kit descargable, tarifas por formato y formulario de colaboraciones. Vertical, pensada para el enlace de la biografía.',
      en: 'The one we show to brands: cover with real figures, downloadable media kit, rates by format and a collaboration form. Vertical, made for the bio link.',
    },
    highlights: {
      es: ['Cifras y media kit en PDF', 'Tarifas por formato', 'Formulario para marcas'],
      en: ['Figures and PDF media kit', 'Rates by format', 'Form for brands'],
    },
    format: 'mobile',
    accent: '#c0714a',
    tier: 'creador',
    externalUrl: 'https://demo-lua-marin.pages.dev/',
    shot: '/demos/lua.webp',
  },
  {
    slug: 'estetica',
    name: { es: 'Web para clínica estética', en: 'Aesthetic clinic website' },
    sector: { es: 'Medicina estética', en: 'Aesthetic medicine' },
    pitch: {
      es: 'La más completa de la lista, porque es donde más se juega: tratamientos con precio de partida, antes y después, equipo médico colegiado, financiación con cuotas y valoración gratuita a un clic.',
      en: 'The most complete of the set, because it is where most is at stake: treatments with a starting price, before and after, licensed medical team, financing with instalments and a free consultation one click away.',
    },
    highlights: {
      es: ['Precios y financiación a la vista', 'Antes y después con permiso', 'Valoración gratuita en dos pasos'],
      en: ['Prices and financing up front', 'Before and after with consent', 'Free consultation in two steps'],
    },
    format: 'desktop',
    tier: 'negocio',
    accent: '#b08b4f',
  },
  {
    slug: 'dental',
    name: { es: 'Web para clínica dental', en: 'Dental clinic website' },
    sector: { es: 'Salud', en: 'Health' },
    pitch: {
      es: 'La que genera confianza: tratamientos explicados en cristiano, el equipo con nombre y titulación, financiación clara y una primera visita fácil de pedir.',
      en: 'The one that builds trust: treatments explained in plain words, the team with names and credentials, clear financing and a first visit that is easy to book.',
    },
    highlights: {
      es: ['Tratamientos explicados sin tecnicismos', 'Equipo, titulación y seguros', 'Primera visita y financiación'],
      en: ['Treatments explained without jargon', 'Team, credentials and insurers', 'First visit and financing'],
    },
    format: 'desktop',
    tier: 'negocio',
    accent: '#3f8fd6',
  },
  {
    slug: 'abogados',
    name: { es: 'Web para despacho de abogados', en: 'Law firm website' },
    sector: { es: 'Servicios jurídicos', en: 'Legal services' },
    pitch: {
      es: 'Quien busca abogado tiene un problema y prisa: teléfono de guardia arriba, áreas de práctica con casos concretos, resultados con cifras y honorarios explicados antes de llamar.',
      en: 'Someone looking for a lawyer has a problem and no time: emergency line on top, practice areas with concrete cases, results with figures and fees explained before the call.',
    },
    highlights: {
      es: ['Guardia 24 h en cabecera', 'Honorarios en tres formatos', 'Resultados con cifras y plazos'],
      en: ['24 h line in the header', 'Fees in three formats', 'Results with figures and timelines'],
    },
    format: 'desktop',
    tier: 'negocio',
    accent: '#8c2f39',
  },
  {
    slug: 'tatuajes',
    name: { es: 'Web para estudio de tatuajes', en: 'Tattoo studio website' },
    sector: { es: 'Tatuaje y perforación', en: 'Tattoo and piercing' },
    pitch: {
      es: 'Portfolio por artista y por estilo, cómo se pide presupuesto con la idea y las referencias, señal y cuidados posteriores. Lo que pregunta todo el mundo antes de escribir.',
      en: 'Portfolio by artist and by style, how to ask for a quote with the idea and references, deposit and aftercare. What everyone asks before writing.',
    },
    highlights: {
      es: ['Portfolio por artista', 'Presupuesto con referencias', 'Señal y cuidados explicados'],
      en: ['Portfolio by artist', 'Quote with references', 'Deposit and aftercare explained'],
    },
    format: 'desktop',
    accent: '#d1495b',
    tier: 'negocio',
  },
  {
    slug: 'masajes',
    name: { es: 'Web para clínica de masajes', en: 'Massage clinic website' },
    sector: { es: 'Bienestar', en: 'Wellness' },
    pitch: {
      es: 'Tratamientos con su duración y su precio, quién los da y cómo pedir cita. Calma en el diseño y cero letra pequeña en las tarifas.',
      en: 'Treatments with their length and price, who gives them and how to book. Calm in the design and no small print in the rates.',
    },
    highlights: {
      es: ['Tratamientos con duración y precio', 'Bonos y primera sesión', 'Cita por WhatsApp o formulario'],
      en: ['Treatments with length and price', 'Packs and first session', 'Booking by WhatsApp or form'],
    },
    format: 'desktop',
    tier: 'negocio',
    accent: '#6f9c76',
  },
  {
    slug: 'restaurante',
    name: { es: 'Web para restaurante', en: 'Restaurant website' },
    sector: { es: 'Hostelería', en: 'Hospitality' },
    pitch: {
      es: 'Carta, horarios, cómo llegar y reserva. Lo que la gente busca en el móvil a las nueve de la noche, sin PDF que no se pueda leer ni menú escondido en una foto.',
      en: 'Menu, opening hours, directions and booking. What people look for on their phone at nine in the evening, with no unreadable PDF and no menu hidden inside a photo.',
    },
    highlights: {
      es: ['Carta por secciones, siempre legible', 'Horarios y cómo llegar', 'Reserva por teléfono o formulario'],
      en: ['Menu by section, always legible', 'Hours and directions', 'Booking by phone or form'],
    },
    format: 'desktop',
    tier: 'negocio',
    accent: '#e0793a',
  },
];

export const demoPath = (slug: string) => `/demos/plantillas/${slug}`;
