/**
 * The books of the docs: one per deliverable, each read from its own repository and versioned by
 * its own release tags. This list is the one place that says which chapter belongs to which
 * deliverable.
 */

/** A repository the docs are read from. */
export type RepositoryName = 'mattebox' | 'mattebox-player' | 'mattebox-receiver';

/** One chapter of a book. */
export interface Chapter {
  /** The last part of the chapter's address. */
  readonly slug: string;
  /** The Markdown file in the repository. */
  readonly source: string;
  /**
   * A heading of the file. When set, the chapter is that section alone, for a deliverable whose
   * docs are a part of another's chapter.
   */
  readonly section?: string;
  /** The chapter's title, for a section, whose heading is not a title. */
  readonly title?: string;
}

/** A group of books on the docs home. */
type BookGroup = 'Engine' | 'Player' | 'Casting';

/** One deliverable's docs. */
export interface Book {
  /** The book's part of the address, such as `player-core`. */
  readonly id: string;
  /** The name a reader sees. */
  readonly name: string;
  /** The npm package. */
  readonly packageName: string;
  /** One sentence on what the deliverable is. */
  readonly summary: string;
  readonly group: BookGroup;
  readonly repository: RepositoryName;
  /** What a release tag starts with, before the version: `v` or `@mattebox/player-v`. */
  readonly tagPrefix: string;
  /** The package's manifest in the repository, for its version and what it needs. */
  readonly manifest: string;
  readonly chapters: readonly Chapter[];
}

/**
 * The chapters of a numbered guide folder.
 *
 * @param folder - The folder in the repository.
 * @param names - The files' names without the extension, such as `01-getting-started`.
 * @returns One chapter per file, its slug the name without the number.
 */
function guide(folder: string, names: readonly string[]): Chapter[] {
  return names.map((name) => ({
    slug: name.replace(/^\d+-/, ''),
    source: `${folder}/${name}.md`,
  }));
}

const playerGuide = 'docs/guide';

export const books: readonly Book[] = [
  {
    id: 'engine',
    name: 'Engine',
    packageName: 'mattebox',
    summary: 'The adaptive streaming engine for HLS and DASH: a kernel and the stages you add.',
    group: 'Engine',
    repository: 'mattebox',
    tagPrefix: 'v',
    manifest: 'package.json',
    chapters: [
      ...guide('docs/guide', [
        '01-getting-started',
        '02-presets-and-stages',
        '03-hls-and-dash',
        '04-live-streaming',
        '05-quality-and-abr',
        '06-audio-and-text',
        '07-drm',
        '08-legacy-transport-streams',
        '09-events-and-errors',
        '10-thumbnails',
        '11-network-and-cdn',
        '12-diagnostics',
        '13-builds-and-targets',
        '14-cdn',
        '15-chapters',
        '16-trick-play',
        '17-stage-reference',
      ]),
      { slug: 'architecture', source: 'docs/architecture.md' },
    ],
  },
  {
    id: 'player',
    name: 'Player',
    packageName: '@mattebox/player',
    summary: 'The <mattebox-player> element and its controls.',
    group: 'Player',
    repository: 'mattebox-player',
    tagPrefix: '@mattebox/player-v',
    manifest: 'packages/player/package.json',
    chapters: guide(playerGuide, [
      '01-getting-started',
      '03-the-element',
      '04-cdn',
      '09-connectors-and-trackers',
      '10-languages',
      '11-blocks-and-markers',
      '12-fallback-and-versions',
    ]),
  },
  {
    id: 'player-core',
    name: 'Player core',
    packageName: '@mattebox/player-core',
    summary: 'The headless layer under the element: sources, handlers, and the session.',
    group: 'Player',
    repository: 'mattebox-player',
    tagPrefix: '@mattebox/player-core-v',
    manifest: 'packages/core/package.json',
    chapters: guide(playerGuide, ['02-handlers']),
  },
  {
    id: 'playlist',
    name: 'Playlist',
    packageName: '@mattebox/player-playlist',
    summary:
      'A list of items for the player: next, previous, repeat, shuffle, and an up next card.',
    group: 'Player',
    repository: 'mattebox-player',
    tagPrefix: '@mattebox/player-playlist-v',
    manifest: 'packages/playlist/package.json',
    chapters: guide(playerGuide, ['07-playlist']),
  },
  {
    id: 'preferences',
    name: 'Preferences',
    packageName: '@mattebox/player-preferences',
    summary:
      "The viewer's tracks, volume, rate, quality and subtitle look, kept across programmes.",
    group: 'Player',
    repository: 'mattebox-player',
    tagPrefix: '@mattebox/player-preferences-v',
    manifest: 'packages/preferences/package.json',
    chapters: guide(playerGuide, ['08-preferences']),
  },
  {
    id: 'diagnostics',
    name: 'Diagnostics',
    packageName: '@mattebox/player-diagnostics',
    summary: 'Playback stats, charts, engine state and browser support, inside the player.',
    group: 'Player',
    repository: 'mattebox-player',
    tagPrefix: '@mattebox/player-diagnostics-v',
    manifest: 'packages/diagnostics/package.json',
    chapters: guide(playerGuide, ['05-diagnostics']),
  },
  {
    id: 'tv',
    name: 'TV navigation',
    packageName: '@mattebox/player-spatial-nav',
    summary: 'Remote control navigation for the player on Tizen, webOS and other TVs.',
    group: 'Player',
    repository: 'mattebox-player',
    tagPrefix: '@mattebox/player-spatial-nav-v',
    manifest: 'packages/spatial-nav/package.json',
    chapters: guide(playerGuide, ['06-tv']),
  },
  {
    id: 'cast-sender',
    name: 'Cast sender',
    packageName: '@mattebox/player-cast',
    summary: 'Chromecast from the player: the cast button and the screen shown while casting.',
    group: 'Casting',
    repository: 'mattebox-player',
    tagPrefix: '@mattebox/player-cast-v',
    manifest: 'packages/cast/package.json',
    chapters: [
      {
        slug: 'casting',
        source: `${playerGuide}/03-the-element.md`,
        section: 'Casting',
        title: 'Casting',
      },
    ],
  },
  {
    id: 'cast-receiver',
    name: 'Cast receiver',
    packageName: '@mattebox/cast-receiver',
    summary: "The bridge between Google's Cast receiver framework and the player.",
    group: 'Casting',
    repository: 'mattebox-receiver',
    tagPrefix: '@mattebox/cast-receiver-v',
    manifest: 'packages/cast-receiver/package.json',
    chapters: guide('docs/guide', ['01-getting-started', '02-loads', '03-deployment']),
  },
];

/** The owner of every repository on GitHub. */
export const githubOwner = 'jboix';
