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
    'hero.title': 'De la idea a tus *manos*',
    'hero.text':
      'Creamos webs, herramientas, SaaS y videojuegos para que una idea deje de quedarse en la cabeza y empiece a existir.',
    'cta.explore': 'Ver proyectos',
    'cta.talk': 'Cuéntanos tu idea',
    'cta.contact': 'Hablemos',
    'cta.viewProject': 'Ver proyecto',
    'cta.openDemo': 'Abrir demo',
    'cta.openRepo': 'Ver código',

    'categories.eyebrow': 'Qué hacemos',
    /* El titular ya no cuenta disciplinas; se conservan las dos claves
       porque el componente sigue eligiendo entre ambas. */
    'categories.title': 'Distintas formas de *crear*.',
    'categories.title.one': 'Distintas formas de *crear*.',
    'categories.cta': 'Ver proyectos',
    'category.game.b1': 'Ideas hechas para jugar',
    'category.game.b2': 'Diseñamos mecánicas, mundos y experiencias interactivas',
    'category.game.b3': 'Empiezan como un concepto y terminan en manos del jugador',
    'category.saas.b1': 'Ideas que hacen el trabajo más fácil',
    'category.saas.b2': 'Herramientas para simplificar procesos y ahorrar tiempo',
    'category.saas.b3': 'Resuelven problemas reales sin complicarte la vida',
    'category.calc.b1': 'Lo complejo también puede sentirse sencillo',
    'category.calc.b2': 'Sueldo, finiquito, autónomos, IVA e inversiones',
    'category.calc.b3': 'Respuestas claras en tu navegador, sin registro',
    'category.web.b1': 'Una idea también necesita un lugar donde vivir',
    'category.web.b2': 'Webs rápidas, cuidadas y fáciles de usar',
    'category.web.b3': 'Para presentar proyectos, negocios e ideas con claridad',

    'featured.label': 'Proyecto destacado',
    'feed.eyebrow': 'Trabajo reciente',
    'feed.title': 'Últimos proyectos',
    'feed.all': 'Ver todos los proyectos',

    'process.eyebrow': 'Cómo trabajamos',
    'process.title': 'Así hacemos que una idea cobre vida.',
    'process.1.title': 'Entender',
    'process.1.text':
      'Primero escuchamos. Entendemos la idea, qué problema intenta resolver y qué tendría que pasar para que merezca la pena construirla.',
    'process.1.b1': 'Qué problema hay detrás',
    'process.1.b2': 'Qué tiene que conseguir',
    'process.1.b3': 'Por dónde empezar',
    'process.2.title': 'Dar forma',
    'process.2.text':
      'Diseñamos la experiencia, tomamos decisiones y empezamos a construir hasta convertir lo que estaba en la cabeza en algo que ya puedes tocar y probar.',
    'process.2.b1': 'Cómo se ve y cómo se usa',
    'process.2.b2': 'Se construye por partes',
    'process.2.b3': 'Lo pruebas mientras crece',
    'process.3.title': 'Hacerlo real',
    'process.3.text':
      'Lo lanzamos, lo usamos, aprendemos y seguimos mejorándolo. Porque una buena idea no termina cuando se publica.',
    'process.3.b1': 'Sale a la calle',
    'process.3.b2': 'Se ajusta con lo aprendido',
    'process.3.b3': 'Preparado para seguir creciendo',

    'clients.eyebrow': 'También construimos para otros',
    'clients.title': 'Ideas de otros que también hicimos realidad.',
    'clients.text':
      'Proyectos que empezaron con alguien contándonos lo que tenía en mente y hoy pueden visitarse, utilizarse y seguir creciendo.',

    'studio.title': 'Nos gusta imaginar. Más aún, hacerlo realidad.',
    'studio.text':
      'Hay proyectos que empiezan por necesidad, otros por curiosidad y algunos simplemente porque queríamos descubrir si podíamos hacerlos. Diseño y tecnología son las herramientas. Crear algo que antes no existía es la parte que nos mueve.',
    'studio.link': 'Conocer MAI',

    'final.title': '¿Qué idea tienes entre manos?',

    'projects.title': 'Ideas que ya existen.',
    'projects.intro':
      'Webs, videojuegos, herramientas y productos digitales que alguna vez fueron solo una idea y que hoy puedes abrir, probar, utilizar o jugar.',
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

    'studio.page.title': 'Hay ideas que merecen salir de la cabeza.',
    'studio.page.intro':
      'MAI nació de las ganas de crear cosas, aprender construyendo y convertir ideas en proyectos que otras personas pudieran usar, probar o jugar.',
    'studio.principles.title': 'Cómo pensamos',
    'studio.principle.1': 'Claridad. Si algo puede ser más sencillo, probablemente debería serlo.',
    'studio.principle.2': 'Utilidad. Cada decisión tiene que aportar algo a quien termina usando el proyecto.',
    'studio.principle.3': 'Curiosidad. Muchas ideas buenas empiezan preguntándonos qué pasaría si probáramos algo distinto.',
    'studio.principle.4': 'Evolución. Publicar no es terminar: es empezar a descubrir qué puede llegar a ser un proyecto.',
    'studio.principle.5': 'La tecnología es el medio, nunca el punto de partida.',
    'studio.areas.title': 'Una idea puede tomar muchas formas.',
    'studio.tech.title': 'Con qué lo hacemos',
    'studio.tech.text':
      'No empezamos por la tecnología: empezamos por entender qué queremos conseguir. Después elegimos herramientas ligeras y rápidas, normalmente TypeScript y Astro, según lo que pida cada proyecto.',

    'contact.title': '¿Qué idea tienes entre manos?',
    'contact.text':
      'Puede ser una web, una herramienta, un juego o algo que todavía no tenga nombre. Cuéntanos qué tienes en mente y vemos cómo hacerlo realidad.',
    'contact.email.pending':
      'Email de contacto en preparación. Mientras tanto, puedes encontrarnos en GitHub.',

    'form.name': 'Nombre',
    'form.email': 'Email',
    'form.subject': 'Asunto',
    'form.message': 'Cuéntanos tu idea',
    'form.messagePlaceholder': 'Qué tienes en mente, para quién es y cuándo te gustaría verlo funcionando.',
    'form.send': 'Enviar mensaje',
    'form.sending': 'Enviando…',
    'form.done': 'Enviado',
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
      'MAI Softwares se encuentra en fase de constitución. Los datos societarios se publicarán en esta página cuando el proceso esté completado.',
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

    'clients.eyebrow': 'Clients',
    'clients.title': 'A few websites we built for clients',
    'clients.text':
      'Projects we designed and developed for others. Every one is live and can be visited.',

    'studio.title': 'We build product, not just screens.',
    'studio.text':
      'MAI Softwares combines development, design and product thinking to turn ideas into real digital experiences.',
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
    'form.done': 'Sent',
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
      'MAI Softwares is currently being incorporated. Company details will be published on this page once the process is complete.',
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
