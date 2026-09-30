const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
};

const escapeHtml = (value: string) => value.replace(/[&<>"]/g, (c) => ESCAPES[c]!);

/**
 * Marca la palabra fuerte de un titular. En el texto se escribe entre
 * asteriscos (`Distintas formas de *crear*`).
 *
 * Por defecto se resalta con tipografía —la palabra se estrecha y engorda
 * usando el eje de anchura de Bricolage—, no con color. El degradado se
 * reserva para el hero y la llamada final: repetido en cada sección era el
 * tópico visual de web generada con IA.
 *
 * `lastWordFallback` resalta la última palabra cuando no hay asteriscos:
 * lo usa el hero, que se comportaba así antes de existir la marca.
 */
export function highlightTitle(
  title: string,
  lastWordFallback = false,
  className: 'accent-word' | 'grad-text' = 'accent-word',
): string {
  // Un salto de línea en el texto corta el titular ahí
  const br = (value: string) => value.replace(/\n/g, '<br />');

  if (title.includes('*')) {
    return br(
      escapeHtml(title).replace(
        /\*([^*]+)\*/g,
        (_, word: string) => `<span class="${className}">${word}</span>`,
      ),
    );
  }

  if (!lastWordFallback) return br(escapeHtml(title));

  const cut = title.lastIndexOf(' ');
  if (cut === -1) return `<span class="${className}">${escapeHtml(title)}</span>`;

  const start = escapeHtml(title.slice(0, cut));
  const end = escapeHtml(title.slice(cut + 1));
  return `${start} <span class="${className}">${end}</span>`;
}
