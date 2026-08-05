import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Proyectos. Un archivo por idioma:
 *   src/content/projects/es/[slug].md
 *   src/content/projects/en/[slug].md
 * El slug del frontmatter debe coincidir en ambos idiomas.
 */
const projects = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/projects',
    // El id debe conservar el prefijo de idioma (es/…, en/…); sin esto el
    // loader usaría el campo `slug` del frontmatter y los dos idiomas colisionarían.
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.enum(['game', 'saas', 'web', 'calc']),
    excerpt: z.string(),

    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    /** Contenido de demostración (spec §33): se marca visiblemente en la web. */
    example: z.boolean().default(false),

    year: z.number(),
    status: z.enum([
      'Concepto',
      'Prototipo',
      'Demo',
      'En desarrollo',
      'Lanzado',
      'Archivado',
    ]),

    cover: z.string(),
    coverAlt: z.string(),
    gallery: z.array(z.string()).default([]),

    demoUrl: z.string().optional(),
    repositoryUrl: z.string().optional(),

    technologies: z.array(z.string()).default([]),
    services: z.array(z.string()).default([]),

    layoutVariant: z
      .enum(['featured', 'wide', 'split-left', 'split-right', 'compact', 'editorial'])
      .default('wide'),

    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

export const collections = { projects };
