import type { Locale } from '../data/company';
import { withBase } from '../lib/base';
import { ui, type UIKey } from './ui';

export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return ui[locale][key];
  };
}

/** Home path for a locale. */
export function homePath(locale: Locale): string {
  return withBase(locale === 'es' ? '/' : '/en/');
}

/** Contact path for a locale. */
export function contactPath(locale: Locale): string {
  return withBase(locale === 'es' ? '/contacto' : '/en/contact');
}

/** Projects index path for a locale. */
export function projectsPath(locale: Locale): string {
  return withBase(locale === 'es' ? '/proyectos' : '/en/projects');
}

/** Project detail path for a locale. */
export function projectPath(locale: Locale, slug: string): string {
  return withBase(locale === 'es' ? `/proyectos/${slug}` : `/en/projects/${slug}`);
}
