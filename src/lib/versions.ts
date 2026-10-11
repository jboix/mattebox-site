/**
 * Which versions of a book the site publishes, and where each one lives. Pure functions: the
 * collecting script and the pages both read them, and the tests cover them without git.
 */

/** How many released minor versions a book keeps, beside `next`. */
const keptReleases = 3;

/** A release read from a tag. */
export interface Release {
  /** The version's id in an address, `v0.14`: the major and the minor. */
  readonly id: string;
  /** The tag, such as `@mattebox/player-v0.8.1`. */
  readonly tag: string;
  /** The full version, `0.8.1`. */
  readonly version: string;
}

/** One version of a book, as the site shows it. */
export interface BookVersion {
  /** `next`, or a release's id. */
  readonly id: string;
  /** What the version menu says under the id. */
  readonly note: string;
  /** The folder of the version's pages inside the site, ending in `/`. */
  readonly path: string;
  /** The git ref the pages were read from. */
  readonly ref: string;
  /** The package's version at that ref. */
  readonly version: string;
  /** Whether this is what a reader gets without choosing. */
  readonly latest: boolean;
  /** Whether this is the unreleased main branch. */
  readonly next: boolean;
}

interface Parsed extends Release {
  readonly parts: readonly [number, number, number];
}

/**
 * Reads a release from a tag.
 *
 * @param tag - The tag.
 * @param prefix - What the book's tags start with, before the version.
 * @returns The release, or nothing for another book's tag or a pre-release.
 */
function releaseOf(tag: string, prefix: string): Parsed | undefined {
  if (!tag.startsWith(prefix)) return undefined;
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(tag.slice(prefix.length));
  if (match === null) return undefined;
  const parts = [Number(match[1]), Number(match[2]), Number(match[3])] as const;
  return { id: `v${parts[0]}.${parts[1]}`, tag, version: parts.join('.'), parts };
}

/**
 * Orders two releases, the newer first.
 *
 * @param a - One release.
 * @param b - Another.
 * @returns A negative number when `a` is newer.
 */
function newestFirst(a: Parsed, b: Parsed): number {
  return b.parts[0] - a.parts[0] || b.parts[1] - a.parts[1] || b.parts[2] - a.parts[2];
}

/**
 * The releases a book publishes: the latest patch of each minor, the newest minors first, and
 * no more than the site keeps. A major is not special: `v1.0` follows `v0.14` in the same list.
 *
 * @param tags - Every tag of the repository.
 * @param prefix - What the book's tags start with.
 * @param kept - How many minors to keep.
 * @returns The releases, newest first.
 */
export function pickReleases(
  tags: readonly string[],
  prefix: string,
  kept = keptReleases,
): Release[] {
  const releases = tags.flatMap((tag) => releaseOf(tag, prefix) ?? []).sort(newestFirst);
  const latestPatches = releases.filter(
    (release, index) => releases.findIndex((other) => other.id === release.id) === index,
  );
  return latestPatches.slice(0, kept).map(({ id, tag, version }) => ({ id, tag, version }));
}

/**
 * The versions of a book, `next` first, then the releases from the newest. The newest release
 * lives at the book's own address. A book with no release yet has `next` there.
 *
 * @param bookId - The book's id.
 * @param releases - The book's releases, newest first.
 * @param nextVersion - The package's version on the main branch.
 * @returns The versions.
 */
export function bookVersions(
  bookId: string,
  releases: readonly Release[],
  nextVersion: string,
): BookVersion[] {
  const home = `docs/${bookId}/`;
  const released = releases.map((release, index) => ({
    id: release.id,
    note: index === 0 ? 'Latest release' : 'Older release',
    path: index === 0 ? home : `${home}${release.id}/`,
    ref: release.tag,
    version: release.version,
    latest: index === 0,
    next: false,
  }));
  const next: BookVersion = {
    id: 'next',
    note: 'Unreleased, on main',
    path: released.length === 0 ? home : `${home}next/`,
    ref: 'main',
    version: nextVersion,
    latest: released.length === 0,
    next: true,
  };
  return [next, ...released];
}
