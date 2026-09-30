import type { CollectionEntry } from 'astro:content';
import type { Locale } from '../data/company';

type ProjectData = CollectionEntry<'projects'>['data'];

/**
 * Datos estructurados de un proyecto.
 *
 * Solo se declara lo que consta en la ficha: nada de precios, valoraciones
 * ni sistemas operativos inventados para forzar un resultado enriquecido.
 */
const APPLICATION_CATEGORY: Record<ProjectData['category'], string> = {
  game: 'GameApplication',
  saas: 'BusinessApplication',
  calc: 'FinanceApplication',
  web: 'WebApplication',
};

interface Options {
  data: ProjectData;
  locale: Locale;
  /** Convierte una ruta del sitio en URL absoluta. */
  absolute: (path: string) => string;
  /** Ruta de la propia ficha. */
  path: string;
  organizationUrl: string;
}

export function projectSchema({ data, locale, absolute, path, organizationUrl }: Options) {
  const isGame = data.category === 'game';

  return {
    '@type': isGame ? 'VideoGame' : 'SoftwareApplication',
    name: data.title,
    description: data.excerpt,
    url: absolute(path),
    image: absolute(data.cover),
    applicationCategory: APPLICATION_CATEGORY[data.category],
    inLanguage: locale,
    dateCreated: String(data.year),
    publisher: { '@id': organizationUrl },
    ...(data.demoUrl ? { sameAs: [data.demoUrl] } : {}),
    ...(data.repositoryUrl ? { codeRepository: data.repositoryUrl } : {}),
    ...(data.technologies.length > 0 ? { keywords: data.technologies.join(', ') } : {}),
  };
}
