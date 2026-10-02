import type { Locale } from './company';

/**
 * Plantillas de demostración.
 *
 * Son webs de ejemplo completas, no capturas: cada una se abre y se navega.
 * Sirven para que un negocio vea en dos minutos cómo quedaría lo suyo, así
 * que el contenido es ficticio a propósito y está marcado como tal.
 *
 * `format` decide cómo se previsualiza: 'mobile' en marco de teléfono (las
 * verticales tipo enlace en la biografía) y 'desktop' en marco de navegador.
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
}

export const demoTemplates: DemoTemplate[] = [
  {
    slug: 'influencer',
    name: { es: 'Web para influencer', en: 'Influencer page' },
    sector: { es: 'Creadores de contenido', en: 'Content creators' },
    pitch: {
      es: 'Una página vertical pensada para la biografía de Instagram o TikTok: todos tus enlaces, tus últimos vídeos y las marcas con las que trabajas, en un solo sitio que abre en un segundo.',
      en: 'A vertical page made for your Instagram or TikTok bio: every link, your latest videos and the brands you work with, in one place that opens in a second.',
    },
    highlights: {
      es: ['Diseñada para verse en el móvil', 'Enlaces, vídeos y colaboraciones', 'Formulario para marcas'],
      en: ['Designed to be seen on a phone', 'Links, videos and brand deals', 'Form for brands'],
    },
    format: 'mobile',
    accent: '#ff3d8b',
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
    accent: '#8c2f39',
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
    accent: '#e0793a',
  },
];

export const demoPath = (slug: string) => `/demos/plantillas/${slug}`;
