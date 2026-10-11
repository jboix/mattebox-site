/**
 * `bun run collect`: reads every book's chapters from its repository, at each version the site
 * publishes, and writes them where the pages read them.
 *
 * - `.docs/<book>/<version>/<chapter>.md`, each with its title, description and source in front.
 * - `.docs/manifest.json`, the books with their versions and chapters.
 * - `public/doc-assets/`, the images the chapters show, named by their content.
 * - `.docs/sizes.json`, the bars of the size charts each repository draws.
 *
 * A repository is read from the folder beside this one when it is there, and from a clone under
 * `.sources/` otherwise. `MATTEBOX_SOURCES` names another folder to look in.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { figures } from '../src/data/figures.ts';
import {
  type Book,
  books,
  type Chapter,
  githubOwner,
  type RepositoryName,
} from '../src/lib/books.ts';
import {
  describe,
  headingIds,
  type Insert,
  type Rewritten,
  rewriteAddresses,
  sectionOf,
  splitTitle,
  withInserts,
} from '../src/lib/markdown.ts';
import { parseSizeChart } from '../src/lib/size-chart.ts';
import { joinBase } from '../src/lib/url.ts';
import { type BookVersion, bookVersions, pickReleases } from '../src/lib/versions.ts';

const root = new URL('../', import.meta.url).pathname;
const output = join(root, '.docs');
const assets = join(root, 'public/doc-assets');
const base = process.env.SITE_BASE || '/';

/** A chapter as the manifest lists it. */
interface ManifestChapter {
  readonly slug: string;
  readonly title: string;
}

/** A version of a book as the manifest lists it. */
interface ManifestVersion extends BookVersion {
  /** The packages this version needs, with the range it asks for. */
  readonly needs: Readonly<Record<string, string>>;
  readonly chapters: readonly ManifestChapter[];
}

/**
 * Runs git in a repository.
 *
 * @param repository - The repository's folder.
 * @param args - The arguments.
 * @returns What git printed, or nothing when it failed.
 */
function git(repository: string, args: readonly string[]): Uint8Array | undefined {
  const result = Bun.spawnSync(['git', '-C', repository, ...args], { stderr: 'ignore' });
  return result.exitCode === 0 ? result.stdout : undefined;
}

/**
 * The folder of a repository: the one beside the site, or a clone made here.
 *
 * @param name - The repository.
 * @returns Its folder.
 */
function repositoryOf(name: RepositoryName): string {
  const beside = join(process.env.MATTEBOX_SOURCES || join(root, '..'), name);
  if (existsSync(join(beside, '.git'))) return beside;
  const clone = join(root, '.sources', `${name}.git`);
  const url = `https://github.com/${githubOwner}/${name}.git`;
  if (existsSync(clone)) {
    git(clone, ['fetch', '--quiet', '--tags', 'origin', '+refs/heads/main:refs/heads/main']);
    return clone;
  }
  mkdirSync(dirname(clone), { recursive: true });
  const cloned = Bun.spawnSync(['git', 'clone', '--quiet', '--bare', url, clone]);
  if (cloned.exitCode !== 0) throw new Error(`Could not clone ${url}.`);
  return clone;
}

/**
 * A file of a repository at a ref.
 *
 * @param repository - The repository's folder.
 * @param ref - The tag or branch.
 * @param path - The file's path.
 * @returns The file's bytes, or nothing when the ref has no such file.
 */
function fileAt(repository: string, ref: string, path: string): Uint8Array | undefined {
  return git(repository, ['show', `${ref}:${path}`]);
}

/**
 * The address on GitHub of a file or a folder of a repository.
 *
 * @param name - The repository.
 * @param ref - The tag or branch.
 * @param path - The path.
 * @returns The address.
 */
function githubUrl(name: RepositoryName, ref: string, path: string): string {
  const kind = extname(path) === '' ? 'tree' : 'blob';
  return `https://github.com/${githubOwner}/${name}/${kind}/${encodeURIComponent(ref)}/${path}`;
}

/** What a chapter's links are rewritten against. */
interface Place {
  readonly book: Book;
  readonly version: BookVersion;
  readonly chapter: Chapter;
  readonly repository: string;
  /** The ids of the chapter's own headings. */
  readonly ids: ReadonlySet<string>;
  /** The versions of every book. */
  readonly all: ReadonlyMap<string, readonly BookVersion[]>;
}

/**
 * Copies an image of a repository into the site's assets, named by its content, so the same
 * picture in two versions is one file.
 *
 * @param place - Where the image is shown.
 * @param path - The image's path in the repository.
 * @returns The image's address in the site, or nothing when the ref has no such file.
 */
function assetOf(place: Place, path: string): string | undefined {
  const bytes = fileAt(place.repository, place.version.ref, path);
  if (bytes === undefined) return undefined;
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 16);
  const name = `${hash}${extname(path)}`;
  mkdirSync(assets, { recursive: true });
  writeFileSync(join(assets, name), bytes);
  return joinBase(base, `doc-assets/${name}`);
}

/**
 * Where another book's pages are, seen from a page: its main branch from a page of a main
 * branch, since both describe what is not released yet, and its latest release otherwise.
 *
 * @param place - Where the link is.
 * @param book - The other book.
 * @returns The folder of that book's pages.
 */
function homeIn(place: Place, book: Book): string {
  const versions = place.all.get(book.id) ?? [];
  const wanted = versions.find((each) => (place.version.next ? each.next : each.latest));
  return (wanted ?? versions.find((each) => each.latest))?.path ?? `docs/${book.id}/`;
}

/**
 * The page of the site a repository file is published as.
 *
 * @param place - Where the link is.
 * @param path - The file's path in the repository.
 * @returns The page's path inside the site, or nothing for a file the site does not publish.
 */
function pageOf(place: Place, path: string): string | undefined {
  const inBook = (book: Book) =>
    book.chapters.find((each) => each.source === path && !each.section);
  const own = inBook(place.book);
  if (own !== undefined) return `${place.version.path}${own.slug}/`;
  for (const book of books) {
    if (book.repository !== place.book.repository) continue;
    const chapter = inBook(book);
    if (chapter !== undefined) return `${homeIn(place, book)}${chapter.slug}/`;
  }
  return undefined;
}

/**
 * What an address in a chapter becomes: a page of the site, an asset, or the file on GitHub.
 *
 * @param place - Where the address is.
 * @param url - The address as written.
 * @param image - Whether it is an image's.
 * @returns The new address.
 */
function rewrite(place: Place, url: string, image: boolean): Rewritten {
  if (/^[a-z][a-z0-9+.-]*:|^\/\//i.test(url)) return { url };
  const [target = '', fragment = ''] = url.split('#');
  const scheme = /^gh-(light|dark)-mode-only$/.exec(fragment)?.[1];
  const anchor = fragment === '' || scheme !== undefined ? '' : `#${fragment}`;
  const from = place.chapter.source;
  // A section is a part of its file: an anchor it does not hold is in the rest of the file.
  if (target === '' && (place.chapter.section === undefined || place.ids.has(fragment))) {
    return { url };
  }
  const path =
    target === ''
      ? from
      : normalize(target.startsWith('/') ? target.slice(1) : join(dirname(from), target));
  if (path.startsWith('..')) return { url };
  if (image) {
    const asset = assetOf(place, path);
    const className = scheme === undefined ? undefined : `on-${scheme}`;
    if (asset !== undefined)
      return className === undefined ? { url: asset } : { url: asset, className };
  }
  const page = pageOf(place, path);
  if (page !== undefined) return { url: `${joinBase(base, page)}${anchor}` };
  return { url: `${githubUrl(place.book.repository, place.version.ref, path)}${anchor}` };
}

/**
 * The site's screenshots for a chapter, as the HTML the chapter gets.
 *
 * @param book - The book.
 * @param chapter - The chapter.
 * @returns One insert per screenshot.
 */
function figuresOf(book: Book, chapter: Chapter): Insert[] {
  const mine = figures.filter((each) => each.book === book.id && each.chapter === chapter.slug);
  return mine.map((figure) => {
    const source = joinBase(base, `guide/${figure.file}`);
    const image = `<img src="${source}" alt="${figure.alt}" loading="lazy" />`;
    const html = `<figure class="shot">${image}<figcaption>${figure.caption}</figcaption></figure>`;
    return figure.after === undefined ? { html } : { after: figure.after, html };
  });
}

/**
 * Writes one chapter of one version, if the version has it.
 *
 * @param place - The book, version and chapter, without the chapter's headings.
 * @param order - The chapter's place in the book.
 * @returns The chapter for the manifest, or nothing when the version lacks it.
 */
function writeChapter(place: Omit<Place, 'ids'>, order: number): ManifestChapter | undefined {
  const { book, version, chapter } = place;
  const bytes = fileAt(place.repository, version.ref, chapter.source);
  if (bytes === undefined) return undefined;
  const text = new TextDecoder().decode(bytes);
  const whole = splitTitle(text, chapter.title ?? chapter.slug);
  const body = chapter.section === undefined ? whole.body : sectionOf(text, chapter.section);
  if (body === undefined) return undefined;
  const title = chapter.title ?? whole.title;
  const full = { ...place, ids: headingIds(body) };
  const front = {
    title,
    description: describe(body) || `${title}, in the ${book.name} docs of Mattebox.`,
    book: book.id,
    version: version.id,
    chapter: chapter.slug,
    order,
    source: githubUrl(book.repository, version.ref, chapter.source),
  };
  const lines = Object.entries(front).map(([key, value]) => `${key}: ${JSON.stringify(value)}`);
  const folder = join(output, book.id, version.id);
  mkdirSync(folder, { recursive: true });
  const rewritten = rewriteAddresses(body, (url, image) => rewrite(full, url, image));
  const markdown = withInserts(rewritten, figuresOf(book, chapter));
  writeFileSync(
    join(folder, `${chapter.slug}.md`),
    `---\n${lines.join('\n')}\n---\n\n${markdown}\n`,
  );
  return { slug: chapter.slug, title };
}

/**
 * The packages a version of a book needs from the rest of Mattebox.
 *
 * @param manifest - The package's manifest at that version.
 * @returns Each package with the range asked for.
 */
function needsOf(manifest: Record<string, unknown>): Record<string, string> {
  const ranges = {
    ...(manifest.dependencies as Record<string, string> | undefined),
    ...(manifest.peerDependencies as Record<string, string> | undefined),
  };
  const ours = Object.entries(ranges).filter(([name]) => /^(mattebox$|@mattebox\/)/.test(name));
  return Object.fromEntries(ours.sort(([a], [b]) => a.localeCompare(b)));
}

/**
 * The manifest of a book's package at a ref.
 *
 * @param repository - The repository's folder.
 * @param book - The book.
 * @param ref - The tag or branch.
 * @returns The manifest, empty when the ref has none.
 */
function manifestAt(repository: string, book: Book, ref: string): Record<string, unknown> {
  const bytes = fileAt(repository, ref, book.manifest);
  return bytes === undefined ? {} : JSON.parse(new TextDecoder().decode(bytes));
}

/**
 * The versions of a book, read from its repository's tags.
 *
 * @param book - The book.
 * @returns The versions, `next` first.
 */
function versionsOf(book: Book): BookVersion[] {
  const repository = repositoryOf(book.repository);
  const tags = new TextDecoder().decode(git(repository, ['tag', '--list']) ?? new Uint8Array());
  const releases = pickReleases(tags.split('\n'), book.tagPrefix);
  const next = String(manifestAt(repository, book, 'main').version ?? '0.0.0');
  return bookVersions(book.id, releases, next);
}

rmSync(output, { recursive: true, force: true });
rmSync(assets, { recursive: true, force: true });
mkdirSync(output, { recursive: true });

const versions = new Map(books.map((book) => [book.id, versionsOf(book)]));
const manifest = books.map((book) => {
  const repository = repositoryOf(book.repository);
  const listed: ManifestVersion[] = (versions.get(book.id) ?? []).map((version) => {
    const chapters = book.chapters.flatMap(
      (chapter, order) =>
        writeChapter({ book, version, chapter, repository, all: versions }, order) ?? [],
    );
    return { ...version, needs: needsOf(manifestAt(repository, book, version.ref)), chapters };
  });
  const kept = listed.filter((version) => version.chapters.length > 0);
  process.stdout.write(`${book.name}: ${kept.map((version) => version.id).join(', ')}\n`);
  return { id: book.id, versions: kept };
});
writeFileSync(join(output, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

/** The size charts the site shows, each on its repository's main branch. */
const charts = {
  engine: ['mattebox', 'docs/size-chart-light.svg'],
  presets: ['mattebox', 'docs/preset-chart-light.svg'],
  player: ['mattebox-player', 'docs/size-chart-light.svg'],
} as const;
const sizes = Object.fromEntries(
  Object.entries(charts).map(([name, [repository, path]]) => {
    const bytes = fileAt(repositoryOf(repository), 'main', path);
    if (bytes === undefined) throw new Error(`No ${path} in ${repository}.`);
    return [name, parseSizeChart(new TextDecoder().decode(bytes))];
  }),
);
writeFileSync(join(output, 'sizes.json'), `${JSON.stringify(sizes, null, 2)}\n`);
