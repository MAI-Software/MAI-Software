/**
 * Datos corporativos de MAI Software.
 * Regla (spec §19): no publicar campos legales vacíos ni inventar datos.
 * Los campos vacíos son PENDIENTES y no deben renderizarse en la web.
 */
export const company = {
  name: 'MAI Software',
  shortName: 'MAI',

  tagline: {
    es: 'Convertimos ideas digitales en productos que se pueden ver, usar y recordar.',
    en: 'We turn digital ideas into products you can see, use and remember.',
  },
  description: {
    es: 'Webs, herramientas, SaaS y videojuegos que alguna vez fueron solo una idea.',
    en: 'We design and build video games, SaaS tools and web experiences.',
  },

  contact: {
    email: '', // PENDIENTE
    phone: '', // Opcional
    /**
     * Clave pública de Web3Forms (https://web3forms.com).
     * Es una clave de cliente: se puede publicar sin riesgo.
     * Mientras esté vacía, la página de contacto muestra los enlaces
     * directos en lugar de un formulario que no funcionaría.
     */
    web3formsKey: '6154ee34-d67a-43e8-8214-3d428b81b1f1',
  },

  social: {
    linkedin: '', // PENDIENTE
    github: 'https://github.com/MAI-Software',
    x: '', // PENDIENTE
    instagram: '', // PENDIENTE
    youtube: '', // PENDIENTE
  },

  legal: {
    legalName: '', // PENDIENTE de constitución
    taxId: '', // PENDIENTE de constitución
    address: '', // PENDIENTE de constitución
    status: 'pending',
  },
} as const;

export type Locale = 'es' | 'en';
