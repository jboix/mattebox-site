import { expect, test } from 'bun:test';
import { books } from './books.ts';
import { type CollectedBook, type CollectedVersion, chapterHref } from './docs.ts';

/**
 * A version of the engine book that has one chapter with the given headings.
 *
 * @param id - The version's id.
 * @param next - Whether it is the main branch.
 * @param sections - The ids of the chapter's headings.
 * @returns The version.
 */
function version(id: string, next: boolean, sections: string[]): CollectedVersion {
  return {
    id,
    note: '',
    path: `docs/engine/${id}/`,
    ref: next ? 'main' : `${id}.0`,
    version: '',
    latest: !next,
    next,
    needs: {},
    chapters: [{ slug: 'drm', title: 'DRM', sections }],
  };
}

// Astro sets the base at build time; Bun's `import.meta.env` is the process's environment.
process.env.BASE_URL = '/';

const engine = books.find((book) => book.id === 'engine');
if (engine === undefined) throw new Error('No engine book.');
const collected: CollectedBook[] = [
  {
    ...engine,
    versions: [
      version('next', true, ['clearkey', 'wiseplay']),
      version('v0.17', false, ['clearkey']),
    ],
  },
];

test('a section the release has links to the release', () => {
  expect(chapterHref(collected, ['engine', 'drm', 'ClearKey'])).toEndWith(
    'docs/engine/v0.17/drm/#clearkey',
  );
});

test('a section added since the release links to the main branch', () => {
  expect(chapterHref(collected, ['engine', 'drm', 'WisePlay'])).toEndWith(
    'docs/engine/next/drm/#wiseplay',
  );
});

test('a chapter without a section links to the release', () => {
  expect(chapterHref(collected, ['engine', 'drm'])).toEndWith('docs/engine/v0.17/drm/');
});
