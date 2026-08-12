const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
};

const escapeHtml = (value: string) => value.replace(/[&<>"]/g, (c) => ESCAPES[c]!);

/**
 * Marca la palabra fuerte de un titular. En el texto se escribe entre
 * asteriscos (`Distintas formas de *crear*`) y aquí se convierte en el
 * degradado de marca en cursiva.
 *
 * `lastWordFallback` resalta la última palabra cuando no hay asteriscos:
 * lo usa el hero, que se comportaba así antes de existir la marca. Sin
 * esa opción, un texto sin marcar se devuelve tal cual.
 */
export function highlightTitle(title: string, lastWordFallback = false): string {
  if (title.includes('*')) {
    return escapeHtml(title).replace(
      /\*([^*]+)\*/g,
      (_, word: string) => `<span class="grad-text">${word}</span>`,
    );
  }

  if (!lastWordFallback) return escapeHtml(title);

  const cut = title.lastIndexOf(' ');
  if (cut === -1) return `<span class="grad-text">${escapeHtml(title)}</span>`;

  const start = escapeHtml(title.slice(0, cut));
  const end = escapeHtml(title.slice(cut + 1));
  return `${start} <span class="grad-text">${end}</span>`;
}
