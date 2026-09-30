import type { Locale } from './company';
import type { CategoryId } from './categories';

/**
 * Texto de fondo de cada disciplina.
 *
 * Las páginas de categoría eran una rejilla de tarjetas y poco más: ni
 * explicaban qué hacemos en esa disciplina ni le daban al buscador nada que
 * leer. Estos dos párrafos van debajo del listado, para que las fichas sigan
 * siendo lo primero.
 */
export const categoryAbout: Record<CategoryId, Record<Locale, string[]>> = {
  game: {
    es: [
      'Hacemos juegos pequeños y raros, de los que se entienden en diez segundos y se juegan de pie: un JRPG rítmico que lee tus golpes con la cámara del móvil, un limo líquido que se divide para bajar por un abismo, un juego de piano donde el teclado del portátil es el instrumento y un puzle de nudos que se desenreda con el dedo.',
      'Todos salen del mismo sitio: una mecánica que nos pica y un prototipo jugable a los pocos días. Lo que sobrevive a esa prueba se termina, se publica y se sigue tocando. Por eso verás juegos en vivo junto a otros en desarrollo, y por eso cada ficha dice en qué punto está el suyo.',
    ],
    en: [
      'We make small, odd games — the kind you understand in ten seconds and play standing up: a rhythm JRPG that reads your punches through the phone camera, a liquid slime that splits to descend an abyss, a piano game where the laptop keyboard is the instrument, and a knot puzzle you untangle with a finger.',
      'They all start the same way: a mechanic that nags at us and a playable prototype within days. Whatever survives that test gets finished, published and kept alive. That is why you will see live games next to ones still in development, and why every page says where its own stands.',
    ],
  },
  saas: {
    es: [
      'Nuestras herramientas nacen de un problema propio que no encontrábamos resuelto: llevar los gastos fotografiando tickets, montar presupuestos con buena pinta en un minuto, quitar el fondo de un vídeo sin subirlo a ningún servidor, organizar el contenido de redes cuando la cabeza va a saltos.',
      'Todas comparten la misma regla: tus datos se quedan en tu dispositivo. No hay cuenta que crear, no hay servidor nuestro guardando nada y no hay prueba gratuita que caduque. Se instalan como aplicación en el móvil o el escritorio y siguen funcionando sin conexión.',
    ],
    en: [
      'Our tools come out of problems we had ourselves and could not find solved: tracking expenses by photographing receipts, putting together a good-looking quote in a minute, removing a video background without uploading it anywhere, organising social content when your head jumps around.',
      'They all follow the same rule: your data stays on your device. There is no account to create, no server of ours holding anything and no trial that expires. They install as an app on your phone or desktop and keep working offline.',
    ],
  },
  calc: {
    es: [
      'Las cuentas que más se buscan en España están repartidas entre simuladores que piden registro, hojas de cálculo ajenas y artículos que no terminan de responder. Nosotros las hacemos de una en una y bien: IVA, nómina neta, cuota de autónomo, hipoteca, finiquito, pensión de jubilación e interés compuesto.',
      'Todas funcionan igual: entras, escribes tus números y ves el desglose completo, con la fórmula a la vista. El cálculo ocurre en tu navegador, así que nada de lo que escribes sale de tu equipo. Son estimaciones para entender tu situación y comparar escenarios, no asesoramiento.',
    ],
    en: [
      'The most-searched calculations in Spain are scattered across simulators that demand sign-up, someone else’s spreadsheets and articles that never quite answer. We build them one at a time and properly: VAT, net salary, freelance contributions, mortgages, severance, retirement pensions and compound interest.',
      'They all work the same way: type in your numbers and see the full breakdown, formula included. The maths runs in your browser, so nothing you type leaves your machine. They are estimates for understanding your situation and comparing scenarios, not advice.',
    ],
  },
  web: {
    es: [
      'Montamos webs para negocios y creadores que necesitan un sitio propio: una página que carga rápido, se ve bien en el móvil, explica lo que haces y deja claro cómo contactarte. Nada de plantillas infladas con veinte plugins que van lentos y hay que estar arreglando.',
      'Las hacemos estáticas y las publicamos en infraestructura con red de distribución mundial, así que abren rápido desde cualquier sitio y no hay panel que se quede desactualizado. El dominio va a tu nombre y no cobramos mantenimiento obligatorio. En la portada puedes ver webs de clientes ya en línea.',
    ],
    en: [
      'We build sites for businesses and creators who need a place of their own: a page that loads fast, looks right on a phone, explains what you do and makes it obvious how to reach you. No bloated templates with twenty plugins to keep patching.',
      'We build them static and publish them on infrastructure with a worldwide delivery network, so they open quickly from anywhere and there is no admin panel going stale. The domain is in your name and there is no compulsory maintenance fee. The home page shows client sites already online.',
    ],
  },
};
