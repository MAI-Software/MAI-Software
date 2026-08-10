import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../data/company';
import { categories, type CategoryId } from '../data/categories';

export type Project = CollectionEntry<'projects'>;

/** Orden de las disciplinas tal y como se declaran en categories.ts. */
const categoryOrder = new Map(categories.map((c, i) => [c.id, i]));

/**
 * Proyectos publicados de un idioma.
 * Manda el campo `order` del frontmatter, que puede cruzar disciplinas; el
 * resto (disciplina, año descendente, título) solo desempata. Así el listado
 * no depende del nombre de archivo.
 */
export async function getProjects(
  locale: Locale,
  category?: CategoryId,
): Promise<Project[]> {
  const all = await getCollection(
    'projects',
    (entry) =>
      entry.id.startsWith(`${locale}/`) &&
      entry.data.published &&
      (category ? entry.data.category === category : true),
  );

  return all.sort((a, b) => {
    const byOrder = a.data.order - b.data.order;
    if (byOrder !== 0) return byOrder;

    const byCategory =
      (categoryOrder.get(a.data.category) ?? 99) -
      (categoryOrder.get(b.data.category) ?? 99);
    if (byCategory !== 0) return byCategory;

    const byYear = b.data.year - a.data.year;
    if (byYear !== 0) return byYear;

    return a.data.title.localeCompare(b.data.title);
  });
}

/** Disciplinas con al menos un proyecto publicado. */
export async function getActiveCategories(locale: Locale) {
  const projects = await getProjects(locale);
  const used = new Set(projects.map((p) => p.data.category));
  return categories.filter((c) => used.has(c.id));
}

/** Proyecto destacado de portada (primero con featured: true). */
export async function getFeaturedProject(locale: Locale): Promise<Project | null> {
  const projects = await getProjects(locale);
  return projects.find((p) => p.data.featured) ?? projects[0] ?? null;
}

/** Anterior/siguiente dentro del archivo del idioma. */
export async function getProjectNeighbors(
  locale: Locale,
  slug: string,
): Promise<{ prev: Project | null; next: Project | null }> {
  const projects = await getProjects(locale);
  const index = projects.findIndex((p) => p.data.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: projects[index - 1] ?? null,
    next: projects[index + 1] ?? null,
  };
}
