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

    'music.play': 'Activar música',
    'music.pause': 'Silenciar música',

    'hero.eyebrow': 'VIDEOJUEGOS · SAAS · CALCULADORAS · WEBS',
    'hero.title': 'Transformamos ideas en productos inolvidables',
    'hero.text':
      'Diseñamos, desarrollamos y mantenemos productos digitales propios: videojuegos, calculadoras, herramientas SaaS y webs. Todo lo que ves está publicado y en uso.',
    'cta.explore': 'Explorar proyectos',
    'cta.talk': 'Hablemos de tu proyecto',
    'cta.contact': 'Hablemos',
    'cta.viewProject': 'Ver proyecto',
    'cta.openDemo': 'Abrir demo',
    'cta.openRepo': 'Ver código',

    'categories.eyebrow': 'Qué hacemos',
    /* El número lo pone el componente contando las disciplinas; no se
       escribe a mano para que nunca contradiga a las tarjetas. */
    'categories.title': '{n} disciplinas. Una misma forma de construir.',
    'categories.title.one': 'Una disciplina. Una misma forma de construir.',
    'categories.cta': 'Ver proyectos',
    'category.game.b1': 'Desarrollo de videojuegos para móvil y web',
    'category.game.b2': 'Prototipo jugable desde la primera semana',
    'category.game.b3': 'Mecánicas pensadas para cada juego',
    'category.saas.b1': 'Aplicaciones y herramientas a medida',
    'category.saas.b2': 'Automatizamos el trabajo repetitivo',
    'category.saas.b3': 'Preparadas para crecer contigo',
    'category.calc.b1': 'Sueldo, finiquito, autónomos, IVA e inversiones',
    'category.calc.b2': 'Cálculo en tu navegador, sin registro',
    'category.calc.b3': 'Con los datos vigentes en España',
    'category.web.b1': 'Webs rápidas, cuidadas y adaptadas a cada proyecto',
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
      'MAI Software combina desarrollo, diseño y pensamiento de producto para convertir ideas en experiencias digitales reales.',
    'studio.link': 'Conocer el estudio',

    'final.title': 'Tu próximo producto puede empezar con una conversación.',

    'projects.title': 'Todos los proyectos',
    'projects.intro':
      'Videojuegos, herramientas SaaS y páginas web que hemos desarrollado. Casi todos con demo abierta para que los pruebes.',
    'projects.filter.all': 'Todos',
    'projects.empty':
      'Trabajamos en esta disciplina, pero todavía no hay ningún proyecto publicado aquí. Cuéntanos el tuyo y lo construimos.',
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
    'projects.soon': 'Próximamente',

    'studio.page.title': 'Estudio',
    'studio.page.intro':
      'MAI Software es un estudio de producto digital que trabaja entre software, diseño y experiencias interactivas.',
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

    'upcoming.title': 'Lo próximo: acceso con Google',
    'upcoming.cta': 'Avísame cuando esté',
    'upcoming.prefill': 'Quiero que me aviséis cuando el acceso con Google esté disponible en {app}.',

    'links.title': 'Proyectos en vivo',
    'links.text': 'Todo lo que publicamos está abierto para que lo pruebes.',
    'links.github': 'Perfil de GitHub',
    'links.githubText': 'Código y proyectos del estudio.',

    'legal.title': 'Aviso legal',
    'legal.pending':
      'MAI Software se encuentra en fase de constitución. Los datos societarios se publicarán en esta página cuando el proceso esté completado.',
    'privacy.title': 'Privacidad',
    'privacy.text':
      'Esta web es un sitio estático: no utiliza cookies ni herramientas de analítica, y navegar por ella no requiere facilitar ningún dato.',
    /* TODO (revisión humana): falta el responsable del tratamiento, la base
       jurídica y el plazo de conservación. No se rellenan aquí para no
       inventar datos legales; añadirlos cuando la empresa esté constituida. */
    'privacy.form.title': 'Formulario de contacto',
    'privacy.form.text':
      'El único punto donde se recogen datos es el formulario de contacto. Al enviarlo, el nombre, el email y el mensaje se transmiten a Web3Forms, el servicio que los hace llegar por correo electrónico. Se usan solo para responderte y no se ceden con fines publicitarios.',

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

    'music.play': 'Turn music on',
    'music.pause': 'Mute music',

    'hero.eyebrow': 'GAMES · SAAS · CALCULATORS · WEBS',
    'hero.title': 'We turn ideas into unforgettable products',
    'hero.text':
      'We design, build and maintain our own digital products: games, calculators, SaaS tools and websites. Everything here is published and in use.',
    'cta.explore': 'Explore projects',
    'cta.talk': "Let's talk about your project",
    'cta.contact': "Let's talk",
    'cta.viewProject': 'View project',
    'cta.openDemo': 'Open demo',
    'cta.openRepo': 'View code',

    'categories.eyebrow': 'What we do',
    'categories.title': '{n} disciplines. One way of building.',
    'categories.title.one': 'One discipline. One way of building.',
    'categories.cta': 'View projects',
    'category.game.b1': 'Playable prototypes from day one',
    'category.game.b2': 'Mechanics at the core of the design',
    'category.game.b3': 'Experiences for mobile and web',
    'category.saas.b1': 'Clear, functional interfaces',
    'category.saas.b2': 'Process automation',
    'category.saas.b3': 'Foundations built to scale',
    'category.calc.b1': 'Salary, severance, freelancers, VAT and investments',
    'category.calc.b2': 'Runs in your browser, no sign-up',
    'category.calc.b3': 'Using current Spanish figures',
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
      'MAI Software combines development, design and product thinking to turn ideas into real digital experiences.',
    'studio.link': 'About the studio',

    'final.title': 'Your next product can start with a conversation.',

    'projects.title': 'All projects',
    'projects.intro':
      'An archive of everything we build: video games, SaaS tools and web experiences.',
    'projects.filter.all': 'All',
    'projects.empty':
      'We work in this discipline, but nothing is published here yet. Tell us about your project and we will build it.',
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
    'projects.soon': 'Coming soon',

    'studio.page.title': 'Studio',
    'studio.page.intro':
      'MAI Software is a digital product studio working across software, design and interactive experiences.',
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

    'upcoming.title': 'Up next: Google sign-in',
    'upcoming.cta': 'Tell me when it lands',
    'upcoming.prefill': 'Please let me know when Google sign-in is available in {app}.',

    'links.title': 'Live projects',
    'links.text': 'Everything we ship is open for you to try.',
    'links.github': 'GitHub profile',
    'links.githubText': "The studio's code and projects.",

    'legal.title': 'Legal notice',
    'legal.pending':
      'MAI Software is currently being incorporated. Company details will be published on this page once the process is complete.',
    'privacy.title': 'Privacy',
    'privacy.text':
      'This is a static website: it uses no cookies and no analytics tools, and browsing it requires no personal data.',
    'privacy.form.title': 'Contact form',
    'privacy.form.text':
      'The contact form is the only place where data is collected. On submit, your name, email and message are sent to Web3Forms, the service that delivers them by email. They are used only to reply to you and are never shared for advertising.',

    'notfound.title': 'Page not found',
    'notfound.text': "The page you're looking for doesn't exist or has moved.",
    'notfound.back': 'Back to home',

    'footer.rights': 'All rights reserved.',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UIKey = keyof (typeof ui)['es'];
