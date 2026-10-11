/**
 * The collected docs, as the pages read them: the books, their versions, and the chapters of
 * each version, from the manifest the collecting script wrote.
 */
import { readFileSync } from 'node:fs';
import { type Book, books } from './books.ts';
import type { BookVersion } from './versions.ts';

/** A chapter of a version. */
interface ChapterEntry {
  readonly slug: string;
  readonly title: string;
}

/** A version of a book, with what it holds. */
export interface CollectedVersion extends BookVersion {
  /** The Mattebox packages this version needs, with the range it asks for. */
  readonly needs: Readonly<Record<string, string>>;
  readonly chapters: readonly ChapterEntry[];
}

/** A book with its collected versions. */
export interface CollectedBook extends Book {
  readonly versions: readonly CollectedVersion[];
}

interface ManifestBook {
  readonly id: string;
  readonly versions: readonly CollectedVersion[];
}

/**
 * Reads the manifest. The build and the dev server both start in the site's folder.
 *
 * @returns The books of the manifest.
 */
function readManifest(): ManifestBook[] {
  return JSON.parse(readFileSync(`${process.cwd()}/.docs/manifest.json`, 'utf8'));
}

/**
 * Every book that has something collected, in the order the site lists them.
 *
 * @returns The books.
 */
export function collectedBooks(): CollectedBook[] {
  const manifest = readManifest();
  return books.flatMap((book) => {
    const versions = manifest.find((each) => each.id === book.id)?.versions ?? [];
    return versions.length === 0 ? [] : [{ ...book, versions }];
  });
}

/**
 * The version a reader gets without choosing.
 *
 * @param book - The book.
 * @returns Its latest release, or `next` for a book with none.
 */
export function latestOf(book: CollectedBook): CollectedVersion {
  const latest = book.versions.find((version) => version.latest) ?? book.versions[0];
  if (latest === undefined) throw new Error(`${book.name} has no version.`);
  return latest;
}

/**
 * The versions in the order the menu lists them: the latest release, the older ones, then main.
 *
 * @param book - The book.
 * @returns The versions.
 */
export function menuOrder(book: CollectedBook): CollectedVersion[] {
  const released = book.versions.filter((version) => !version.next);
  return [...released, ...book.versions.filter((version) => version.next)];
}

/**
 * The id of a chapter in the collection.
 *
 * @param book - The book's id.
 * @param version - The version's id.
 * @param slug - The chapter's slug.
 * @returns The id the loader gave the file.
 */
export function entryId(book: string, version: string, slug: string): string {
  return `${book}/${version}/${slug}`;
}

/**
 * What a version asks of the other packages, as a sentence.
 *
 * @param version - The version.
 * @returns The sentence, or nothing for a version that needs none.
 */
export function needsLine(version: CollectedVersion): string | undefined {
  const parts = Object.entries(version.needs).map(([name, range]) => `${name} ${range}`);
  return parts.length === 0 ? undefined : `Needs ${parts.join(' and ')}.`;
}
