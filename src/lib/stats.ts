import type { Locale } from '../data/company';
import { getProjects } from './projects';

/**
 * Cifras del hero. Se calculan desde la colección de proyectos para que no
 * puedan quedar desfasadas: añadir o quitar un proyecto las actualiza solo.
 */
export async function getStats(locale: Locale) {
  const projects = await getProjects(locale);

  return {
    /** Proyectos publicados en el portfolio. */
    total: projects.length,
    /** Con demo pública accesible. */
    live: projects.filter((p) => p.data.demoUrl).length,
    /** Disciplinas con al menos un proyecto. */
    disciplines: new Set(projects.map((p) => p.data.category)).size,
  };
}
