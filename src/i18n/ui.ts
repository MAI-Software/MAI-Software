import type { Locale } from '../data/company';

/**
 * Cadenas de interfaz. Todo texto variable vive aquí, no en componentes.
 */
export const ui = {
  es: {
    'skip.content': 'Saltar al contenido',
    'nav.menu': 'Menú',
    'nav.close': 'Cerrar menú',
    'nav.home': 'Inicio',
    'lang.switch': 'English version',
    'lang.label': 'EN',

    'hero.eyebrow': 'VIDEOJUEGOS · SAAS · CALCULADORAS · WEBS',
    'hero.title': 'Transformamos ideas en productos inolvidables',
    'hero.text':
      'Estudio de producto digital: diseñamos y desarrollamos videojuegos, herramientas SaaS y webs que se lanzan y crecen.',
    'cta.explore': 'Explorar proyectos',
    'cta.talk': 'Hablemos de tu proyecto',
    'cta.contact': 'Hablemos',
    'cta.viewProject': 'Ver proyecto',
    'cta.openDemo': 'Abrir demo',

    'facts.projects': 'Proyectos',
    'facts.live': 'Webs en producción',

    'categories.eyebrow': 'Qué hacemos',
    'categories.title': 'Cuatro disciplinas. Una misma forma de construir.',
    'categories.cta': 'Ver proyectos',
    'category.game.b1': 'Desarrollo de videojuegos para móvil y web',
    'category.game.b2': 'Prototipo jugable desde la primera semana',
    'category.game.b3': 'Mecánicas propias, no plantillas',
    'category.saas.b1': 'Aplicaciones y herramientas a medida',
    'category.saas.b2': 'Automatizamos el trabajo repetitivo',
    'category.saas.b3': 'Preparadas para crecer contigo',
    'category.web.b1': 'Páginas web a medida, sin plantillas',
    'category.web.b2': 'Rápidas y posicionadas en Google',
    'category.web.b3': 'Las actualizas tú, sin depender de nadie',

    'featured.label': 'Proyecto destacado',
    'feed.eyebrow': 'Trabajo reciente',
    'feed.title': 'Últimos proyectos',
    'feed.all': 'Ver todos los proyectos',

    'process.eyebrow': 'Cómo trabajamos',
    'process.title': 'De la idea al lanzamiento en tres pasos.',
    'process.1.title': 'Idea',
    'process.1.text':
      'Definimos el problema, la oportunidad y el resultado que debe conseguir el producto.',
    'process.1.b1': 'Problema y oportunidad',
    'process.1.b2': 'Resultado esperado',
    'process.1.b3': 'Alcance de la primera versión',
    'process.2.title': 'Diseño y desarrollo',
    'process.2.text':
      'Construimos una experiencia clara, funcional y visualmente sólida.',
    'process.2.b1': 'Sistema visual y UX',
    'process.2.b2': 'Desarrollo iterativo',
    'process.2.b3': 'Revisión continua',
    'process.3.title': 'Lanzamiento e iteración',
    'process.3.text':
      'Publicamos, medimos y mejoramos con una base preparada para evolucionar.',
    'process.3.b1': 'Publicación y medición',
    'process.3.b2': 'Mejora tras el lanzamiento',
    'process.3.b3': 'Base lista para crecer',

    'studio.title': 'Construimos producto, no solo pantallas.',
    'studio.text':
      'MAI Softwares combina desarrollo, diseño y pensamiento de producto para convertir ideas en experiencias digitales reales.',
    'studio.link': 'Conocer el estudio',

    'final.title': 'Tu próximo producto puede empezar con una conversación.',

    'projects.title': 'Todos los proyectos',
    'projects.intro':
      'Videojuegos, herramientas SaaS y páginas web que hemos desarrollado. Todos con demo abierta para que los pruebes.',
    'projects.filter.all': 'Todos',
    'projects.empty': 'Todavía no hay proyectos en esta categoría.',
    'projects.back': 'Volver a proyectos',
    'projects.year': 'Año',
    'projects.status': 'Estado',
    'projects.tech': 'Tecnologías',
    'projects.services': 'Servicios',
    'projects.category': 'Categoría',
    'projects.prev': 'Proyecto anterior',
    'projects.next': 'Proyecto siguiente',
    'projects.example': 'Proyecto de ejemplo',
    'projects.live': 'En vivo',

    'studio.page.title': 'Estudio',
    'studio.page.intro':
      'MAI Softwares es un estudio de producto digital que trabaja entre software, diseño y experiencias interactivas.',
    'studio.principles.title': 'Principios',
    'studio.principle.1': 'Claridad antes que ruido.',
    'studio.principle.2': 'Producto antes que decoración.',
    'studio.principle.3': 'Tecnología al servicio de una idea.',
    'studio.principle.4': 'Velocidad sin sacrificar criterio.',
    'studio.principle.5': 'Sistemas preparados para crecer.',
    'studio.areas.title': 'Áreas',
    'studio.tech.title': 'Tecnología',
    'studio.tech.text':
      'Trabajamos con tecnologías web modernas orientadas a rendimiento: TypeScript, Astro y herramientas ligeras según cada proyecto.',

    'contact.title': 'Cuéntanos qué quieres construir.',
    'contact.text':
      'Una idea, un producto que necesita mejorar o una oportunidad que todavía no tiene forma. Empecemos por entenderla.',
    'contact.email.pending':
      'Email de contacto en preparación. Mientras tanto, puedes encontrarnos en GitHub.',

    'form.name': 'Nombre',
    'form.email': 'Email',
    'form.subject': 'Asunto',
    'form.message': 'Cuéntanos tu proyecto',
    'form.messagePlaceholder': 'Qué quieres construir, para quién y en qué plazo.',
    'form.send': 'Enviar mensaje',
    'form.sending': 'Enviando…',
    'form.ok': 'Mensaje enviado. Te respondemos en breve.',
    'form.error': 'No se ha podido enviar. Inténtalo de nuevo o escríbenos por GitHub.',
    'form.required': 'Obligatorio',

    'links.title': 'Proyectos en vivo',
    'links.text': 'Todo lo que publicamos está abierto para que lo pruebes.',
    'links.github': 'Perfil de GitHub',
    'links.githubText': 'Código y proyectos del estudio.',

    'legal.title': 'Aviso legal',
    'legal.pending':
      'MAI Softwares se encuentra en fase de constitución. Los datos societarios se publicarán en esta página cuando el proceso esté completado.',
    'privacy.title': 'Privacidad',
    'privacy.text':
      'Esta web es un sitio estático: no utiliza cookies, no incluye herramientas de analítica y no recoge datos personales de sus visitantes.',

    'notfound.title': 'Página no encontrada',
    'notfound.text': 'La página que buscas no existe o ha cambiado de dirección.',
    'notfound.back': 'Volver al inicio',

    'footer.rights': 'Todos los derechos reservados.',
  },
  en: {
    'skip.content': 'Skip to content',
    'nav.menu': 'Menu',
    'nav.close': 'Close menu',
    'nav.home': 'Home',
    'lang.switch': 'Versión en español',
    'lang.label': 'ES',

    'hero.eyebrow': 'GAMES · SAAS · CALCULATORS · WEBS',
    'hero.title': 'We turn ideas into unforgettable products',
    'hero.text':
      'A digital product studio: we design and build video games, SaaS tools and websites that ship and grow.',
    'cta.explore': 'Explore projects',
    'cta.talk': "Let's talk about your project",
    'cta.contact': "Let's talk",
    'cta.viewProject': 'View project',
    'cta.openDemo': 'Open demo',

    'facts.projects': 'Projects',
    'facts.live': 'Live websites',

    'categories.eyebrow': 'What we do',
    'categories.title': 'Four disciplines. One way of building.',
    'categories.cta': 'View projects',
    'category.game.b1': 'Playable prototypes from day one',
    'category.game.b2': 'Mechanics at the core of the design',
    'category.game.b3': 'Experiences for mobile and web',
    'category.saas.b1': 'Clear, functional interfaces',
    'category.saas.b2': 'Process automation',
    'category.saas.b3': 'Foundations built to scale',
    'category.web.b1': 'Tailored editorial design',
    'category.web.b2': 'Careful performance and SEO',
    'category.web.b3': 'Easy to maintain and extend',

    'featured.label': 'Featured project',
    'feed.eyebrow': 'Recent work',
    'feed.title': 'Latest projects',
    'feed.all': 'View all projects',

    'process.eyebrow': 'How we work',
    'process.title': 'How we work',
    'process.1.title': 'Idea',
    'process.1.text':
      'We define the problem, the opportunity and the outcome the product must achieve.',
    'process.1.b1': 'Problem and opportunity',
    'process.1.b2': 'Expected outcome',
    'process.1.b3': 'Scope of the first version',
    'process.2.title': 'Design & development',
    'process.2.text':
      'We build a clear, functional and visually solid experience.',
    'process.2.b1': 'Visual system and UX',
    'process.2.b2': 'Iterative development',
    'process.2.b3': 'Continuous review',
    'process.3.title': 'Launch & iteration',
    'process.3.text':
      'We ship, measure and improve on a foundation built to evolve.',
    'process.3.b1': 'Ship and measure',
    'process.3.b2': 'Improve after launch',
    'process.3.b3': 'A base ready to grow',

    'studio.title': 'We build product, not just screens.',
    'studio.text':
      'MAI Softwares combines development, design and product thinking to turn ideas into real digital experiences.',
    'studio.link': 'About the studio',

    'final.title': 'Your next product can start with a conversation.',

    'projects.title': 'All projects',
    'projects.intro':
      'An archive of everything we build: video games, SaaS tools and web experiences.',
    'projects.filter.all': 'All',
    'projects.empty': 'No projects in this category yet.',
    'projects.back': 'Back to projects',
    'projects.year': 'Year',
    'projects.status': 'Status',
    'projects.tech': 'Technologies',
    'projects.services': 'Services',
    'projects.category': 'Category',
    'projects.prev': 'Previous project',
    'projects.next': 'Next project',
    'projects.example': 'Example project',
    'projects.live': 'Live',

    'studio.page.title': 'Studio',
    'studio.page.intro':
      'MAI Softwares is a digital product studio working across software, design and interactive experiences.',
    'studio.principles.title': 'Principles',
    'studio.principle.1': 'Clarity over noise.',
    'studio.principle.2': 'Product over decoration.',
    'studio.principle.3': 'Technology in service of an idea.',
    'studio.principle.4': 'Speed without sacrificing judgement.',
    'studio.principle.5': 'Systems built to grow.',
    'studio.areas.title': 'Areas',
    'studio.tech.title': 'Technology',
    'studio.tech.text':
      'We work with modern, performance-oriented web technologies: TypeScript, Astro and lightweight tools chosen per project.',

    'contact.title': 'Tell us what you want to build.',
    'contact.text':
      "An idea, a product that needs improving, or an opportunity that doesn't have a shape yet. Let's start by understanding it.",
    'contact.email.pending':
      'Contact email coming soon. In the meantime, you can find us on GitHub.',

    'form.name': 'Name',
    'form.email': 'Email',
    'form.subject': 'Subject',
    'form.message': 'Tell us about your project',
    'form.messagePlaceholder': 'What you want to build, who for, and by when.',
    'form.send': 'Send message',
    'form.sending': 'Sending…',
    'form.ok': "Message sent. We'll get back to you shortly.",
    'form.error': "Couldn't send it. Try again or reach us on GitHub.",
    'form.required': 'Required',

    'links.title': 'Live projects',
    'links.text': 'Everything we ship is open for you to try.',
    'links.github': 'GitHub profile',
    'links.githubText': "The studio's code and projects.",

    'legal.title': 'Legal notice',
    'legal.pending':
      'MAI Softwares is currently being incorporated. Company details will be published on this page once the process is complete.',
    'privacy.title': 'Privacy',
    'privacy.text':
      'This is a static website: it uses no cookies, includes no analytics tools and collects no personal data from visitors.',

    'notfound.title': 'Page not found',
    'notfound.text': "The page you're looking for doesn't exist or has moved.",
    'notfound.back': 'Back to home',

    'footer.rights': 'All rights reserved.',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UIKey = keyof (typeof ui)['es'];
