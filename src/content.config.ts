/**
 * The docs as one collection: every chapter of every version of every book, as the collecting
 * script wrote it under `.docs/`.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const collections = {
  docs: defineCollection({
    loader: glob({
      pattern: '*/*/*.md',
      base: './.docs',
      // The path says the book and the version: two versions hold the same chapter.
      generateId: ({ entry }) => entry.replace(/\.md$/, ''),
    }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      book: z.string(),
      version: z.string(),
      chapter: z.string(),
      order: z.number(),
      source: z.string(),
    }),
  }),
};
