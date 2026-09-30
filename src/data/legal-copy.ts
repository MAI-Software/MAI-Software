import type { Locale } from './company';

/**
 * Textos legales.
 *
 * Aquí solo se afirma lo que es verdad hoy y se puede comprobar: quién
 * aloja la web, qué recorrido hace un mensaje del formulario, qué guarda el
 * navegador y qué derechos tiene quien escribe. Los datos de identificación
 * (denominación, NIF, domicilio) NO se inventan: salen de company.legal y,
 * mientras estén vacíos, la página lo dice en vez de rellenar el hueco.
 */
export interface LegalSection {
  heading: Record<Locale, string>;
  paragraphs: Record<Locale, string[]>;
}

export const legalNotice: LegalSection[] = [
  {
    heading: { es: 'Objeto', en: 'Purpose' },
    paragraphs: {
      es: [
        'Este sitio web presenta los proyectos digitales de MAI Softwares —videojuegos, herramientas, calculadoras y webs— y ofrece una vía de contacto para encargos. Navegar por él es gratuito y no requiere registro.',
      ],
      en: [
        'This website presents the digital projects of MAI Softwares — games, tools, calculators and websites — and offers a way to get in touch about commissions. Browsing it is free and requires no account.',
      ],
    },
  },
  {
    heading: { es: 'Condiciones de uso', en: 'Terms of use' },
    paragraphs: {
      es: [
        'Al usar el sitio te comprometes a hacerlo conforme a la ley y a no intentar dañar su funcionamiento ni el de los servicios enlazados.',
        'Las demos enlazadas desde las fichas se ofrecen tal cual, sin garantía de disponibilidad continua: son proyectos en evolución y pueden cambiar o dejar de estar accesibles.',
      ],
      en: [
        'By using this site you agree to do so lawfully and not to attempt to damage its operation or that of the services linked from it.',
        'The demos linked from the project pages are offered as they are, with no guarantee of continuous availability: they are evolving projects and may change or stop being reachable.',
      ],
    },
  },
  {
    heading: { es: 'Cálculos y estimaciones', en: 'Calculations and estimates' },
    paragraphs: {
      es: [
        'Las calculadoras publicadas ofrecen estimaciones orientativas a partir de los datos que introduce cada persona. No constituyen asesoramiento fiscal, laboral, financiero ni médico, y no sustituyen la consulta con un profesional ni la información oficial de la Administración.',
      ],
      en: [
        'The calculators published here provide indicative estimates based on the figures each person enters. They are not tax, employment, financial or medical advice, and they do not replace a professional consultation or official information from the authorities.',
      ],
    },
  },
  {
    heading: { es: 'Propiedad intelectual', en: 'Intellectual property' },
    paragraphs: {
      es: [
        'El diseño, los textos, el código y las imágenes de los proyectos propios pertenecen a MAI Softwares, salvo indicación expresa. Algunos proyectos publican su código con licencia abierta: en ese caso manda la licencia del repositorio.',
        'Las capturas de webs de clientes se muestran con su permiso y las marcas que aparecen pertenecen a sus titulares.',
      ],
      en: [
        'The design, copy, code and images of our own projects belong to MAI Softwares unless stated otherwise. Some projects publish their code under an open licence: in that case the repository licence prevails.',
        'Screenshots of client websites are shown with their permission, and any trademarks shown belong to their owners.',
      ],
    },
  },
  {
    heading: { es: 'Enlaces a terceros', en: 'Third-party links' },
    paragraphs: {
      es: [
        'El sitio enlaza a demos, repositorios y webs de clientes alojados fuera de nuestro control. No respondemos del contenido ni de las políticas de esos destinos.',
      ],
      en: [
        'This site links to demos, repositories and client websites hosted outside our control. We are not responsible for the content or the policies of those destinations.',
      ],
    },
  },
  {
    heading: { es: 'Legislación aplicable', en: 'Applicable law' },
    paragraphs: {
      es: [
        'Esta relación se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales que correspondan conforme a derecho.',
      ],
      en: [
        'This relationship is governed by Spanish law. For any dispute, the parties submit to the courts having jurisdiction under the applicable rules.',
      ],
    },
  },
];

export const privacyPolicy: LegalSection[] = [
  {
    heading: { es: 'Qué datos se recogen', en: 'What data is collected' },
    paragraphs: {
      es: [
        'Solo los que escribes en el formulario de contacto: tu nombre, tu correo electrónico y el mensaje. No hay registro de usuarios, ni perfiles, ni datos que se pidan por detrás.',
        'La web no usa cookies de seguimiento ni herramientas de analítica. No sabemos cuánta gente la visita ni desde dónde.',
      ],
      en: [
        'Only what you type into the contact form: your name, your email address and your message. There are no user accounts, no profiles and no data collected behind the scenes.',
        'This site uses no tracking cookies and no analytics tools. We do not know how many people visit it or where from.',
      ],
    },
  },
  {
    heading: { es: 'Para qué se usan', en: 'What it is used for' },
    paragraphs: {
      es: [
        'Para leer tu mensaje y responderte. Nada más: no se usan para enviarte publicidad ni se ceden a terceros con fines comerciales.',
        'La base jurídica es tu consentimiento al enviar el formulario y, si el mensaje es un encargo, la aplicación de medidas precontractuales a petición tuya.',
      ],
      en: [
        'To read your message and reply to it. Nothing else: it is not used to send you marketing and it is not passed to third parties for commercial purposes.',
        'The legal basis is your consent when you submit the form and, where the message concerns a commission, pre-contractual steps taken at your request.',
      ],
    },
  },
  {
    heading: { es: 'Por dónde pasa tu mensaje', en: 'Where your message travels' },
    paragraphs: {
      es: [
        'El formulario se envía a través de Web3Forms, un servicio que recibe el mensaje y nos lo hace llegar por correo electrónico. Al enviarlo, tus datos pasan por su infraestructura; puedes consultar sus condiciones en web3forms.com.',
        'La web está alojada en Cloudflare Pages, que registra datos técnicos de las peticiones (como la dirección IP) con fines de seguridad y funcionamiento del servicio.',
      ],
      en: [
        'The form is submitted through Web3Forms, a service that receives the message and delivers it to us by email. When you send it, your data passes through their infrastructure; their terms are available at web3forms.com.',
        'The site is hosted on Cloudflare Pages, which logs technical request data (such as the IP address) for security and service operation.',
      ],
    },
  },
  {
    heading: { es: 'Qué guarda tu navegador', en: 'What your browser stores' },
    paragraphs: {
      es: [
        'Una sola preferencia: si has activado o silenciado la música de fondo. Se guarda en el almacenamiento local de tu navegador, no viaja a ningún servidor y desaparece si borras los datos del sitio.',
      ],
      en: [
        'A single preference: whether you turned the background music on or muted it. It is kept in your browser’s local storage, never travels to any server and disappears if you clear the site data.',
      ],
    },
  },
  {
    heading: { es: 'Cuánto tiempo se conservan', en: 'How long it is kept' },
    paragraphs: {
      es: [
        'Los mensajes se conservan mientras dure la conversación y el tiempo necesario para atender las obligaciones legales que se deriven de un encargo. Si prefieres que borremos el tuyo antes, dilo y se borra.',
      ],
      en: [
        'Messages are kept for as long as the conversation lasts and for as long as any legal obligations arising from a commission require. If you would rather we deleted yours sooner, say so and we will.',
      ],
    },
  },
  {
    heading: { es: 'Tus derechos', en: 'Your rights' },
    paragraphs: {
      es: [
        'Puedes pedir acceso a tus datos, su rectificación o su supresión, así como oponerte al tratamiento, limitarlo o solicitar su portabilidad. Basta con escribir por el mismo formulario indicando qué quieres.',
        'Si crees que no hemos atendido bien tu petición, puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).',
      ],
      en: [
        'You may request access to your data, its correction or its deletion, and you may object to processing, restrict it or ask for portability. Just write through the same form saying what you want.',
        'If you believe your request was not handled properly, you can complain to the Spanish Data Protection Agency (aepd.es).',
      ],
    },
  },
];
