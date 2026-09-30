import type { Locale } from './company';
import type { CategoryId } from './categories';

/**
 * Preguntas frecuentes por disciplina.
 *
 * Sirven a dos cosas a la vez: a quien llega desde el buscador con una duda
 * concreta, y al propio buscador, que las publica como FAQPage. Por eso las
 * respuestas dicen lo que de verdad hacemos hoy, sin plazos ni precios
 * inventados. Si algo cambia, se cambia aquí.
 */
export interface Faq {
  question: Record<Locale, string>;
  answer: Record<Locale, string>;
}

export const categoryFaqs: Record<CategoryId, Faq[]> = {
  game: [
    {
      question: {
        es: '¿Se pueden jugar ya o son solo maquetas?',
        en: 'Can I play them already, or are they just mockups?',
      },
      answer: {
        es: 'Los que aparecen como "En vivo" se juegan desde el navegador, sin instalar nada ni registrarse. Los marcados como "Próximamente" están en desarrollo y la ficha cuenta en qué punto están.',
        en: 'Anything marked "Live" runs in the browser, with nothing to install and no sign-up. The ones marked "Coming soon" are still in development, and each page says where they stand.',
      },
    },
    {
      question: {
        es: '¿Con qué tecnología están hechos?',
        en: 'What are they built with?',
      },
      answer: {
        es: 'TypeScript en todos. Según el juego, Three.js para el 3D, Blender para los modelos, la Web Audio API para el sonido a tiempo y MediaPipe para los que leen el movimiento con la cámara.',
        en: 'TypeScript across the board. Depending on the game: Three.js for 3D, Blender for the models, the Web Audio API for timing-critical sound, and MediaPipe for the ones that read body movement through the camera.',
      },
    },
    {
      question: {
        es: '¿Los juegos son gratis?',
        en: 'Are the games free?',
      },
      answer: {
        es: 'Las demos publicadas se juegan gratis y sin anuncios. Cada ficha enlaza directamente a la versión que está en línea.',
        en: 'The published demos are free to play and ad-free. Every project page links straight to the version that is online.',
      },
    },
    {
      question: {
        es: '¿Desarrolláis juegos por encargo?',
        en: 'Do you build games for other people?',
      },
      answer: {
        es: 'Sí. Trabajamos tanto proyectos propios como encargos: desde un prototipo jugable para validar una idea hasta un juego completo para web o móvil. Cuéntanos qué tienes en la cabeza.',
        en: 'Yes. We work on our own titles and on commissions: from a playable prototype to test an idea to a finished game for web or mobile. Tell us what you have in mind.',
      },
    },
  ],
  saas: [
    {
      question: {
        es: '¿Dónde se guardan mis datos?',
        en: 'Where is my data stored?',
      },
      answer: {
        es: 'En tu propio dispositivo. Nuestras herramientas funcionan en local: no hay cuenta que crear ni servidor nuestro donde acabe tu información. El acceso con Google llegará más adelante, y será opcional.',
        en: 'On your own device. Our tools run locally: there is no account to create and no server of ours where your information ends up. Google sign-in is coming later, and it will be optional.',
      },
    },
    {
      question: {
        es: '¿Hace falta registrarse para usarlas?',
        en: 'Do I need to sign up to use them?',
      },
      answer: {
        es: 'No. Se abren y se usan. Ni correo, ni contraseña, ni periodo de prueba.',
        en: 'No. You open them and use them. No email, no password, no trial period.',
      },
    },
    {
      question: {
        es: '¿Funcionan sin conexión?',
        en: 'Do they work offline?',
      },
      answer: {
        es: 'Las que están hechas como PWA se instalan en el móvil o el escritorio y siguen funcionando sin internet. Las que tienen APK, igual. En cada ficha se indica el formato.',
        en: 'The ones built as PWAs install on your phone or desktop and keep working without a connection. Same for the ones with an APK. Each project page states the format.',
      },
    },
    {
      question: {
        es: '¿Cuánto cuestan?',
        en: 'What do they cost?',
      },
      answer: {
        es: 'Las versiones publicadas son gratuitas. Si necesitas una herramienta a medida para tu negocio, eso sí es un encargo: cuéntanos el caso y te decimos qué implica.',
        en: 'The published versions are free. If you need a custom tool for your business that is a commission: tell us the case and we will tell you what it involves.',
      },
    },
  ],
  calc: [
    {
      question: {
        es: '¿Se envían mis datos a algún sitio?',
        en: 'Is my data sent anywhere?',
      },
      answer: {
        es: 'No. El cálculo ocurre en tu navegador: los números que escribes no salen de tu equipo ni se guardan en ningún servidor.',
        en: 'No. The maths happens in your browser: the numbers you type never leave your machine and are not stored on any server.',
      },
    },
    {
      question: {
        es: '¿Los resultados sirven como asesoramiento fiscal o laboral?',
        en: 'Can I treat the results as tax or employment advice?',
      },
      answer: {
        es: 'No. Son estimaciones para hacerte una idea y comparar escenarios. Cada situación tiene particularidades, así que para una decisión importante consulta con un profesional.',
        en: 'No. They are estimates to give you an idea and compare scenarios. Every situation has its quirks, so check with a professional before an important decision.',
      },
    },
    {
      question: {
        es: '¿Son gratuitas y hay que registrarse?',
        en: 'Are they free, and do I have to register?',
      },
      answer: {
        es: 'Gratuitas y sin registro. Se abren, se usa la que necesites y ya está.',
        en: 'Free and with no sign-up. Open the one you need, use it, done.',
      },
    },
    {
      question: {
        es: '¿Podéis hacer una calculadora para mi web?',
        en: 'Can you build a calculator for my site?',
      },
      answer: {
        es: 'Sí, es uno de los encargos que más hacemos: una calculadora propia, con tu marca, incrustada en tu web y con la fórmula que tú necesites.',
        en: 'Yes, it is one of our most common commissions: your own calculator, with your branding, embedded in your site and running the formula you need.',
      },
    },
  ],
  web: [
    {
      question: {
        es: '¿Qué incluye una web hecha con vosotros?',
        en: 'What does a website with you include?',
      },
      answer: {
        es: 'Diseño a medida, el montaje completo, la puesta en marcha con tu dominio y la web preparada para buscadores y para el móvil. Te decimos qué contenido hace falta y te guiamos para reunirlo.',
        en: 'A design of your own, the full build, going live on your domain, and the site ready for search engines and phones. We tell you which content is needed and walk you through gathering it.',
      },
    },
    {
      question: {
        es: '¿Hay cuotas mensuales?',
        en: 'Are there monthly fees?',
      },
      answer: {
        es: 'No cobramos mantenimiento obligatorio. El alojamiento de una web estática como las que hacemos es muy barato, y el dominio lo pagas tú una vez al año, a tu nombre.',
        en: 'We do not charge a compulsory maintenance fee. Hosting a static site like the ones we build is very cheap, and you pay for the domain once a year, in your own name.',
      },
    },
    {
      question: {
        es: '¿Y si ya tengo web pero está anticuada?',
        en: 'What if I already have a site but it is outdated?',
      },
      answer: {
        es: 'La miramos y te decimos qué conviene: a veces basta con rehacer el diseño y los textos manteniendo lo que ya funciona, y otras sale más a cuenta empezar de cero.',
        en: 'We look at it and tell you what makes sense: sometimes redoing the design and the copy while keeping what already works is enough, and sometimes starting over is the better deal.',
      },
    },
    {
      question: {
        es: '¿Trabajáis solo con negocios de vuestra zona?',
        en: 'Do you only work with local businesses?',
      },
      answer: {
        es: 'No. Todo el trabajo se hace en remoto y las webs que ves en la sección de clientes se han montado así, hablando por mensajes y llamadas.',
        en: 'No. Everything is done remotely, and the sites you see in the clients section were built that way, over messages and calls.',
      },
    },
  ],
};
